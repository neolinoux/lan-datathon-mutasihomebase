"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { LogOut, FileText, Download, Trash2, Edit, Search, Filter, Plus, Menu, User, Home, Building2, ChevronRight, ChevronLeft, Users, History } from "lucide-react"
import { ModeToggle } from "@/components/toggle-dark-mode"
import Link from "next/link"
import DocumentPreview from "@/components/DocumentPreview"
import DownloadDocument from "@/components/DownloadDocument"

// Interface untuk data instansi dari database
interface InstansiData {
  id: number;
  name: string;
  category: string;
}

// Interface untuk dokumen dari hasil analisis
interface AnalysisDocument {
  id: number;
  analysis_id: string;
  judul_kegiatan: string;
  deskripsi_kegiatan: string;
  include_dok_keuangan: boolean;
  path_dok_kegiatan: string;
  path_dok_keuangan: string | null;
  created_at: string;
  institution: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  analysis_files: Array<{
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
  }>;
}

export default function ManajemenFilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [instansi, setInstansi] = useState<string>("")
  const [instansiList, setInstansiList] = useState<InstansiData[]>([])
  const [documents, setDocuments] = useState<AnalysisDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const { user, logout, token } = useAuth()

  // Fetch instansi data from database
  useEffect(() => {
    const fetchInstansi = async () => {
      try {
        const response = await fetch('/api/institutions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setInstansiList(data);

          // Set instansi based on user role
          if (user?.role === 'admin' && user?.institution?.id === 0) {
            const firstRegularInst = data.find((inst: { id: number }) => inst.id !== 0);
            setInstansi(firstRegularInst?.name || "");
          } else {
            // User sees only their institution
            setInstansi(user?.institution?.name || "");
          }
        }
      } catch (error) {
        console.error('Error fetching instansi:', error);
      }
    };

    if (user) {
      fetchInstansi();
    }
  }, [user]);

  useEffect(() => {
    if (token && (user?.role === 'admin' && user?.institution?.id === 0 || instansi)) {
      fetchDocuments()
    }
  }, [token, instansi, user?.role, user?.institution?.id])

  const fetchDocuments = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      // Role-based filtering
      if (!(user?.role === 'admin' && user?.institution?.id === 0)) {
        // Regular users can only see their own institution's documents
        const selectedInstitution = instansiList.find(inst => inst.name === instansi);
        const institutionId = selectedInstitution?.id || user?.institution?.id;

        if (!institutionId) {
          console.error('No institution ID found');
          setDocuments([]);
          return;
        }

        params.append('institution_id', institutionId.toString())
      }

      const response = await fetch(`/api/analysis/history?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Ensure data is always an array
        setDocuments(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch documents:', response.statusText)
        setDocuments([])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel')) return '📊'
    return '📄'
  }

  const filteredDocuments = (documents || []).filter(doc => {
    const matchesSearch = doc.judul_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.deskripsi_kegiatan.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || doc.analysis_files[0]?.file_type.includes(filterType)
    return matchesSearch && matchesFilter
  })

  const handleLogout = () => {
    logout()
  }



  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar kiri collapsable */}
        <aside className={`transition-all duration-200 border-r bg-card flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-64'} h-screen min-h-screen p-0`}>
          <div className="flex flex-col h-full justify-between">
            {/* Burger button di kanan atas sidebar */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Dashboard</span>
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
            <div className="border-b border-border w-full" />
            {/* Menu utama */}
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
                  variant="outline"
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                >
                  <History className="h-4 w-4 mr-2" />
                  {!sidebarCollapsed && "Riwayat Analisis"}
                </Button>
              </Link>

              <Link href="/manajemen-file">
                <Button
                  variant="default"
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {!sidebarCollapsed && "Manajemen File"}
                </Button>
              </Link>

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
            <div />
          </div>
        </aside>

        {/* Konten utama */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar atas */}
          <nav className="w-full bg-card border-b px-8 py-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Manajemen File</div>
            <div className="flex items-center gap-2">
              {user?.role === 'admin' && user?.institution?.id === 0 ? (
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
                  {user?.institution?.name || "Instansi tidak ditemukan"}
                </span>
              )}
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

          <main className="flex-1 p-6 space-y-4">
            <Card className="p-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-semibold text-xl">Daftar Dokumen</div>
                  <div className="text-sm text-muted-foreground">
                    Kelola dokumen yang telah diunggah ({filteredDocuments.length} dokumen)
                  </div>
                </div>
                {/* UploadDocumentModal removed as per new_code */}
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Cari dokumen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter: {filterType === "all" ? "Semua" : filterType}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterType("all")}>
                      Semua File
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("pdf")}>
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("word")}>
                      Word
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("excel")}>
                      Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Documents Table */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Loading...</div>
                    <div className="text-sm text-muted-foreground">Memuat daftar dokumen</div>
                  </div>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Tidak ada dokumen</div>
                    <div className="text-sm text-muted-foreground">
                      {searchQuery || filterType !== "all"
                        ? "Coba ubah filter atau kata kunci pencarian"
                        : "Belum ada dokumen yang diunggah untuk instansi ini"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-semibold">Dokumen</th>
                        <th className="py-3 text-left font-semibold">Deskripsi</th>
                        <th className="py-3 text-left font-semibold">Ukuran</th>
                        <th className="py-3 text-left font-semibold">Dianalisis Oleh</th>
                        <th className="py-3 text-left font-semibold">Tanggal</th>
                        <th className="py-3 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b hover:bg-muted">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getFileIcon(doc.analysis_files?.[0]?.file_type || "📄")}</span>
                              <div>
                                <div className="font-medium">{doc.judul_kegiatan}</div>
                                <div className="text-xs text-muted-foreground">ID: {doc.analysis_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="max-w-xs truncate">{doc.deskripsi_kegiatan}</div>
                          </td>
                          <td className="py-3">
                            <div className="flex flex-col gap-1">
                              {doc.analysis_files?.map((file, index) => (
                                <Badge key={file.id} variant="secondary">
                                  {index === 0 ? 'Dok. Kegiatan' : 'Dok. Keuangan'}: {formatFileSize(file.file_size)}
                                </Badge>
                              )) || <Badge variant="secondary">No files</Badge>}
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{doc.user.name}</div>
                              <div className="text-xs text-muted-foreground">{doc.user.email}</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">
                              {new Date(doc.created_at).toLocaleDateString('id-ID')}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <DocumentPreview document={doc} />
                              <DownloadDocument document={doc} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 