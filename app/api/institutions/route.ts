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

    // Get institutions based on user role
    let institutions
    if (currentUser.role === 'admin' && !currentUser.institutionId) {
      // Super admin can see all institutions
      institutions = await prisma.institution.findMany({
        select: {
          id: true,
          name: true,
          category: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    } else {
      // Regular users can only see their institution
      institutions = await prisma.institution.findMany({
        where: {
          id: currentUser.institutionId
        },
        select: {
          id: true,
          name: true,
          category: true
        }
      })
    }

    return NextResponse.json(institutions)
  } catch (error) {
    console.error('Get institutions error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST /api/institutions - Create instansi baru
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      )
    }

    const { name, category, address, phone, email, website, founded_year, total_employees } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Nama instansi diperlukan' },
        { status: 400 }
      )
    }

    const newInstitution = await prisma.institution.create({
      data: {
        name,
        category,
        address,
        phone,
        email,
        website,
        founded_year: founded_year ? parseInt(founded_year) : null,
        total_employees: total_employees ? parseInt(total_employees) : null,
        total_documents: 0
      }
    })

    return NextResponse.json({
      message: 'Instansi berhasil dibuat',
      institution: newInstitution
    }, { status: 201 })
  } catch (error) {
    console.error('Create institution error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 