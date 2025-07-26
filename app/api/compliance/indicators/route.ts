import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

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

    // For now, return dummy data since we don't have real compliance data yet
    // In the future, this would query the database for real compliance metrics

    const dummyData = {
      "BPS": {
        nama: "Badan Pusat Statistik",
        kategori: "Lembaga Pemerintah Non Kementerian",
        alamat: "Jl. Dr. Sutomo No. 6-8, Jakarta Pusat",
        telp: "(021) 3841195",
        email: "bps@bps.go.id",
        web: "www.bps.go.id",
        didirikan: "1960",
        pegawai: "12,450",
        totalDokumen: "1,234",
        update: "2024-01-15",
        stats: [
          { label: "Total Dokumen", value: "1,234", change: "+12% dari bulan lalu" },
          { label: "Kepatuhan", value: "87%", change: "+5% dari bulan lalu" },
          { label: "Analisis Selesai", value: "892", change: "+23% dari bulan lalu" },
          { label: "Rekomendasi", value: "156", change: "+8% dari bulan lalu" }
        ],
        complianceDokumen: [
          {
            label: "Transparansi Keuangan",
            sangat: 45,
            sebagian: 23,
            tidak: 12,
            none: 20
          },
          {
            label: "Akuntabilitas Publik",
            sangat: 38,
            sebagian: 31,
            tidak: 15,
            none: 16
          }
        ],
        complianceSentimen: [
          {
            label: "Review Publik",
            positif: 52,
            netral: 28,
            negatif: 15,
            none: 5
          },
          {
            label: "Feedback Stakeholder",
            positif: 48,
            netral: 35,
            negatif: 12,
            none: 5
          }
        ]
      },
      "Kemenkeu": {
        nama: "Kementerian Keuangan",
        kategori: "Kementerian",
        alamat: "Jl. Lapangan Banteng Timur No. 2-4, Jakarta Pusat",
        telp: "(021) 3449230",
        email: "humas@kemenkeu.go.id",
        web: "www.kemenkeu.go.id",
        didirikan: "1945",
        pegawai: "8,920",
        totalDokumen: "2,156",
        update: "2024-01-20",
        stats: [
          { label: "Total Dokumen", value: "2,156", change: "+18% dari bulan lalu" },
          { label: "Kepatuhan", value: "92%", change: "+3% dari bulan lalu" },
          { label: "Analisis Selesai", value: "1,234", change: "+15% dari bulan lalu" },
          { label: "Rekomendasi", value: "89", change: "+12% dari bulan lalu" }
        ],
        complianceDokumen: [
          {
            label: "Transparansi Keuangan",
            sangat: 58,
            sebagian: 25,
            tidak: 8,
            none: 9
          },
          {
            label: "Akuntabilitas Publik",
            sangat: 52,
            sebagian: 28,
            tidak: 12,
            none: 8
          }
        ],
        complianceSentimen: [
          {
            label: "Review Publik",
            positif: 65,
            netral: 22,
            negatif: 10,
            none: 3
          },
          {
            label: "Feedback Stakeholder",
            positif: 61,
            netral: 28,
            negatif: 8,
            none: 3
          }
        ]
      },
      "Kemendagri": {
        nama: "Kementerian Dalam Negeri",
        kategori: "Kementerian",
        alamat: "Jl. Medan Merdeka Utara No. 7, Jakarta Pusat",
        telp: "(021) 34832556",
        email: "humas@kemendagri.go.id",
        web: "www.kemendagri.go.id",
        didirikan: "1945",
        pegawai: "6,780",
        totalDokumen: "987",
        update: "2024-01-18",
        stats: [
          { label: "Total Dokumen", value: "987", change: "+8% dari bulan lalu" },
          { label: "Kepatuhan", value: "78%", change: "+7% dari bulan lalu" },
          { label: "Analisis Selesai", value: "654", change: "+19% dari bulan lalu" },
          { label: "Rekomendasi", value: "123", change: "+6% dari bulan lalu" }
        ],
        complianceDokumen: [
          {
            label: "Transparansi Keuangan",
            sangat: 32,
            sebagian: 35,
            tidak: 18,
            none: 15
          },
          {
            label: "Akuntabilitas Publik",
            sangat: 28,
            sebagian: 38,
            tidak: 22,
            none: 12
          }
        ],
        complianceSentimen: [
          {
            label: "Review Publik",
            positif: 42,
            netral: 38,
            negatif: 18,
            none: 2
          },
          {
            label: "Feedback Stakeholder",
            positif: 38,
            netral: 42,
            negatif: 16,
            none: 4
          }
        ]
      }
    }

    // Return data based on institutionId or default to BPS
    const institutionKey = institutionId || "BPS"
    const data = dummyData[institutionKey as keyof typeof dummyData] || dummyData["BPS"]

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get compliance indicators error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST /api/compliance/indicators - Create atau update compliance indicator
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      )
    }

    const {
      institution_id,
      indicator_name,
      indicator_type,
      sangat_sesuai,
      sebagian_sesuai,
      tidak_sesuai,
      none_count
    } = await request.json()

    if (!institution_id || !indicator_name || !indicator_type) {
      return NextResponse.json(
        { error: 'Institution ID, indicator name, dan indicator type diperlukan' },
        { status: 400 }
      )
    }

    const indicator = await prisma.complianceIndicator.upsert({
      where: {
        institution_id_indicator_name: {
          institution_id: parseInt(institution_id),
          indicator_name
        }
      },
      update: {
        indicator_type,
        sangat_sesuai: sangat_sesuai || 0,
        sebagian_sesuai: sebagian_sesuai || 0,
        tidak_sesuai: tidak_sesuai || 0,
        none_count: none_count || 0,
        calculated_at: new Date()
      },
      create: {
        institution_id: parseInt(institution_id),
        indicator_name,
        indicator_type,
        sangat_sesuai: sangat_sesuai || 0,
        sebagian_sesuai: sebagian_sesuai || 0,
        tidak_sesuai: tidak_sesuai || 0,
        none_count: none_count || 0
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Compliance indicator berhasil disimpan',
      indicator
    })
  } catch (error) {
    console.error('Create/update compliance indicator error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
} 