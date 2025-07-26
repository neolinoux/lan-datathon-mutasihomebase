"use client"

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import SidebarAnalisisKanan from "../components/SidebarAnalisisKanan";
import BubbleAIPromptResult from "../components/BubbleAIPromptResult";
import BubbleAISentiment from "../components/BubbleAISentiment";
import FileDropzone from "../components/FileDropzone";
import { ModeToggle } from "@/components/toggle-dark-mode";
import BubbleAIVideoPembelajaran from "../components/BubbleAIVideoPembelajaran";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import { LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { FileText, Users } from "lucide-react";

const INSTANSIS = [
  "Badan Pusat Statistik",
  "Kementerian Keuangan",
  "Kementerian Dalam Negeri",
  "Kementerian PAN-RB",
  "Kementerian Perhubungan",
];

// Dummy data analisis & riwayat per instansi
interface InstansiAnalysis {
  lastAnalysis: { fileName: string } | null;
  history: { fileName: string; date: string }[];
}
const DUMMY_ANALYSIS: Record<string, InstansiAnalysis> = {
  "Badan Pusat Statistik": {
    lastAnalysis: {
      fileName: "BPS_Laporan_2024.pdf",
    },
    history: [
      { fileName: "BPS_Laporan_2024.pdf", date: "2024-07-25 10:00" },
      { fileName: "BPS_Anggaran_2023.pdf", date: "2024-06-10 14:30" },
      { fileName: "BPS_Review_2022.pdf", date: "2024-05-01 09:00" },
      { fileName: "BPS_Audit_2021.pdf", date: "2024-04-15 13:20" },
      { fileName: "BPS_Transparansi_2020.pdf", date: "2024-03-10 11:45" },
      { fileName: "BPS_Kepatuhan_2019.pdf", date: "2024-02-28 08:10" },
      { fileName: "BPS_Evaluasi_2018.pdf", date: "2024-01-20 15:30" },
      { fileName: "BPS_Opini_2017.pdf", date: "2023-12-05 17:00" },
      { fileName: "BPS_Keuangan_2016.pdf", date: "2023-11-11 10:10" },
      { fileName: "BPS_Arsip_2015.pdf", date: "2023-10-01 14:50" },
    ],
  },
  "Kementerian Keuangan": {
    lastAnalysis: {
      fileName: "KKU_Transparansi_2024.pdf",
    },
    history: [
      { fileName: "KKU_Transparansi_2024.pdf", date: "2024-07-24 09:00" },
      { fileName: "KKU_Audit_2023.pdf", date: "2024-05-18 16:20" },
    ],
  },
  "Kementerian Dalam Negeri": {
    lastAnalysis: {
      fileName: "Kemendagri_Review_2024.pdf",
    },
    history: [
      { fileName: "Kemendagri_Review_2024.pdf", date: "2024-07-20 11:15" },
    ],
  },
  "Kementerian PAN-RB": {
    lastAnalysis: null,
    history: [],
  },
  "Kementerian Perhubungan": {
    lastAnalysis: null,
    history: [],
  },
};

// Interface untuk response API
interface ComplianceAnalysisResponse {
  status: string;
  message: string;
  timestamp: string;
  data: {
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
}

export default function AnalisisDokumenPage() {
  const [instansi, setInstansi] = useState(INSTANSIS[0]);
  const currentInstansiData = DUMMY_ANALYSIS[instansi];
  const [fileLaporan, setFileLaporan] = useState<File | null>(null);
  const [fileAnggaran, setFileAnggaran] = useState<File | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedHistoryFile, setSelectedHistoryFile] = useState<string | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const { user, logout, token } = useAuth();
  const [enableAnggaran, setEnableAnggaran] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ComplianceAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileLaporanChange = (file: File | null) => {
    setFileLaporan(file);
  };
  const handleFileAnggaranChange = (file: File | null) => {
    setFileAnggaran(file);
  };

  const handleAnalisisBaru = () => {
    setShowResult(false);
    setSelectedHistoryFile(null);
    setSelectedAnalysisId(null);
    setAnalysisResult(null);
    setError(null);
    setDocTitle("");
    setDocDesc("");
    setFileLaporan(null);
    setFileAnggaran(null);
    setEnableAnggaran(false);
  };

  const loadAnalysisFromHistory = async (analysisId: number) => {
    try {
      setIsLoadingHistory(true);
      setError(null);

      const response = await fetch(`/api/analysis/${analysisId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setAnalysisResult(result.data);
        setShowResult(true);
        setSelectedAnalysisId(analysisId);
        setSelectedHistoryFile(null);
      } else {
        throw new Error(result.error || 'Gagal memuat analisis');
      }
    } catch (err) {
      console.error('Error loading analysis from history:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat analisis dari riwayat');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleAnalisis = async () => {
    if (!fileLaporan || !docTitle.trim() || !docDesc.trim() || (enableAnggaran && !fileAnggaran)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('id_instansi', user?.institution?.id?.toString() || '1');
      formData.append('judul_dok_kegiatan', docTitle.trim());
      formData.append('deskripsi_dok_kegiatan', docDesc.trim());
      formData.append('include_dok_keuangan', enableAnggaran.toString());
      formData.append('dok_kegiatan', fileLaporan);

      if (enableAnggaran && fileAnggaran) {
        formData.append('dok_keuangan', fileAnggaran);
      }

      const response = await fetch('/api/analyse-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: ComplianceAnalysisResponse = await response.json();

      if (result.status === 'success') {
        setAnalysisResult(result);
        setShowResult(true);
        setSelectedHistoryFile(null);

        // Save analysis result to database
        try {
          const saveFormData = new FormData();
          saveFormData.append('analysis_result', JSON.stringify(result));
          saveFormData.append('user_id', user?.id?.toString() || '1');
          saveFormData.append('institution_id', user?.institution?.id?.toString() || '1');

          // Add files to save
          saveFormData.append('files', fileLaporan);
          if (enableAnggaran && fileAnggaran) {
            saveFormData.append('files', fileAnggaran);
          }

          const saveResponse = await fetch('/api/analysis/save', {
            method: 'POST',
            body: saveFormData,
          });

          if (saveResponse.ok) {
            const saveResult = await saveResponse.json();
            console.log('Analysis result saved:', saveResult);
          } else {
            console.error('Failed to save analysis result');
          }
        } catch (saveError) {
          console.error('Error saving analysis result:', saveError);
          // Don't throw error here, just log it
        }
      } else {
        throw new Error(result.message || 'Analisis gagal');
      }
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat analisis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Konten utama kiri */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar filter instansi */}
          <nav className="w-full bg-card border-b px-8 py-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Asisten AI Kepatuhan</div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[220px] justify-between">
                    {instansi}
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {INSTANSIS.map((item) => (
                    <DropdownMenuItem key={item} onClick={() => setInstansi(item)}>
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.name} ({user?.role})
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <ModeToggle />
            </div>
          </nav>
          {/* Konten analisis */}
          <main className="flex-1 px-8 py-8 flex flex-col items-center justify-center min-h-[80vh]">
            {error && (
              <div className="w-full max-w-2xl mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="text-red-800 font-medium">Error:</div>
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}
            {!(showResult || selectedHistoryFile || selectedAnalysisId || isLoadingHistory) && (
              <>
                <div className="text-center text-lg font-semibold">Hai saya AIDAN siap membantu anda melakukan analisis dokumen</div>
                <div className="text-center text-sm text-muted-foreground mb-4">Silahkan masukkan judul dan deskripsi dokumen yang ingin anda analisis</div>
                <div className="w-full max-w-2xl flex flex-col gap-4 mb-8 items-center">
                  <Input
                    placeholder="Judul Dokumen"
                    value={docTitle}
                    onChange={e => setDocTitle(e.target.value)}
                    className="bg-card text-card-foreground"
                  />
                  <Textarea
                    placeholder="Deskripsi Dokumen"
                    value={docDesc}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDocDesc(e.target.value)}
                    className="bg-card text-card-foreground min-h-[60px]"
                  />
                  <div className="w-full max-w-md mx-auto flex flex-col gap-4">
                    <div>
                      <div className="mb-1 font-medium">Dokumen Laporan Kegiatan</div>
                      <FileDropzone file={fileLaporan} onFileChange={handleFileLaporanChange} disabled={showResult} />
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Switch id="toggle-anggaran" checked={enableAnggaran} onCheckedChange={setEnableAnggaran} />
                      <label htmlFor="toggle-anggaran" className="text-sm select-none cursor-pointer">Aktifkan Upload Dokumen Keuangan</label>
                    </div>
                    {enableAnggaran && (
                      <div>
                        <div className="mb-1 font-medium">Dokumen Keuangan (Wajib)</div>
                        <FileDropzone file={fileAnggaran} onFileChange={handleFileAnggaranChange} disabled={showResult} />
                      </div>
                    )}
                  </div>
                  <Button
                    className="mt-2 cursor-pointer"
                    onClick={handleAnalisis}
                    disabled={
                      !fileLaporan ||
                      !docTitle.trim() ||
                      !docDesc.trim() ||
                      (enableAnggaran && !fileAnggaran) ||
                      isLoading
                    }
                  >
                    {isLoading ? 'Menganalisis...' : 'Analisis'}
                  </Button>
                </div>
              </>
            )}
            {/* Bubble analisis AI muncul setelah analisis */}
            {(showResult || selectedHistoryFile || selectedAnalysisId) && currentInstansiData.lastAnalysis && (
              <div className="w-full flex flex-col items-center gap-6">
                {isLoadingHistory ? (
                  <div className="w-full max-w-2xl p-8 text-center">
                    <div className="text-lg font-semibold mb-2">Memuat hasil analisis...</div>
                    <div className="text-sm text-muted-foreground">Mohon tunggu sebentar</div>
                  </div>
                ) : (
                  <>
                    <BubbleAIPromptResult
                      fileName={selectedHistoryFile || fileLaporan?.name || fileAnggaran?.name || currentInstansiData.lastAnalysis.fileName}
                      analysisData={analysisResult?.data}
                      error={error || undefined}
                    />
                    <BubbleAISentiment
                      analysisData={analysisResult?.data}
                      error={error || undefined}
                    />
                  </>
                )}
              </div>
            )}
          </main>
          {/* Footer kosong, tidak ada FileDropzone sticky bawah */}
          <footer className="w-full px-8 py-6 bg-card border-t flex justify-center sticky bottom-0 z-20"></footer>
        </div>
        {/* Sidebar kanan */}
        <div className="hidden lg:block w-[320px] border-l bg-card sticky top-0 h-screen overflow-y-auto">
          <SidebarAnalisisKanan
            userId={user?.id}
            institutionId={user?.institution?.id}
            onHistoryClick={loadAnalysisFromHistory}
            selectedAnalysisId={selectedAnalysisId}
            onAnalisisBaru={handleAnalisisBaru}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
} 