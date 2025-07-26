import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

interface HistoryItem {
  fileName: string;
  date: string;
}

export default function SidebarAnalisisKanan({ history, onHistoryClick, selectedFile, onAnalisisBaru, sidebarOpen = true }: { history: HistoryItem[]; onHistoryClick?: (fileName: string) => void; selectedFile?: string | null; onAnalisisBaru?: () => void; sidebarOpen?: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredHistory = history.filter(h => h.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <aside className="w-full max-w-xs p-4 space-y-6 border-l bg-card text-card-foreground min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col gap-6">
        {/* Menu kembali ke dashboard */}
        <Link href="/" className="w-full cursor-pointer">
          <Button
            variant="ghost"
            className={`w-full font-semibold text-left border border-border rounded-lg mb-2 cursor-pointer ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors`}
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <Home size={22} />
                <span className="text-sm">Dashboard</span>
              </div>
            ) : (
              <Home size={22} />
            )}
          </Button>
        </Link>
        <section>
          <h2 className="font-semibold mb-2">Fitur Analisis</h2>
          <ul className="text-sm space-y-2">
            <li>
              <span className="font-medium">Pemeriksaan Kepatuhan</span><br />
              <span className="text-xs text-muted-foreground">Analisis 7 indikator utama</span>
            </li>
            <li>
              <span className="font-medium">Analisis Sentimen</span><br />
              <span className="text-xs text-muted-foreground">Evaluasi nada dokumen</span>
            </li>
            <li>
              <span className="font-medium">Rekomendasi AI</span><br />
              <span className="text-xs text-muted-foreground">Wawasan yang dapat ditindaklanjuti</span>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold mb-2">Riwayat Analisis Dokumen</h2>
          <Input
            placeholder="Cari riwayat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          {filteredHistory.length === 0 ? (
            <div className="text-sm text-muted-foreground">Tidak ada riwayat ditemukan.</div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              <ul className="divide-y divide-border">
                {filteredHistory.map((h, i) => (
                  <li
                    key={i}
                    className={`py-2 flex items-center gap-3 cursor-pointer rounded transition-colors ${selectedFile === h.fileName ? 'bg-muted font-semibold' : 'hover:bg-muted'}`}
                    onClick={() => onHistoryClick && onHistoryClick(h.fileName)}
                  >
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{h.date}</span>
                    <span className="text-sm">{h.fileName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
      {/* Menu Analisis Baru di bawah */}
      <div className="pt-4 mt-auto border-t">
        <Button variant="default" className="w-full cursor-pointer" onClick={onAnalisisBaru}>
          Analisis Baru
        </Button>
      </div>
    </aside>
  );
} 