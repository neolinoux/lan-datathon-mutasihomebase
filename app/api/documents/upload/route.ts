import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { put } from "@vercel/blob"

// Allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

// Max file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const institutionId = parseInt(formData.get('institutionId') as string)

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only PDF, Word, and Excel files are allowed'
      }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 10MB'
      }, { status: 400 })
    }

    // Check if user has access to this institution
    if (currentUser.role !== 'admin' && currentUser.institutionId !== institutionId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsDir, uniqueFilename)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save document metadata to database
    const document = await prisma.document.create({
      data: {
        title,
        description,
        filename: file.name,
        file_path: `/uploads/${uniqueFilename}`,
        file_size: file.size,
        file_type: file.type,
        institution_id: institutionId,
        uploaded_by: currentUser.userId
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

    // Update institution's total documents count
    await prisma.institution.update({
      where: { id: institutionId },
      data: {
        // Assuming we have a total_documents field, if not we can calculate it
        // total_documents: { increment: 1 }
      }
    })

    return NextResponse.json({
      message: 'File uploaded successfully',
      document: {
        id: document.id,
        title: document.title,
        description: document.description,
        filename: document.filename,
        file_path: document.file_path,
        file_size: document.file_size,
        file_type: document.file_type,
        institution: document.institution,
        uploaded_by: document.uploaded_by_user,
        created_at: document.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
} 