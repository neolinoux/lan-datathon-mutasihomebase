import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, FileText, Calendar, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AnalysisHistoryItem {
  id: number;
  judul_kegiatan: string;
  created_at: string;
  user: {
    name: string;
  };
  institution: {
    name: string;
  };
  analysis_files: Array<{
    original_name: string;
    file_type: string;
  }>;
  score_compliance: number;
  tingkat_risiko: number;
}

interface SidebarAnalisisKananProps {
  userId?: number;
  institutionId?: number;
  userRole?: string; // Add user role prop
  onHistoryClick?: (analysisId: number) => void;
  selectedAnalysisId?: number | null;
  onAnalisisBaru?: () => void;
  sidebarOpen?: boolean;
}

export default function SidebarAnalisisKanan({
  userId,
  institutionId,
  userRole,
  onHistoryClick,
  selectedAnalysisId,
  onAnalisisBaru,
  sidebarOpen = true
}: SidebarAnalisisKananProps) {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // Role-based filtering (only for authenticated users)
        if (userRole && institutionId) {
          if (!(userRole === 'admin' && institutionId === 0)) {
            // Regular users can see all analysis for their institution
            params.append('institution_id', institutionId.toString());
          }
        }
        // Non-authenticated users can see all analysis results (no filtering)

        params.append('limit', '20');

        const headers: Record<string, string> = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`/api/analysis/history?${params}`, {
          headers
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analysis history');
        }

        const result = await response.json();

        if (result.success) {
          setHistory(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch history');
        }
      } catch (err) {
        console.error('Error fetching analysis history:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat riwayat');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId, institutionId, userRole, token]);

  const filteredHistory = history.filter(h =>
    h.judul_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskLevelColor = (tingkatRisiko: number) => {
    if (tingkatRisiko <= 1) return 'text-green-600';
    if (tingkatRisiko <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevelText = (tingkatRisiko: number) => {
    if (tingkatRisiko <= 1) return 'Rendah';
    if (tingkatRisiko <= 2) return 'Sedang';
    return 'Tinggi';
  };

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

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Memuat riwayat...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-sm text-muted-foreground">Tidak ada riwayat ditemukan.</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <ul className="divide-y divide-border">
                {filteredHistory.map((item) => (
                  <li
                    key={item.id}
                    className={`py-3 flex flex-col gap-2 cursor-pointer rounded transition-colors ${selectedAnalysisId === item.id ? 'bg-muted font-semibold' : 'hover:bg-muted'}`}
                    onClick={() => onHistoryClick && onHistoryClick(item.id)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium truncate">{item.judul_kegiatan}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User size={12} />
                      <span>{item.user.name}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {item.analysis_files.length} file
                    </div>
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