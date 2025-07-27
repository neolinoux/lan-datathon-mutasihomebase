import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication (optional for public access)
    const currentUser = getCurrentUser(request)

    // For dashboard data, use external API
    const response = await fetch('https://baec13f3a9c5.ngrok-free.app/rekapitulasi_instansi', {
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
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('External API returned empty or invalid data array')
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