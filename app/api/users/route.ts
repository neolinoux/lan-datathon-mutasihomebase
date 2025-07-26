import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admin can access user list
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get users based on admin role
    let users
    if (!currentUser.institutionId) {
      // Super admin can see all users
      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_active: true,
          institution: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { institution_id: 'asc' },
          { name: 'asc' }
        ]
      })
    } else {
      // Institution admin can only see users from their institution
      users = await prisma.user.findMany({
        where: {
          institution_id: currentUser.institutionId
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_active: true,
          institution: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create user baru
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      )
    }

    const { name, email, password, role, institution_id } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Semua field diperlukan' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    // const hashedPassword = await hashPassword(password) // This line was removed as per the new_code

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        // password_hash: hashedPassword, // This line was removed as per the new_code
        role,
        institution_id: institution_id || null
      },
      include: {
        institution: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'User berhasil dibuat',
      user: newUser
    }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 