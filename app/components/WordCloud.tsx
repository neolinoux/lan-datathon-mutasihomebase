"use client"

import { useRef, useEffect } from 'react'

interface WordCloudProps {
  words: Array<{ text: string; value: number }>
  width?: number
  height?: number
}

export default function WordCloud({ words, width = 400, height = 300 }: WordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Sort words by value (largest first)
    const sortedWords = [...words].sort((a, b) => b.value - a.value)

    // Draw words
    sortedWords.forEach((word, index) => {
      const fontSize = Math.max(12, Math.min(60, 12 + (word.value * 4)))
      ctx.font = `bold ${fontSize}px Arial, sans-serif`

      // Create gradient color based on value
      const hue = (index * 137.5) % 360 // Golden angle for better color distribution
      const saturation = 70 + (word.value * 2)
      const lightness = 50 + (word.value * 2)
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`

      // Calculate position (simple grid layout)
      const cols = Math.ceil(Math.sqrt(sortedWords.length))
      const col = index % cols
      const row = Math.floor(index / cols)

      const x = 20 + (col * (width / cols))
      const y = 30 + (row * (height / Math.ceil(sortedWords.length / cols)))

      // Add some randomness to position
      const randomX = x + (Math.random() - 0.5) * 40
      const randomY = y + (Math.random() - 0.5) * 20

      ctx.fillText(word.text, randomX, randomY)
    })
  }, [words, width, height])

  return (
    <div className="w-full bg-card rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">Analisis Kata Kunci</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border rounded bg-background"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Visualisasi kata kunci berdasarkan frekuensi analisis dokumen</p>
      </div>
    </div>
  )
} 