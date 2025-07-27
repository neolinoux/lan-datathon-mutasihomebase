"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/toggle-dark-mode";
import { LogOut, FileText, Calendar, User, Search, Filter, Download, Eye, Users, Building2, ChevronRight, ChevronLeft, Home, History } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";

interface AnalysisHistoryItem {
  id: number;
  judul_kegiatan: string;
  deskripsi_kegiatan: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  institution: {
    name: string;
    full_name: string;
  };
  analysis_files: Array<{
    original_name: string;
    file_type: string;
    stored_path: string;
    file_size: number;
  }>;
  score_compliance: number;
  tingkat_risiko: number;
  include_dok_keuangan: boolean;
}

export default function RiwayatAnalisisPage() {
  const { user, logout, token } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [user, currentPage]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Role-based filtering (only for authenticated users)
      if (user) {
        if (!(user.role === 'admin' && user.institution?.id === 0)) {
          // Regular users can see all analysis for their institution
          if (user.institution?.id) params.append('institution_id', user.institution.id.toString());
        }
      }
      // Non-authenticated users can see all analysis results (no filtering)

      params.append('limit', itemsPerPage.toString());
      params.append('offset', ((currentPage - 1) * itemsPerPage).toString());

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
        setTotalPages(Math.ceil(result.pagination.total / itemsPerPage));
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

  const filteredHistory = history.filter(item => {
    const matchesSearch =
      item.judul_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi_kegiatan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" ||
      (filterStatus === "with-keuangan" && item.include_dok_keuangan) ||
      (filterStatus === "without-keuangan" && !item.include_dok_keuangan);

    return matchesSearch && matchesFilter;
  });

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
    if (tingkatRisiko <= 1) return 'bg-green-100 text-green-800';
    if (tingkatRisiko <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskLevelText = (tingkatRisiko: number) => {
    if (tingkatRisiko <= 1) return 'Rendah';
    if (tingkatRisiko <= 2) return 'Sedang';
    return 'Tinggi';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-card border-r transition-all duration-300 z-50 ${sidebarCollapsed ? 'w-18' : 'w-64'}`}>
        <div className="flex flex-col h-full">
          {/* Burger Button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-lg">PANTAS.AI</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-8 w-8 p-0"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4 flex flex-col gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
              >
                <Home className="h-4 w-4 mr-2" />
                {!sidebarCollapsed && "Dashboard"}
              </Button>
            </Link>

            <Link href="/analisis-dokumen">
              <Button
                variant="outline"
                className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
              >
                <FileText className="h-4 w-4 mr-2" />
                {!sidebarCollapsed && "Analisis Dokumen"}
              </Button>
            </Link>

            <Link href="/riwayat-analisis">
              <Button
                variant="default"
                className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
              >
                <History className="h-4 w-4 mr-2" />
                {!sidebarCollapsed && "Riwayat Analisis"}
              </Button>
            </Link>

            {/* Admin-only menu items */}
            {user?.role === 'admin' && (
              <>
                <Link href="/manajemen-instansi">
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    {!sidebarCollapsed && "Manajemen Instansi"}
                  </Button>
                </Link>

                <Link href="/manajemen-pengguna">
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {!sidebarCollapsed && "Manajemen Pengguna"}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Navbar */}
        <div className="bg-card border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Riwayat Analisis Dokumen</h1>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {user.name} ({user.role})
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
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
          </div>
        </div>

        {/* Main Content */}
        <main className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Riwayat Analisis Dokumen</h1>
            <p className="text-muted-foreground">
              Lihat dan kelola semua hasil analisis dokumen yang telah dilakukan
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan judul, deskripsi, atau nama user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  Semua Analisis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("with-keuangan")}>
                  Dengan Dokumen Keuangan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("without-keuangan")}>
                  Tanpa Dokumen Keuangan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-800 font-medium">Error:</div>
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-lg font-semibold mb-2">Memuat riwayat analisis...</div>
              <div className="text-sm text-muted-foreground">Mohon tunggu sebentar</div>
            </div>
          )}

          {/* Results */}
          {!isLoading && filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-semibold mb-2">Tidak ada riwayat analisis</div>
              <div className="text-sm text-muted-foreground mb-4">
                {searchQuery || filterStatus !== "all"
                  ? "Tidak ada hasil yang sesuai dengan filter yang dipilih"
                  : "Belum ada analisis dokumen yang dilakukan"
                }
              </div>
              <Link href="/analisis-dokumen">
                <Button>Mulai Analisis Pertama</Button>
              </Link>
            </div>
          )}

          {/* Analysis History List */}
          {!isLoading && filteredHistory.length > 0 && (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{item.judul_kegiatan}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.deskripsi_kegiatan}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{item.user.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(item.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{item.analysis_files.length} file</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.include_dok_keuangan ? "default" : "secondary"}>
                          {item.include_dok_keuangan ? "Dengan Keuangan" : "Tanpa Keuangan"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link href={`/analisis-dokumen?id=${item.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat Detail
                          </Button>
                        </Link>
                        {/* <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button> */}
                      </div>
                    </div>

                    {/* File List */}
                    {item.analysis_files.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">File yang Dianalisis:</h4>
                        <div className="space-y-2">
                          {item.analysis_files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{file.original_name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {file.file_type}
                                </Badge>
                              </div>
                              <span className="text-muted-foreground">
                                {formatFileSize(file.file_size)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 