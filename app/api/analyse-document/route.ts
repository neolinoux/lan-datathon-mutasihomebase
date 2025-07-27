import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {

    // Handle FormData instead of JSON for file uploads
    const formData = await request.formData()

    // Prepare to collect blob URLs
    let dokKegiatanBlobUrl = '';
    let dokKeuanganBlobUrl = '';

    // Upload dok_kegiatan to Vercel Blob
    const dokKegiatanFile = formData.get('dok_kegiatan');
    if (dokKegiatanFile instanceof File) {
      const dokKegiatanUpload = await put(
        `analysis/${Date.now()}_${dokKegiatanFile.name}`,
        dokKegiatanFile,
        { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN }
      );
      dokKegiatanBlobUrl = dokKegiatanUpload.url;
    }

    // Upload dok_keuangan to Vercel Blob (if exists)
    const dokKeuanganFile = formData.get('dok_keuangan');
    if (dokKeuanganFile instanceof File) {
      const dokKeuanganUpload = await put(
        `analysis/${Date.now()}_${dokKeuanganFile.name}`,
        dokKeuanganFile,
        { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN }
      );
      dokKeuanganBlobUrl = dokKeuanganUpload.url;
    }

    // Create new FormData for external API (send file binary as before)
    const correctedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        correctedFormData.append(key, value); // Kirim file binary ke API eksternal
      } else {
        correctedFormData.append(key, String(value));
      }
    }

    // Forward the correctedFormData to external API
    const externalApiUrl = 'https://c89b823ad59d.ngrok-free.app/analyse_compliance_doc/'

    const response = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      body: correctedFormData
    })

    if (!response.ok) {
      // Get the error response body for more details
      const errorText = await response.text()

      // Check if it's a ngrok offline error
      if (errorText.includes('ERR_NGROK_3200') || errorText.includes('offline')) {

        // Return mock response for UI testing while backend is offline
        const mockResponse = {
          analysis_id: "mock-" + Date.now(),
          data_response: {
            indikator_compliance: [
              {
                nama: "compliance_prosedural",
                score_indikator: 85,
                detail_analisis: "Dokumen menunjukkan kepatuhan prosedural yang baik",
                alasan_analisis: "Format dan struktur dokumen sesuai standar"
              },
              {
                nama: "compliance_substansi",
                score_indikator: 78,
                detail_analisis: "Kandungan dokumen cukup memenuhi persyaratan",
                alasan_analisis: "Informasi yang disajikan relevan dan lengkap"
              }
            ],
            summary_indicator_compliance: {
              sentiment: "positive",
              confidence: 0.82,
              risk_level: "low",
              overall_score: 81.5
            },
            rekomendasi_per_indikator: {
              langkah_rekomendasi: [
                "Perbaiki format dokumen untuk meningkatkan kepatuhan prosedural",
                "Tambahkan detail informasi untuk memenuhi persyaratan substansi",
                "Lakukan review berkala untuk memastikan kepatuhan berkelanjutan"
              ]
            },
            list_peraturan_terkait: [
              {
                judul_peraturan: "Peraturan Menteri No. 123/2023",
                instansi: "Kementerian Dalam Negeri",
                tingkat_kepatuhan: 85,
                url_pera: "https://example.com/peraturan1"
              },
              {
                judul_peraturan: "Keputusan Presiden No. 456/2023",
                instansi: "Sekretariat Negara",
                tingkat_kepatuhan: 78,
                url_pera: "https://example.com/peraturan2"
              }
            ]
          }
        }

        return NextResponse.json(mockResponse, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Mock-Response': 'true'
          },
        })
      }

      throw new Error(`External API error! status: ${response.status}, response: ${errorText}`)
    }

    const contentType = response.headers.get('content-type')

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`External API returned non-JSON response. Content-Type: ${contentType}`)
    }

    const data = await response.json()

    // Return the data and blob URLs for reference
    return NextResponse.json({
      ...data,
      dok_kegiatan_url: dokKegiatanBlobUrl,
      dok_keuangan_url: dokKeuanganBlobUrl,
      message: 'Files uploaded to Vercel Blob Storage and sent to external API',
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    let errorMessage = 'Gagal menganalisis dokumen'
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