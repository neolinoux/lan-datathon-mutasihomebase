import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = parseInt(params.id)

    if (isNaN(analysisId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid analysis ID' },
        { status: 400 }
      )
    }

    console.log('Fetching analysis detail for ID:', analysisId)

    const analysis = await prisma.analysisResult.findUnique({
      where: { id: analysisId },
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
            file_size: true,
            mime_type: true
          }
        },
        compliance_indicators: {
          select: {
            id: true,
            id_indikator: true,
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
            id_indikator: true,
            judul_rekomendasi: true,
            deskripsi_rekomendasi: true,
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

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Convert to the format expected by the frontend components
    const formattedAnalysis = {
      status: 'success',
      message: 'Analisis dokumen berhasil',
      timestamp: analysis.created_at.toISOString(),
      data: {
        id_dokumen: analysis.analysis_id,
        id_instansi: analysis.institution_id.toString(),
        judul_kegiatan: analysis.judul_kegiatan,
        deskripsi_kegiatan: analysis.deskripsi_kegiatan,
        include_dok_keuangan: analysis.include_dok_keuangan,
        path_dok_kegiatan: analysis.path_dok_kegiatan,
        path_dok_keuangan: analysis.path_dok_keuangan,
        list_peraturan_terkait: analysis.related_regulations.map(reg => ({
          judul_peraturan: reg.judul_peraturan,
          instansi: reg.instansi,
          tingkat_kepatuhan: reg.tingkat_kepatuhan,
          url_pera: reg.url_pera
        })),
        indikator_compliance: analysis.compliance_indicators.map(ind => ({
          id_indikator: ind.id_indikator,
          nama: ind.nama,
          encode_class: ind.encode_class,
          detail_analisis: ind.detail_analisis,
          alasan_analisis: ind.alasan_analisis,
          score_indikator: ind.score_indikator
        })),
        summary_indicator_compliance: {
          tingkat_risiko: analysis.tingkat_risiko,
          score_compliance: analysis.score_compliance
        },
        rekomendasi_per_indikator: analysis.recommendations.map(rec => ({
          id_indikator: rec.id_indikator,
          judul_rekomendasi: rec.judul_rekomendasi,
          deskripsi_rekomendasi: rec.deskripsi_rekomendasi,
          langkah_rekomendasi: rec.langkah_rekomendasi
        }))
      }
    }

    console.log('Analysis detail fetched successfully')

    return NextResponse.json({
      success: true,
      data: formattedAnalysis
    })

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