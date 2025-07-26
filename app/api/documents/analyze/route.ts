import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { analyzeDocument, generateVideoLearning } from '@/lib/ai-services'

export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { documentId, title, description } = await request.json()

    if (!documentId || !title || !description) {
      return NextResponse.json(
        { error: 'Document ID, title, dan description diperlukan' },
        { status: 400 }
      )
    }

    // Get document from database
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        institution: true
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Dokumen tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if user has access to this document
    if (currentUser.role !== 'admin' && document.institution_id !== currentUser.institutionId) {
      return NextResponse.json(
        { error: 'Unauthorized access to document' },
        { status: 403 }
      )
    }

    // TODO: Extract text content from document file
    // For now, we'll use a placeholder content
    const documentContent = `Konten dokumen ${document.filename} akan diekstrak di sini.`

    // Analyze document with AI
    const startTime = Date.now()
    const analysisResult = await analyzeDocument(documentContent, title, description)
    const processingTime = Date.now() - startTime

    // Generate video learning
    const videoLearning = await generateVideoLearning(analysisResult)

    // Save analysis result to database
    const savedAnalysis = await prisma.analysisResult.create({
      data: {
        document_id: documentId,
        institution_id: document.institution_id,
        analysis_type: 'compliance',
        result_data: analysisResult,
        ai_model_used: 'gpt-4',
        processing_time: processingTime
      }
    })

    // Update compliance indicators
    for (const indicator of analysisResult.compliance.indicators) {
      await prisma.complianceIndicator.upsert({
        where: {
          institution_id_indicator_name: {
            institution_id: document.institution_id,
            indicator_name: indicator.name
          }
        },
        update: {
          [indicator.status]: {
            increment: 1
          },
          calculated_at: new Date()
        },
        create: {
          institution_id: document.institution_id,
          indicator_name: indicator.name,
          indicator_type: 'document',
          [indicator.status]: 1,
          calculated_at: new Date()
        }
      })
    }

    return NextResponse.json({
      message: 'Analisis dokumen berhasil',
      analysis: {
        id: savedAnalysis.id,
        document: {
          id: document.id,
          title: document.title,
          filename: document.filename
        },
        compliance: analysisResult.compliance,
        sentiment: analysisResult.sentiment,
        recommendations: analysisResult.recommendations,
        relatedDocuments: analysisResult.relatedDocuments,
        videoLearning,
        processingTime
      }
    })
  } catch (error) {
    console.error('Document analysis error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menganalisis dokumen' },
      { status: 500 }
    )
  }
} 