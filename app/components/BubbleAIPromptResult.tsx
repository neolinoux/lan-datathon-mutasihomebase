import RelatedDocumentsCarousel from "./RelatedDocumentsCarousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";

interface BubbleAIPromptResultProps {
  fileName: string;
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

export default function BubbleAIPromptResult({ fileName, analysisData, error }: BubbleAIPromptResultProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Sangat Sesuai': return 'bg-green-600'
      case 'Cukup': return 'bg-yellow-600'
      case 'Tidak Sesuai': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusFromEncodeClass = (encodeClass: number) => {
    switch (encodeClass) {
      case 1: return 'Sangat Sesuai'
      case 2: return 'Cukup'
      case 3: return 'Tidak Sesuai'
      default: return 'Tidak Diketahui'
    }
  }

  const getIndikatorName = (nama: string) => {
    const nameMap: { [key: string]: string } = {
      'prosedural': 'Prosedural',
      'efisiensi_anggaran': 'Efisiensi Anggaran',
      'transparansi': 'Transparansi',
      'regulasi': 'Regulasi',
      'etika_antikorupsi': 'Etika dan Antikorupsi',
      'pengelolaan_sumber_daya': 'Pengelolaan Sumber Daya',
      'evalusi_rtl': 'Evaluasi RTL'
    }
    return nameMap[nama.toLowerCase()] || nama
  }

  // Jika ada error, tampilkan pesan error
  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-red-800">AIDAN Prompt Result</h3>
        </div>
        <div className="text-red-700">
          <p className="font-medium">Gagal menganalisis dokumen:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </Card>
    )
  }

  // Jika tidak ada data analisis, tampilkan pesan
  if (!analysisData) {
    return (
      <Card className="p-6 bg-gray-50 border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-800">AIDAN Prompt Result</h3>
        </div>
        <div className="text-gray-600">
          <p>Data analisis tidak tersedia</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-semibold">AIDAN Prompt Result</h3>
      </div>
      
      <div className="space-y-4">
        {/* Indikator Kepatuhan */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-semibold mb-2 text-sm">Indikator Kepatuhan Dengan Klasifikasi</span>
          </div>
          {analysisData.indikator_compliance.map((item, i) => (
            <Card key={i} className="p-5 border-l-4 border-blue-500 bg-muted text-card-foreground flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold flex-1">
                  {getIndikatorName(item.nama)}
                </span>
                <Badge className={`${getSentimentColor(
                  getStatusFromEncodeClass(item.encode_class)
                )} text-white`}>
                  {getStatusFromEncodeClass(item.encode_class)}
                </Badge>
                <span className="ml-2 font-bold text-base">
                  {Math.round(item.score_indikator * 100)}%
                </span>
              </div>
              <Progress value={item.score_indikator * 100} className="h-2 mb-2" />
              <div className="text-sm text-muted-foreground mb-1">
                Detail: {item.detail_analisis}
              </div>
              <div className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1">
                Alasan Klasifikasi: {item.alasan_analisis}
              </div>
            </Card>
          ))}
        </div>

        {/* Dokumen Terkait */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm">Dokumen Terkait</span>
          </div>
          <RelatedDocumentsCarousel 
            list_peraturan_terkait={analysisData.list_peraturan_terkait}
            error={error}
          />
        </div>
      </div>
    </Card>
  );
} 