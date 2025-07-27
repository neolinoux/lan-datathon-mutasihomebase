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
  tingkat_risiko: number
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
    data_response: {
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
  };
  error?: string;
}

export default function BubbleAISentiment({ sentimentData, fileName, analysisData, error }: BubbleAISentimentProps) {
  const getRiskLevelColorBadge = (level: string) => {
    switch (level) {
      case 'rendah': return 'bg-green-100 text-green-800'
      case 'sedang': return 'bg-yellow-100 text-yellow-800'
      case 'tinggi': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTingkatRisikoColorBadge = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Convert API data to sentiment format if available
  const getSentimentFromAPI = () => {
    if (!analysisData || !analysisData.data_response) return null;

    const tingkat_risiko = analysisData.data_response.summary_indicator_compliance.tingkat_risiko;

    const recommendations = analysisData.data_response.rekomendasi_per_indikator.map((rec, index) => ({
      id: `rec-${rec.id_indikator}`,
      title: rec.judul_rekomendasi,
      category: rec.judul_rekomendasi.split(' ')[1] || 'Umum',
      level: rec.id_indikator <= 2 ? 'TINGGI' : rec.id_indikator <= 4 ? 'SEDANG' : 'RENDAH',
      description: rec.deskripsi_rekomendasi,
      steps: rec.langkah_rekomendasi,
      priority: rec.id_indikator,
      estimatedTime: `${rec.id_indikator}-${rec.id_indikator + 1} bulan`,
      impact: rec.id_indikator <= 2 ? 'tinggi' : rec.id_indikator <= 4 ? 'sedang' : 'rendah',
    }));

    return {
      recommendations,
      tingkat_risiko
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
            <span className="text-sm">Tingkat Risiko:</span>
            <Badge className={`${getTingkatRisikoColorBadge(finalSentimentData?.tingkat_risiko || 0)} font-bold`}>
              {finalSentimentData?.tingkat_risiko === 1 ? 'Rendah' : finalSentimentData?.tingkat_risiko === 2 ? 'Sedang' : 'Tinggi'}
            </Badge>
          </div>
          {fileName && (
            <div className="text-sm text-muted-foreground mb-2">
              Dokumen: {fileName}
            </div>
          )}
          {sortedRecommendations.map((rec) => (
            <Card key={rec.id} className="p-4 border-l-4 border-yellow-400 bg-card text-card-foreground flex flex-col gap-2 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold flex-1">{rec.title}</span>
                <Badge className={`${getRiskLevelColorBadge(rec.level.toLowerCase())} font-bold`}>
                  {rec.level}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {rec.description}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-blue-700">Langkah-langkah:</div>
                {rec.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Card>
      </div>
    </div>
  );
} 