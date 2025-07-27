import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const analysisResult = JSON.parse(formData.get('analysis_result') as string)
    const files = formData.getAll('files') as File[]
    const userId = parseInt(formData.get('user_id') as string)
    const institutionId = parseInt(formData.get('institution_id') as string)

    // Extract data from API response with better error handling
    let id_dokumen, judul_kegiatan, deskripsi_kegiatan, include_dok_keuangan, path_dok_kegiatan, path_dok_keuangan
    let list_peraturan_terkait, indikator_compliance, summary_indicator_compliance, rekomendasi_per_indikator

    try {
      const { data } = analysisResult
      id_dokumen = data.id_dokumen
      judul_kegiatan = data.judul_kegiatan
      deskripsi_kegiatan = data.deskripsi_kegiatan
      include_dok_keuangan = data.include_dok_keuangan
      path_dok_kegiatan = data.path_dok_kegiatan
      path_dok_keuangan = data.path_dok_keuangan

      const { data_response } = data
      list_peraturan_terkait = data_response.list_peraturan_terkait
      indikator_compliance = data_response.indikator_compliance
      summary_indicator_compliance = data_response.summary_indicator_compliance
      rekomendasi_per_indikator = data_response.rekomendasi_per_indikator
    } catch (extractError) {
      console.error('Error extracting data from analysis result:', extractError)
      throw new Error('Invalid analysis result structure')
    }

    // Create analysis result record
    const savedAnalysis = await prisma.analysisResult.create({
      data: {
        analysis_id: id_dokumen,
        institution_id: institutionId,
        user_id: userId,
        judul_kegiatan,
        deskripsi_kegiatan,
        include_dok_keuangan,
        path_dok_kegiatan,
        path_dok_keuangan,
        score_compliance: summary_indicator_compliance.score_compliance,
        tingkat_risiko: summary_indicator_compliance.tingkat_risiko,
        status: 'success'
      }
    })

    // Save files
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'analysis', institutionId.toString(), userId.toString())
    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      const timestamp = Date.now()
      const fileName = `${timestamp}_${file.name}`
      const filePath = join(uploadDir, fileName)

      // Save file to disk
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Determine file type
      const fileType = file.name.includes('keuangan') ? 'dok_keuangan' : 'dok_kegiatan'

      // Save file record to database
      await prisma.analysisFile.create({
        data: {
          analysis_id: savedAnalysis.id,
          file_type: fileType,
          original_name: file.name,
          stored_path: `uploads/analysis/${institutionId}/${userId}/${fileName}`,
          file_size: file.size,
          mime_type: file.type
        }
      })
    }

    // Save compliance indicators
    for (const indicator of indikator_compliance) {
      await prisma.analysisComplianceIndicator.create({
        data: {
          analysis_id: savedAnalysis.id,
          id_indikator: indicator.id_indikator,
          nama: indicator.nama,
          encode_class: indicator.encode_class,
          detail_analisis: indicator.detail_analisis,
          alasan_analisis: indicator.alasan_analisis,
          score_indikator: indicator.score_indikator
        }
      })
    }

    // Save recommendations
    for (const recommendation of rekomendasi_per_indikator) {
      await prisma.analysisRecommendation.create({
        data: {
          analysis_id: savedAnalysis.id,
          id_indikator: recommendation.id_indikator,
          judul_rekomendasi: recommendation.judul_rekomendasi,
          deskripsi_rekomendasi: recommendation.deskripsi_rekomendasi,
          langkah_rekomendasi: recommendation.langkah_rekomendasi
        }
      })
    }

    // Save related regulations
    for (const regulation of list_peraturan_terkait) {
      await prisma.analysisRelatedRegulation.create({
        data: {
          analysis_id: savedAnalysis.id,
          judul_peraturan: regulation.judul_peraturan,
          instansi: regulation.instansi,
          tingkat_kepatuhan: regulation.tingkat_kepatuhan,
          url_pera: regulation.url_pera
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis result saved successfully',
      analysis_id: savedAnalysis.id
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan hasil analisis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 