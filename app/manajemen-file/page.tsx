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
import UploadDocumentModal from "@/components/UploadDocumentModal"
import DocumentPreview from "@/components/DocumentPreview"
import EditDocumentModal from "@/components/EditDocumentModal"
import DownloadDocument from "@/components/DownloadDocument"
import DeleteDocumentModal from "@/components/DeleteDocumentModal"

interface Document {
  id: number
  title: string
  description: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  created_at: string
  institution: {
    id: number
    name: string
  }
  uploaded_by_user: {
    id: number
    name: string
    email: string
  }
}

const INSTANSIS = ["BPS", "Kemenkeu", "Kemendagri"]

export default function ManajemenFilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [instansi, setInstansi] = useState(INSTANSIS[0])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const { user, logout, token } = useAuth()

  useEffect(() => {
    if (token) {
      fetchDocuments()
    }
  }, [token, instansi])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/documents?institutionId=${getInstitutionId(instansi)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInstitutionId = (name: string) => {
    // This should match your database institution IDs
    const institutionMap: Record<string, number> = {
      "BPS": 1,
      "Kemenkeu": 2,
      "Kemendagri": 3
    }
    return institutionMap[name] || 1
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || doc.file_type.includes(filterType)
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
                <Link href="/manajemen-pengguna">
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {!sidebarCollapsed && "Manajemen Pengguna"}
                  </Button>
                </Link>
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

          <main className="flex-1 p-6 space-y-4">
            <Card className="p-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-semibold text-xl">Daftar Dokumen</div>
                  <div className="text-sm text-muted-foreground">
                    Kelola dokumen yang telah diunggah ({filteredDocuments.length} dokumen)
                  </div>
                </div>
                <UploadDocumentModal
                  onUploadSuccess={fetchDocuments}
                  institutionId={getInstitutionId(instansi)}
                />
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
                        <th className="py-3 text-left font-semibold">Diunggah Oleh</th>
                        <th className="py-3 text-left font-semibold">Tanggal</th>
                        <th className="py-3 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b hover:bg-muted">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getFileIcon(doc.file_type)}</span>
                              <div>
                                <div className="font-medium">{doc.title}</div>
                                <div className="text-xs text-muted-foreground">{doc.filename}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="max-w-xs truncate">{doc.description}</div>
                          </td>
                          <td className="py-3">
                            <Badge variant="secondary">{formatFileSize(doc.file_size)}</Badge>
                          </td>
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{doc.uploaded_by_user.name}</div>
                              <div className="text-xs text-muted-foreground">{doc.uploaded_by_user.email}</div>
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
                              <EditDocumentModal document={doc} onEditSuccess={fetchDocuments} />
                              <DeleteDocumentModal document={doc} onDeleteSuccess={fetchDocuments} />
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