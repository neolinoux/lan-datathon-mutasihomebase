"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import SidebarAnalisisKanan from "../components/SidebarAnalisisKanan";
import BubbleAIPromptResult from "../components/BubbleAIPromptResult";
import BubbleAISentiment from "../components/BubbleAISentiment";
import FileDropzone from "../components/FileDropzone";
import { ModeToggle } from "@/components/toggle-dark-mode";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { Loader2, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { FileText, Users, DollarSign } from "lucide-react";
import { Building2, ChevronLeft, ChevronRight, Home, History } from "lucide-react";

// Interface untuk data instansi dari database
interface InstansiData {
  id: number;
  name: string;
  category: string;
}

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
}

export default function AnalisisDokumenPage() {
  const [instansi, setInstansi] = useState<string>("");
  const [instansiList, setInstansiList] = useState<InstansiData[]>([]);
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch instansi data from database
  useEffect(() => {
    const fetchInstansi = async () => {
      try {
        const headers: Record<string, string> = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch('/api/institutions', {
          headers
        });
        if (response.ok) {
          const data = await response.json();
          setInstansiList(data);
          if (data.length > 0) {
            const firstRegularInst = data.find((inst: { id: number }) => inst.id !== 0);
            setInstansi(firstRegularInst ? firstRegularInst.name : data[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching instansi:', error);
      }
    };
    fetchInstansi();
  }, [token]);

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
      setSelectedAnalysisId(analysisId);
      setShowResult(false);
      setSelectedHistoryFile(null);

      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/analysis/${analysisId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to load analysis from history');
      }

      const result = await response.json();

      if (result.status === 'success') {
        setAnalysisResult(result);
        setShowResult(true);
      } else {
        throw new Error(result.error || 'Failed to load analysis');
      }
    } catch (err) {
      console.error('Error loading analysis from history:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat analisis dari riwayat');
      setSelectedAnalysisId(null);
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
      // Get institution ID based on selected instansi
      let institutionId = user?.institution?.id;
      if (user?.role === 'admin' && user?.institution?.id === 0) {
        // Admin can select different institutions
        const selectedInstitution = instansiList.find(inst => inst.name === instansi);
        institutionId = selectedInstitution?.id || 1; // Default to first institution if not found
      }

      const formData = new FormData();
      formData.append('id_instansi', institutionId?.toString() || '1');
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
          // Get institution ID for saving based on selected instansi
          let saveInstitutionId = user?.institution?.id;
          if (user?.role === 'admin' && user?.institution?.id === 0) {
            // Admin saves with the selected institution
            const selectedInstitution = instansiList.find(inst => inst.name === instansi);
            saveInstitutionId = selectedInstitution?.id || 1;
          }

          const saveFormData = new FormData();
          saveFormData.append('analysis_result', JSON.stringify(result));
          saveFormData.append('user_id', user?.id?.toString() || '1');
          saveFormData.append('institution_id', saveInstitutionId?.toString() || '1');

          // Files are already uploaded to Vercel Blob in analyse-document endpoint
          // No need to send files again to save endpoint

          // Actually call the save API
          const saveResponse = await fetch('/api/analysis/save', {
            method: 'POST',
            body: saveFormData,
          });

          if (!saveResponse.ok) {
            const saveErrorData = await saveResponse.json();
            console.error('Error saving to database:', saveErrorData);
          } else {
            const saveResult = await saveResponse.json();
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
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex min-h-screen bg-background w-full">

        {/* Konten utama */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar filter instansi */}
          <nav className="w-full bg-card border-b px-8 py-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Asisten AI Kepatuhan</div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {user.role === 'admin' && user.institution?.id === 0 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="min-w-[220px] justify-between">
                          {instansi}
                          <span className="ml-2">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {instansiList.filter((item) => item.id !== 0).map((item) => (
                          <DropdownMenuItem key={item.id} onClick={() => setInstansi(item.name)}>
                            {item.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-sm text-muted-foreground px-3 py-2 bg-muted rounded-md">
                      {user.institution?.name || "Instansi tidak ditemukan"}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <Link href="/riwayat-analisis">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Riwayat
                      </Button>
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {user.name} ({user.role})
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                /* Show login button for non-authenticated users */
                <Link href="/login">
                  <Button variant="default" size="sm">
                    Login
                  </Button>
                </Link>
              )}
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

            {/* Show analysis form only for authenticated users */}
            {user && !(showResult || selectedHistoryFile || selectedAnalysisId || isLoadingHistory) && (
              <>
                <div className="text-center text-lg font-semibold">Hai saya PANTAS.AI siap membantu anda melakukan analisis dokumen</div>
                <div className="text-center text-sm text-muted-foreground mb-4">Silahkan masukkan judul dan deskripsi dokumen yang ingin anda analisis</div>

                {/* Dropdown Instansi untuk Admin */}
                {user.role === 'admin' && user.institution?.id === 0 && (
                  <div className="w-full max-w-2xl mb-4">
                    <div className="mb-2 font-medium text-left">Pilih Instansi untuk Analisis:</div>
                    <select
                      value={instansi}
                      onChange={(e) => setInstansi(e.target.value)}
                      className="w-full p-2 border border-input bg-background text-foreground rounded-md"
                    >
                      {instansiList.filter((item) => item.id !== 0).map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
                    {isLoading ?
                      <div>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      </div>
                      : 'Analisis'}
                  </Button>
                </div>
              </>
            )}

            {/* Show message for non-authenticated users */}
            {!user && !(showResult || selectedHistoryFile || selectedAnalysisId || isLoadingHistory) && (
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Selamat Datang di PANTAS.AI</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Anda dapat melihat riwayat analisis dokumen dari semua instansi di sidebar sebelah kanan.
                  <br />
                  Untuk melakukan analisis dokumen baru, silakan login terlebih dahulu.
                </div>
              </div>
            )}
            {/* Bubble analisis AI muncul setelah analisis */}
            {(showResult || selectedHistoryFile || selectedAnalysisId) && analysisResult && (
              <div className="w-full flex flex-col items-center gap-6">
                {isLoadingHistory ? (
                  <div className="w-full max-w-2xl p-8 text-center">
                    <div className="text-lg font-semibold mb-2">Memuat hasil analisis...</div>
                    <div className="text-sm text-muted-foreground">Mohon tunggu sebentar</div>
                  </div>
                ) : (
                  <>
                    <BubbleAIPromptResult
                      fileName={analysisResult?.data?.judul_kegiatan || "Dokumen Analisis"}
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
            userRole={user?.role}
            onHistoryClick={loadAnalysisFromHistory}
            selectedAnalysisId={selectedAnalysisId}
            onAnalisisBaru={handleAnalisisBaru}
          />
        </div>
      </div>
    </div>
  );
} 