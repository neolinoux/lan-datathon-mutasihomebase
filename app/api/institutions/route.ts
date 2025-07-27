import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication (optional for public access)
    const currentUser = getCurrentUser(request)

    // Get institutions based on user role (if authenticated)
    let institutions
    if (currentUser) {
      if (currentUser.role === 'admin' && currentUser.institutionId === 0) {
        // Admin with institution_id 0 can see all institutions
        institutions = await prisma.institution.findMany({
          select: {
            id: true,
            name: true,
            full_name: true,
            category: true,
            address: true,
            phone: true,
            email: true,
            website: true,
            established_year: true,
            total_employees: true,
            is_active: true
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
            full_name: true,
            category: true,
            address: true,
            phone: true,
            email: true,
            website: true,
            established_year: true,
            total_employees: true,
            is_active: true
          }
        })
      }
    } else {
      // Non-authenticated users can see all institutions
      institutions = await prisma.institution.findMany({
        select: {
          id: true,
          name: true,
          full_name: true,
          category: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          established_year: true,
          total_employees: true,
          is_active: true
        },
        orderBy: {
          name: 'asc'
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const currentUser = getCurrentUser(request)
    if (!currentUser || !(currentUser.role === 'admin' && currentUser.institutionId === 0)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      name,
      full_name,
      category,
      address,
      phone,
      email,
      website,
      established_year,
      total_employees,
      is_active
    } = body

    // Validate required fields
    if (!name || !full_name || !category) {
      return NextResponse.json(
        { error: 'Nama, nama lengkap, dan kategori wajib diisi' },
        { status: 400 }
      )
    }

    // Check if institution name already exists
    const existingInstitution = await prisma.institution.findFirst({
      where: { name }
    })

    if (existingInstitution) {
      return NextResponse.json(
        { error: 'Nama instansi sudah ada' },
        { status: 400 }
      )
    }

    // Create new institution - explicitly exclude id to let database handle auto increment
    const institutionData = {
      name,
      full_name,
      category,
      address: address || '',
      phone: phone || '',
      email: email || '',
      website: website || '',
      established_year: established_year || new Date().getFullYear(),
      total_employees: total_employees || 0,
      is_active: is_active !== undefined ? is_active : true
    }

    const newInstitution = await prisma.institution.create({
      data: institutionData,
      select: {
        id: true,
        name: true,
        full_name: true,
        category: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        established_year: true,
        total_employees: true,
        is_active: true
      }
    })
    return NextResponse.json(newInstitution, { status: 201 })
  } catch (error) {
    console.error('Create institution error:', error)

    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Nama instansi sudah ada dalam database' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat membuat instansi' },
      { status: 500 }
    )
  }
} 