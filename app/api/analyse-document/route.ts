import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Analyzing document via external API...')

    // Handle FormData instead of JSON for file uploads
    const formData = await request.formData()
    console.log('FormData received:', formData)

    // Create new FormData with correct data types for external API
    const correctedFormData = new FormData()

    // Log all FormData entries to see what we're sending
    console.log('=== Original FormData Contents ===')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`)
        correctedFormData.append(key, value)
      } else {
        console.log(`${key}: ${value} (type: ${typeof value})`)

        // Convert data types to match external API expectations
        if (key === 'id_instansi') {
          correctedFormData.append(key, String(value))
        } else if (key === 'include_dok_keuangan') {
          // Send as string that represents boolean for external API
          correctedFormData.append(key, value === 'true' ? 'true' : 'false')
        } else {
          correctedFormData.append(key, String(value))
        }
      }
    }
    console.log('=== End Original FormData Contents ===')

    // Only include dok_keuangan if include_dok_keuangan is true AND file exists
    const includeDokKeuangan = formData.get('include_dok_keuangan')
    const dokKeuanganFile = formData.get('dok_keuangan')

    if (includeDokKeuangan === 'true' && dokKeuanganFile instanceof File) {
      console.log('Including dok_keuangan file as required by API')
      correctedFormData.append('dok_keuangan', dokKeuanganFile)
    } else if (includeDokKeuangan === 'true' && !dokKeuanganFile) {
      console.log('include_dok_keuangan is true but no dok_keuangan file provided - this will cause API error')
    } else if (includeDokKeuangan === 'false') {
      console.log('include_dok_keuangan is false - dok_keuangan field not included')
    }

    // Log corrected FormData
    console.log('=== Corrected FormData Contents ===')
    for (const [key, value] of correctedFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`)
      } else {
        console.log(`${key}: ${value} (type: ${typeof value})`)
      }
    }
    console.log('=== End Corrected FormData Contents ===')

    // Forward the corrected FormData to external API
    const response = await fetch('https://82046b2c4328.ngrok-free.app/analyse_compliance_doc', {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      body: correctedFormData // Send corrected FormData
    })

    console.log('External API Response status:', response.status)
    console.log('External API Response headers:', response.headers)

    if (!response.ok) {
      // Get the error response body for more details
      const errorText = await response.text()
      console.log('External API Error Response:', errorText)
      throw new Error(`External API error! status: ${response.status}, response: ${errorText}`)
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

    // Return the data with proper headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error in /api/analyse-document:', error)

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