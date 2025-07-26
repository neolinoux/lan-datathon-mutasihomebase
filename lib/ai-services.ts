import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface DocumentAnalysisResult {
  compliance: {
    indicators: Array<{
      name: string
      score: number
      status: 'sangat_sesuai' | 'sebagian_sesuai' | 'tidak_sesuai' | 'none'
      details: string
    }>
    overallScore: number
  }
  sentiment: {
    overall: 'positif' | 'netral' | 'negatif'
    score: number
    details: string
  }
  recommendations: Array<{
    category: string
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  relatedDocuments: Array<{
    title: string
    relevance: number
    url?: string
  }>
}

export async function analyzeDocument(
  content: string,
  title: string,
  description: string
): Promise<DocumentAnalysisResult> {
  try {
    const prompt = `
    Analisis dokumen berikut untuk kepatuhan pemerintah:
    
    Judul: ${title}
    Deskripsi: ${description}
    Konten: ${content}
    
    Berikan analisis dalam format JSON dengan struktur:
    {
      "compliance": {
        "indicators": [
          {
            "name": "Nama Indikator",
            "score": 0-100,
            "status": "sangat_sesuai|sebagian_sesuai|tidak_sesuai|none",
            "details": "Penjelasan detail"
          }
        ],
        "overallScore": 0-100
      },
      "sentiment": {
        "overall": "positif|netral|negatif",
        "score": 0-100,
        "details": "Analisis sentimen"
      },
      "recommendations": [
        {
          "category": "Kategori",
          "title": "Judul Rekomendasi",
          "description": "Deskripsi rekomendasi",
          "priority": "high|medium|low"
        }
      ],
      "relatedDocuments": [
        {
          "title": "Judul Dokumen Terkait",
          "relevance": 0-100
        }
      ]
    }
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Anda adalah AI assistant untuk analisis kepatuhan dokumen pemerintah. Berikan analisis yang akurat dan terstruktur."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from AI')
    }

    return JSON.parse(result) as DocumentAnalysisResult
  } catch (error) {
    console.error('AI Analysis Error:', error)
    throw new Error('Failed to analyze document')
  }
}

export async function generateVideoLearning(
  analysisResult: DocumentAnalysisResult
): Promise<{
  title: string
  description: string
  videoUrl?: string
  duration: number
}> {
  try {
    const prompt = `
    Berdasarkan hasil analisis kepatuhan, buat video pembelajaran dengan format:
    
    {
      "title": "Judul Video Pembelajaran",
      "description": "Deskripsi video",
      "duration": 300,
      "topics": [
        "Topik 1: Penjelasan indikator kepatuhan",
        "Topik 2: Cara implementasi rekomendasi",
        "Topik 3: Best practices"
      ]
    }
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Anda adalah AI assistant untuk membuat konten video pembelajaran tentang kepatuhan pemerintah."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from AI')
    }

    const videoData = JSON.parse(result)
    return {
      title: videoData.title,
      description: videoData.description,
      duration: videoData.duration,
    }
  } catch (error) {
    console.error('Video Generation Error:', error)
    throw new Error('Failed to generate video learning')
  }
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positif' | 'netral' | 'negatif'
  score: number
  confidence: number
  keywords: string[]
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analisis sentimen teks dan berikan hasil dalam format JSON."
        },
        {
          role: "user",
          content: `Analisis sentimen teks berikut: "${text}"`
        }
      ],
      temperature: 0.3,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from AI')
    }

    return JSON.parse(result)
  } catch (error) {
    console.error('Sentiment Analysis Error:', error)
    throw new Error('Failed to analyze sentiment')
  }
} 