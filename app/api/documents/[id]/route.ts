import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = parseInt(params.id)
    if (isNaN(documentId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        institution: {
          select: { id: true, name: true }
        },
        uploaded_by_user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check if user has access to this document
    if (currentUser.role !== 'admin' && currentUser.institutionId !== document.institution_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = parseInt(params.id)
    if (isNaN(documentId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
    }

    const { title, description } = await request.json()

    // Validation
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    // Check if document exists and user has access
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (currentUser.role !== 'admin' && currentUser.institutionId !== existingDocument.institution_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update document
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        title,
        description
      },
      include: {
        institution: {
          select: { id: true, name: true }
        },
        uploaded_by_user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      message: 'Document updated successfully',
      document: updatedDocument
    })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = parseInt(params.id)
    if (isNaN(documentId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
    }

    // Check if document exists and user has access
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (currentUser.role !== 'admin' && currentUser.institutionId !== document.institution_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete file from disk
    const filePath = join(process.cwd(), 'public', document.file_path)
    if (existsSync(filePath)) {
      try {
        await unlink(filePath)
      } catch (error) {
        console.error('Error deleting file from disk:', error)
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId }
    })

    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 