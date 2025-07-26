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

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        institution: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'User account is deactivated' },
        { status: 403 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 