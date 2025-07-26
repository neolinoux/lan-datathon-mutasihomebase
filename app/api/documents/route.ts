import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

// GET /api/documents - Get semua dokumen
export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')

    // Filter berdasarkan instansi jika user bukan admin
    const where = currentUser.role === 'admin'
      ? (institutionId ? { institution_id: parseInt(institutionId) } : {})
      : { institution_id: currentUser.institutionId }

    const documents = await prisma.document.findMany({
      where,
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        },
        uploaded_by_user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        analysis_results: {
          orderBy: {
            created_at: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create dokumen baru (metadata only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, filename, file_path, file_size, file_type, institution_id } = await request.json()

    if (!title || !filename || !file_path || !institution_id) {
      return NextResponse.json(
        { error: 'Title, filename, file_path, dan institution_id diperlukan' },
        { status: 400 }
      )
    }

    // Check if user has access to this institution
    if (currentUser.role !== 'admin' && currentUser.institutionId !== institution_id) {
      return NextResponse.json(
        { error: 'Unauthorized access to institution' },
        { status: 403 }
      )
    }

    const newDocument = await prisma.document.create({
      data: {
        title,
        description,
        filename,
        file_path,
        file_size: file_size ? parseInt(file_size) : null,
        file_type,
        institution_id: parseInt(institution_id),
        uploaded_by: currentUser.userId
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        },
        uploaded_by_user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Update total documents count
    await prisma.institution.update({
      where: { id: parseInt(institution_id) },
      data: {
        total_documents: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      message: 'Dokumen berhasil dibuat',
      document: newDocument
    }, { status: 201 })
  } catch (error) {
    console.error('Create document error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 