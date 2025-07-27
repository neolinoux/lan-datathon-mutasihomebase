import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication (optional for public access)
    const currentUser = getCurrentUser(request)

    // For dashboard data, use external API
    const response = await fetch('https://c89b823ad59d.ngrok-free.app/rekapitulasi_instansi', {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`External API error! status: ${response.status}`)
    }

    // Check content type
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text()
      throw new Error(`External API returned non-JSON response. Content-Type: ${contentType}`)
    }

    const data = await response.json()

    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('External API returned non-array data')
    }

    if (data.length === 0) {
      console.warn('External API returned empty array, using fallback data from database')

      // Use fallback data from local database
      const fallbackData = await prisma.institution.findMany({
        where: { is_active: true },
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
        }
      })

      // Transform to match expected format
      const transformedData = fallbackData.map(inst => ({
        id_instansi: inst.id,
        nama_instansi: inst.full_name,
        singkatan_instansi: inst.name,
        status_lembaga: inst.category,
        alamat: inst.address,
        no_telp: inst.phone,
        email: inst.email,
        website: inst.website,
        tahun_berdiri: `${inst.established_year}`,
        total_pegawai: inst.total_employees,
        total_peraturan: 0,
        update_terakhir: new Date().toISOString(),
        total_dokumen: 0,
        dm_total_dokumen: 0,
        mean_skor_kepatuhan: 0.8,
        dm_mean_skor_kepatuhan: 0.8,
        mean_sentiment_positive: 0.7,
        dm_mean_sentiment_positive: 0.7,
        total_user: 1,
        dm_total_user: 1,
        // Add default values for all required fields
        prosedural_class1: 0, prosedural_class2: 0, prosedural_class3: 0, prosedural_none: 0,
        prosedural_sentiment_positive: 0, prosedural_sentiment_negative: 0, prosedural_sentiment_neutral: 0, prosedural_sentiment_none: 0,
        efisiensi_anggaran_class1: 0, efisiensi_anggaran_class2: 0, efisiensi_anggaran_class3: 0, efisiensi_anggaran_none: 0,
        efisiensi_anggaran_sentiment_positive: 0, efisiensi_anggaran_sentiment_negative: 0, efisiensi_anggaran_sentiment_neutral: 0, efisiensi_anggaran_sentiment_none: 0,
        transparansi_class1: 0, transparansi_class2: 0, transparansi_class3: 0, transparansi_none: 0,
        transparansi_sentiment_positive: 0, transparansi_sentiment_negative: 0, transparansi_sentiment_neutral: 0, transparansi_sentiment_none: 0,
        regulasi_class1: 0, regulasi_class2: 0, regulasi_class3: 0, regulasi_none: 0,
        regulasi_sentiment_positive: 0, regulasi_sentiment_negative: 0, regulasi_sentiment_neutral: 0, regulasi_sentiment_none: 0,
        etika_antikorupsi_class1: 0, etika_antikorupsi_class2: 0, etika_antikorupsi_class3: 0, etika_antikorupsi_none: 0,
        etika_antikorupsi_sentiment_positive: 0, etika_antikorupsi_sentiment_negative: 0, etika_antikorupsi_sentiment_neutral: 0, etika_antikorupsi_sentiment_none: 0,
        pengelolaan_sumber_daya_class1: 0, pengelolaan_sumber_daya_class2: 0, pengelolaan_sumber_daya_class3: 0, pengelolaan_sumber_daya_none: 0,
        pengelolaan_sumber_daya_sentiment_positive: 0, pengelolaan_sumber_daya_sentiment_negative: 0, pengelolaan_sumber_daya_sentiment_neutral: 0, pengelolaan_sumber_daya_sentiment_none: 0,
        evalusi_rtl_class1: 0, evalusi_rtl_class2: 0, evalusi_rtl_class3: 0, evalusi_rtl_none: 0,
        evalusi_rtl_sentiment_positive: 0, evalusi_rtl_sentiment_negative: 0, evalusi_rtl_sentiment_neutral: 0, evalusi_rtl_sentiment_none: 0,
      }))

      // Filter data based on user role (if authenticated)
      let filteredData = transformedData
      if (currentUser) {
        if (!(currentUser.role === 'admin' && currentUser.institutionId === 0)) {
          // Regular users can only see their institution
          filteredData = transformedData.filter((inst: { id_instansi: number }) => inst.id_instansi === currentUser.institutionId)
        }
      }

      return NextResponse.json(filteredData, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      })
    }

    // Filter data based on user role (if authenticated)
    let filteredData = data
    if (currentUser) {
      if (!(currentUser.role === 'admin' && currentUser.institutionId === 0)) {
        // Regular users can only see their institution
        filteredData = data.filter((inst: { id_instansi: number }) => inst.id_instansi === currentUser.institutionId)
      }
      // Admin with institution_id 0 can see all data (no filtering needed)
    }
    // Non-authenticated users can see all data (no filtering)

    return NextResponse.json(filteredData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error in /api/instansi:', error)

    // Try to use fallback data from local database
    try {

      // Get current user again in fallback
      const currentUser = getCurrentUser(request)

      const fallbackData = await prisma.institution.findMany({
        where: { is_active: true },
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
        }
      })

      // Transform to match expected format
      const transformedData = fallbackData.map(inst => ({
        id_instansi: inst.id,
        nama_instansi: inst.full_name,
        singkatan_instansi: inst.name,
        status_lembaga: inst.category,
        alamat: inst.address,
        no_telp: inst.phone,
        email: inst.email,
        website: inst.website,
        tahun_berdiri: `${inst.established_year}`,
        total_pegawai: inst.total_employees,
        total_peraturan: 0,
        update_terakhir: new Date().toISOString(),
        total_dokumen: 0,
        dm_total_dokumen: 0,
        mean_skor_kepatuhan: 0.8,
        dm_mean_skor_kepatuhan: 0.8,
        mean_sentiment_positive: 0.7,
        dm_mean_sentiment_positive: 0.7,
        total_user: 1,
        dm_total_user: 1,
        // Add default values for all required fields
        prosedural_class1: 0, prosedural_class2: 0, prosedural_class3: 0, prosedural_none: 0,
        prosedural_sentiment_positive: 0, prosedural_sentiment_negative: 0, prosedural_sentiment_neutral: 0, prosedural_sentiment_none: 0,
        efisiensi_anggaran_class1: 0, efisiensi_anggaran_class2: 0, efisiensi_anggaran_class3: 0, efisiensi_anggaran_none: 0,
        efisiensi_anggaran_sentiment_positive: 0, efisiensi_anggaran_sentiment_negative: 0, efisiensi_anggaran_sentiment_neutral: 0, efisiensi_anggaran_sentiment_none: 0,
        transparansi_class1: 0, transparansi_class2: 0, transparansi_class3: 0, transparansi_none: 0,
        transparansi_sentiment_positive: 0, transparansi_sentiment_negative: 0, transparansi_sentiment_neutral: 0, transparansi_sentiment_none: 0,
        regulasi_class1: 0, regulasi_class2: 0, regulasi_class3: 0, regulasi_none: 0,
        regulasi_sentiment_positive: 0, regulasi_sentiment_negative: 0, regulasi_sentiment_neutral: 0, regulasi_sentiment_none: 0,
        etika_antikorupsi_class1: 0, etika_antikorupsi_class2: 0, etika_antikorupsi_class3: 0, etika_antikorupsi_none: 0,
        etika_antikorupsi_sentiment_positive: 0, etika_antikorupsi_sentiment_negative: 0, etika_antikorupsi_sentiment_neutral: 0, etika_antikorupsi_sentiment_none: 0,
        pengelolaan_sumber_daya_class1: 0, pengelolaan_sumber_daya_class2: 0, pengelolaan_sumber_daya_class3: 0, pengelolaan_sumber_daya_none: 0,
        pengelolaan_sumber_daya_sentiment_positive: 0, pengelolaan_sumber_daya_sentiment_negative: 0, pengelolaan_sumber_daya_sentiment_neutral: 0, pengelolaan_sumber_daya_sentiment_none: 0,
        evalusi_rtl_class1: 0, evalusi_rtl_class2: 0, evalusi_rtl_class3: 0, evalusi_rtl_none: 0,
        evalusi_rtl_sentiment_positive: 0, evalusi_rtl_sentiment_negative: 0, evalusi_rtl_sentiment_neutral: 0, evalusi_rtl_sentiment_none: 0,
      }))

      // Filter data based on user role (if authenticated)
      let filteredData = transformedData
      if (currentUser) {
        if (!(currentUser.role === 'admin' && currentUser.institutionId === 0)) {
          // Regular users can only see their institution
          filteredData = transformedData.filter((inst: { id_instansi: number }) => inst.id_instansi === currentUser.institutionId)
        }
      }

      return NextResponse.json(filteredData, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      })
    } catch (fallbackError) {
      console.error('Fallback data also failed:', fallbackError)
    }

    let errorMessage = 'Gagal mengambil data instansi'
    let errorDetails = 'Unknown error'

    if (error instanceof Error) {
      if (error.message.includes('non-JSON response')) {
        errorMessage = 'Server backend tidak tersedia atau endpoint salah'
        errorDetails = 'Backend mengembalikan response HTML bukan JSON'
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server backend'
        errorDetails = 'Network error atau server down'
      } else {
        errorDetails = error.message
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
} 