import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const currentUser = getCurrentUser(request)
    if (!currentUser || !(currentUser.role === 'admin' && currentUser.institutionId === 0)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const institutionId = parseInt(params.id)
    if (isNaN(institutionId)) {
      return NextResponse.json(
        { error: 'ID instansi tidak valid' },
        { status: 400 }
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

    // Check if institution exists
    const existingInstitution = await prisma.institution.findUnique({
      where: { id: institutionId }
    })

    if (!existingInstitution) {
      return NextResponse.json(
        { error: 'Instansi tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if name already exists (excluding current institution)
    const duplicateInstitution = await prisma.institution.findFirst({
      where: {
        name,
        id: { not: institutionId }
      }
    })

    if (duplicateInstitution) {
      return NextResponse.json(
        { error: 'Nama instansi sudah ada' },
        { status: 400 }
      )
    }

    // Update institution
    const updatedInstitution = await prisma.institution.update({
      where: { id: institutionId },
      data: {
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
    })

    return NextResponse.json(updatedInstitution)
  } catch (error) {
    console.error('Update institution error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const currentUser = getCurrentUser(request)
    if (!currentUser || !(currentUser.role === 'admin' && currentUser.institutionId === 0)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const institutionId = parseInt(params.id)
    if (isNaN(institutionId)) {
      return NextResponse.json(
        { error: 'ID instansi tidak valid' },
        { status: 400 }
      )
    }

    // Check if institution exists
    const existingInstitution = await prisma.institution.findUnique({
      where: { id: institutionId }
    })

    if (!existingInstitution) {
      return NextResponse.json(
        { error: 'Instansi tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if institution is being used by users
    const usersWithInstitution = await prisma.user.findMany({
      where: { institution_id: institutionId }
    })

    if (usersWithInstitution.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus instansi yang masih memiliki pengguna' },
        { status: 400 }
      )
    }

    // Check if institution is being used by analysis results
    const analysisResultsWithInstitution = await prisma.analysisResult.findMany({
      where: { institution_id: institutionId }
    })

    if (analysisResultsWithInstitution.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus instansi yang masih memiliki hasil analisis' },
        { status: 400 }
      )
    }

    // Delete institution
    await prisma.institution.delete({
      where: { id: institutionId }
    })

    return NextResponse.json(
      { message: 'Instansi berhasil dihapus' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete institution error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 