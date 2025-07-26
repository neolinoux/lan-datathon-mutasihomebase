import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const institutionId = searchParams.get('institution_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('Fetching analysis history...')
    console.log('User ID:', userId)
    console.log('Institution ID:', institutionId)

    let whereClause: any = {}

    if (userId) {
      whereClause.user_id = parseInt(userId)
    }

    if (institutionId) {
      whereClause.institution_id = parseInt(institutionId)
    }

    // Fetch analysis results with related data
    const analysisResults = await prisma.analysisResult.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        institution: {
          select: {
            id: true,
            name: true,
            full_name: true
          }
        },
        analysis_files: {
          select: {
            id: true,
            file_type: true,
            original_name: true,
            stored_path: true,
            file_size: true
          }
        },
        compliance_indicators: {
          select: {
            id: true,
            nama: true,
            encode_class: true,
            score_indikator: true
          }
        },
        recommendations: {
          select: {
            id: true,
            judul_rekomendasi: true,
            id_indikator: true
          }
        },
        related_regulations: {
          select: {
            id: true,
            judul_peraturan: true,
            instansi: true,
            tingkat_kepatuhan: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.analysisResult.count({
      where: whereClause
    })

    console.log(`Found ${analysisResults.length} analysis results`)

    return NextResponse.json({
      success: true,
      data: analysisResults,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Error fetching analysis history:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil riwayat analisis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 