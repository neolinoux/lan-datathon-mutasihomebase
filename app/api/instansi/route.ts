import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching instansi data from external API...')

    const response = await fetch('https://82046b2c4328.ngrok-free.app/rekapitulasi_instansi', {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
    })

    console.log('External API Response status:', response.status)
    console.log('External API Response headers:', response.headers)

    if (!response.ok) {
      throw new Error(`External API error! status: ${response.status}`)
    }

    // Check content type
    const contentType = response.headers.get('content-type')
    console.log('External API Content-Type:', contentType)

    if (!contentType || !contentType.includes('application/json')) {
      // If not JSON, get the text content to see what we're actually getting
      const textResponse = await response.text()
      console.log('Non-JSON response from external API:', textResponse.substring(0, 500))
      throw new Error(`External API returned non-JSON response. Content-Type: ${contentType}`)
    }

    const data = await response.json()
    console.log('Successfully parsed JSON data from external API')

    // Validate data structure
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('External API returned empty or invalid data array')
    }

    // Return the data with proper headers
    return NextResponse.json(data, {
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