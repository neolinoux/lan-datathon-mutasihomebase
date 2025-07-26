import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// Interface untuk struktur data sentiment
interface SentimentData {
  sentiment: 'positif' | 'negatif' | 'netral'
  confidence: number
  riskLevel: 'rendah' | 'sedang' | 'tinggi'
  recommendations: Recommendation[]
}

interface Recommendation {
  id: string
  title: string
  category: string
  level: 'RENDAH' | 'SEDANG' | 'TINGGI'
  description: string
  steps: string[]
  priority: number
  estimatedTime: string
  impact: 'rendah' | 'sedang' | 'tinggi'
}

interface BubbleAISentimentProps {
  sentimentData?: SentimentData
  fileName?: string
  analysisData?: {
    id_dokumen: string;
    id_instansi: string;
    judul_kegiatan: string;
    deskripsi_kegiatan: string;
    include_dok_keuangan: boolean;
    path_dok_kegiatan: string;
    path_dok_keuangan: string;
    list_peraturan_terkait: Array<{
      judul_peraturan: string;
      instansi: string;
      tingkat_kepatuhan: number;
      url_pera: string;
    }>;
    indikator_compliance: Array<{
      id_indikator: number;
      nama: string;
      encode_class: number;
      detail_analisis: string;
      alasan_analisis: string;
      score_indikator: number;
    }>;
    summary_indicator_compliance: {
      tingkat_risiko: number;
      score_compliance: number;
    };
    rekomendasi_per_indikator: Array<{
      id_indikator: number;
      judul_rekomendasi: string;
      deskripsi_rekomendasi: string;
      langkah_rekomendasi: string[];
    }>;
  };
  error?: string;
}

export default function BubbleAISentiment({ sentimentData, fileName, analysisData, error }: BubbleAISentimentProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'rendah': return 'text-green-600'
      case 'sedang': return 'text-yellow-600'
      case 'tinggi': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positif': return 'text-green-600'
      case 'negatif': return 'text-red-600'
      case 'netral': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskLevelColorBadge = (level: string) => {
    switch (level) {
      case 'rendah': return 'bg-green-100 text-green-800'
      case 'sedang': return 'bg-yellow-100 text-yellow-800'
      case 'tinggi': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'rendah': return 'text-green-600'
      case 'sedang': return 'text-yellow-600'
      case 'tinggi': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Convert API data to sentiment format if available
  const getSentimentFromAPI = () => {
    if (!analysisData) return null;

    const score = analysisData.summary_indicator_compliance.score_compliance;
    let sentiment: 'positif' | 'negatif' | 'netral';
    let riskLevel: 'rendah' | 'sedang' | 'tinggi';

    if (score >= 0.7) {
      sentiment = 'positif';
      riskLevel = 'rendah';
    } else if (score >= 0.4) {
      sentiment = 'netral';
      riskLevel = 'sedang';
    } else {
      sentiment = 'negatif';
      riskLevel = 'tinggi';
    }

    const recommendations = analysisData.rekomendasi_per_indikator.map((rec, index) => ({
      id: `rec-${rec.id_indikator}`,
      title: rec.judul_rekomendasi,
      category: rec.judul_rekomendasi.split(' ')[1] || 'Umum',
      level: rec.id_indikator <= 2 ? 'TINGGI' : rec.id_indikator <= 4 ? 'SEDANG' : 'RENDAH',
      description: rec.deskripsi_rekomendasi,
      steps: rec.langkah_rekomendasi,
      priority: rec.id_indikator,
      estimatedTime: `${rec.id_indikator}-${rec.id_indikator + 1} bulan`,
      impact: rec.id_indikator <= 2 ? 'tinggi' : rec.id_indikator <= 4 ? 'sedang' : 'rendah'
    }));

    return {
      sentiment,
      confidence: Math.round(score * 100),
      riskLevel,
      recommendations
    };
  };

  const finalSentimentData = analysisData ? getSentimentFromAPI() : sentimentData;
  const sortedRecommendations = finalSentimentData?.recommendations.sort((a, b) => a.priority - b.priority) || [];

  // Jika ada error, tampilkan pesan error
  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-red-800">AIDAN Sentiment Analysis</h3>
        </div>
        <div className="text-red-700">
          <p className="font-medium">Gagal menganalisis sentimen:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </Card>
    )
  }

  // Jika tidak ada data sentiment, tampilkan pesan
  if (!finalSentimentData) {
    return (
      <Card className="p-6 bg-gray-50 border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-800">AIDAN Sentiment Analysis</h3>
        </div>
        <div className="text-gray-600">
          <p>Data sentimen tidak tersedia</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-6 w-full max-w-xl">
        <Card className="p-5 border-l-4 border-yellow-400 bg-muted text-card-foreground flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base flex-1">Analisis Sentimen</span>
            <Badge className={`${getSentimentColor(finalSentimentData.sentiment)} text-white`}>
              {finalSentimentData.sentiment.charAt(0).toUpperCase() + finalSentimentData.sentiment.slice(1)}
            </Badge>
            <span className="text-xs text-muted-foreground">Kepercayaan: {finalSentimentData.confidence}%</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">Tingkat Risiko:</span>
            <Badge className={`${getRiskLevelColorBadge(finalSentimentData.riskLevel)} text-white`}>
              {finalSentimentData.riskLevel.charAt(0).toUpperCase() + finalSentimentData.riskLevel.slice(1)}
            </Badge>
          </div>
          {fileName && (
            <div className="text-sm text-muted-foreground mb-2">
              Dokumen: {fileName}
            </div>
          )}
          <div className="font-semibold mb-2 text-sm">Rekomendasi Perbaikan ({sortedRecommendations.length})</div>
          {sortedRecommendations.map((rec) => (
            <Card key={rec.id} className="p-4 border-l-4 border-yellow-400 bg-card text-card-foreground flex flex-col gap-2 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold flex-1">{rec.title}</span>
                <Badge variant="outline" className="mr-1">{rec.category}</Badge>
                <Badge className="bg-yellow-500 text-white">{rec.level}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{rec.description}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                <span>Prioritas: {rec.priority}</span>
                <span>Estimasi: {rec.estimatedTime}</span>
                <span className={`font-medium ${getImpactColor(rec.impact)}`}>
                  Dampak: {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 font-medium mb-1">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  Langkah-langkah Implementasi:
                </div>
                <ol className="list-decimal ml-6 space-y-1 text-sm">
                  {rec.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Lihat Detail</Button>
                <Button size="sm">Mulai Implementasi</Button>
              </div>
            </Card>
          ))}
        </Card>
      </div>
    </div>
  );
} 