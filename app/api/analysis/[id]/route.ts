import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication (optional for public access)
    const currentUser = getCurrentUser(request)

    const analysisId = parseInt(params.id)
    if (isNaN(analysisId)) {
      return NextResponse.json(
        { error: 'ID analisis tidak valid' },
        { status: 400 }
      )
    }

    // Build where clause based on user role (if authenticated)
    const whereClause: { id: number, institution_id?: number } = { id: analysisId }

    if (currentUser) {
      if (!(currentUser.role === 'admin' && currentUser.institutionId === 0)) {
        // Regular users can access analysis for their institution
        whereClause.institution_id = currentUser.institutionId
      }
    }
    // Non-authenticated users can access any analysis detail (no filtering)

    // Fetch analysis result with related data
    const analysisResult = await prisma.analysisResult.findFirst({
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
            detail_analisis: true,
            alasan_analisis: true,
            score_indikator: true
          }
        },
        recommendations: {
          select: {
            id: true,
            judul_rekomendasi: true,
            deskripsi_rekomendasi: true,
            id_indikator: true,
            langkah_rekomendasi: true
          }
        },
        related_regulations: {
          select: {
            id: true,
            judul_peraturan: true,
            instansi: true,
            tingkat_kepatuhan: true,
            url_pera: true
          }
        }
      }
    })

    if (!analysisResult) {
      return NextResponse.json(
        { error: 'Analisis tidak ditemukan' },
        { status: 404 }
      )
    }

    // Format response to match expected structure
    const formattedResponse = {
      status: 'success',
      message: 'Analisis ditemukan',
      timestamp: new Date().toISOString(),
      data: {
        id_dokumen: analysisResult.id,
        id_instansi: analysisResult.institution_id,
        judul_kegiatan: analysisResult.judul_kegiatan,
        deskripsi_kegiatan: analysisResult.deskripsi_kegiatan,
        include_dok_keuangan: analysisResult.include_dok_keuangan,
        path_dok_kegiatan: analysisResult.path_dok_kegiatan,
        path_dok_keuangan: analysisResult.path_dok_keuangan,
        data_response: {
          list_peraturan_terkait: analysisResult.related_regulations.map(reg => ({
            judul_peraturan: reg.judul_peraturan,
            instansi: reg.instansi,
            tingkat_kepatuhan: reg.tingkat_kepatuhan,
            url_pera: reg.url_pera
          })),
          indikator_compliance: analysisResult.compliance_indicators.map(ind => ({
            id_indikator: ind.id,
            nama: ind.nama,
            encode_class: ind.encode_class,
            detail_analisis: ind.detail_analisis,
            alasan_analisis: ind.alasan_analisis,
            score_indikator: ind.score_indikator
          })),
          summary_indicator_compliance: {
            tingkat_risiko: analysisResult.tingkat_risiko,
            score_compliance: analysisResult.score_compliance
          },
          rekomendasi_per_indikator: analysisResult.recommendations.map(rec => ({
            id_indikator: rec.id_indikator,
            judul_rekomendasi: rec.judul_rekomendasi,
            deskripsi_rekomendasi: rec.deskripsi_rekomendasi,
            langkah_rekomendasi: rec.langkah_rekomendasi
          }))
        }
      }
    }

    return NextResponse.json(formattedResponse)

  } catch (error) {
    console.error('Error fetching analysis detail:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil detail analisis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 