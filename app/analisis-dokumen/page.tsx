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

export default function AnalisisDokumenPage() {
  const [instansi, setInstansi] = useState(INSTANSIS[0]);
  const currentInstansiData = DUMMY_ANALYSIS[instansi];
  const [file, setFile] = useState<File | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedHistoryFile, setSelectedHistoryFile] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const { user, logout, token } = useAuth();

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const handleAnalisisBaru = () => {
    setShowResult(false);
    setSelectedHistoryFile(null);
    setFile(null);
    setDocTitle("");
    setDocDesc("");
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
            <div className="text-center text-lg font-semibold">Hai saya AI XXX siap membantu anda melakukan analisis dokumen</div>
            <div className="text-center text-sm text-muted-foreground mb-4">Silahkan masukkan judul dan deskripsi dokumen yang ingin anda analisis</div>
            {/* buat jarak 10px */}
            <div className="h-10"></div>
            {!(showResult || selectedHistoryFile) && (
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
                <div className="w-full max-w-md mx-auto">
                  <FileDropzone file={file} onFileChange={handleFileChange} disabled={showResult} />
                </div>
                <Button
                  className="mt-2 cursor-pointer"
                  onClick={() => { setShowResult(true); setSelectedHistoryFile(null); }}
                  disabled={!file || !docTitle.trim() || !docDesc.trim()}
                >
                  Analisis
                </Button>
              </div>
            )}
            {/* Bubble analisis AI muncul setelah analisis */}
            {(showResult || selectedHistoryFile) && currentInstansiData.lastAnalysis && (
              <div className="w-full flex flex-col items-center gap-6">
                <BubbleAIPromptResult fileName={selectedHistoryFile || file?.name || currentInstansiData.lastAnalysis.fileName} />
                <BubbleAISentiment />
                <BubbleAIVideoPembelajaran />
              </div>
            )}
          </main>
          {/* Footer kosong, tidak ada FileDropzone sticky bawah */}
          <footer className="w-full px-8 py-6 bg-card border-t flex justify-center sticky bottom-0 z-20"></footer>
        </div>
        {/* Sidebar kanan */}
        <div className="hidden lg:block w-[320px] border-l bg-card sticky top-0 h-screen overflow-y-auto">
          <SidebarAnalisisKanan
            history={currentInstansiData.history}
            onHistoryClick={setSelectedHistoryFile}
            selectedFile={selectedHistoryFile}
            onAnalisisBaru={handleAnalisisBaru}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
} 