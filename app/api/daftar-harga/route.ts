import { NextRequest, NextResponse } from 'next/server'

interface PriceItem {
  "Barang/Jasa": string
  "Satuan": string
  "Harga": number
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://baec13f3a9c5.ngrok-free.app/daftar_harga', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: PriceItem[] = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching price list:', error)
    return NextResponse.json(
      { error: 'Gagal memuat data daftar harga' },
      { status: 500 }
    )
  }
} 