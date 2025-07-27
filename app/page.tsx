"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Building2, Users, FileText, Home, Shield, TrendingUp, History, LogOut, Cloud, DollarSign, LogIn, RefreshCw } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ModeToggle } from '@/components/toggle-dark-mode'

// Sample data for WordCloud
const sampleWords = [
  { text: 'Kepatuhan', value: 85 },
  { text: 'Regulasi', value: 72 },
  { text: 'Transparansi', value: 68 },
  { text: 'Prosedur', value: 65 },
  { text: 'Anggaran', value: 58 },
  { text: 'Dokumen', value: 55 },
  { text: 'Evaluasi', value: 48 },
  { text: 'Monitoring', value: 45 },
  { text: 'Audit', value: 42 },
  { text: 'Pelaporan', value: 38 },
  { text: 'Standar', value: 35 },
  { text: 'Kontrol', value: 32 },
  { text: 'Risiko', value: 28 },
  { text: 'Kebijakan', value: 25 },
  { text: 'SOP', value: 22 }
]

// Interface untuk struktur data instansi
interface InstansiData {
  id_instansi: number
  nama_instansi: string
  singkatan_instansi: string
  status_lembaga: string
  alamat: string
  no_telp: string
  email: string
  website: string
  tahun_berdiri: string
  total_pegawai: number
  total_peraturan: number
  update_terakhir: string
  total_dokumen: number
  dm_total_dokumen: number
  mean_skor_kepatuhan: number
  dm_mean_skor_kepatuhan: number
  mean_sentiment_positive: number
  dm_mean_sentiment_positive: number
  total_user: number
  dm_total_user: number
  prosedural_class1: number
  prosedural_class2: number
  prosedural_class3: number
  prosedural_none: number
  prosedural_sentiment_positive: number
  prosedural_sentiment_negative: number
  prosedural_sentiment_neutral: number
  prosedural_sentiment_none: number
  efisiensi_anggaran_class1: number
  efisiensi_anggaran_class2: number
  efisiensi_anggaran_class3: number
  efisiensi_anggaran_none: number
  efisiensi_anggaran_sentiment_positive: number
  efisiensi_anggaran_sentiment_negative: number
  efisiensi_anggaran_sentiment_neutral: number
  efisiensi_anggaran_sentiment_none: number
  transparansi_class1: number
  transparansi_class2: number
  transparansi_class3: number
  transparansi_none: number
  transparansi_sentiment_positive: number
  transparansi_sentiment_negative: number
  transparansi_sentiment_neutral: number
  transparansi_sentiment_none: number
  regulasi_class1: number
  regulasi_class2: number
  regulasi_class3: number
  regulasi_none: number
  regulasi_sentiment_positive: number
  regulasi_sentiment_negative: number
  regulasi_sentiment_neutral: number
  regulasi_sentiment_none: number
  etika_antikorupsi_class1: number
  etika_antikorupsi_class2: number
  etika_antikorupsi_class3: number
  etika_antikorupsi_none: number
  etika_antikorupsi_sentiment_positive: number
  etika_antikorupsi_sentiment_negative: number
  etika_antikorupsi_sentiment_neutral: number
  etika_antikorupsi_sentiment_none: number
  pengelolaan_sumber_daya_class1: number
  pengelolaan_sumber_daya_class2: number
  pengelolaan_sumber_daya_class3: number
  pengelolaan_sumber_daya_none: number
  pengelolaan_sumber_daya_sentiment_positive: number
  pengelolaan_sumber_daya_sentiment_negative: number
  pengelolaan_sumber_daya_sentiment_neutral: number
  pengelolaan_sumber_daya_sentiment_none: number
  evalusi_rtl_class1: number
  evalusi_rtl_class2: number
  evalusi_rtl_class3: number
  evalusi_rtl_none: number
  evalusi_rtl_sentiment_positive: number
  evalusi_rtl_sentiment_negative: number
  evalusi_rtl_sentiment_neutral: number
  evalusi_rtl_sentiment_none: number
}

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedInstansi, setSelectedInstansi] = useState<InstansiData | null>(null)
  const [instansiList, setInstansiList] = useState<InstansiData[]>([])
  const { user, logout, token } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchInstansiData = async () => {
      console.log('Fetching instansi data...', { user: user?.email, role: user?.role })
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/instansi')
        console.log('API response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data: InstansiData[] = await response.json()
        console.log('API response data length:', data.length)

        if (!Array.isArray(data)) {
          throw new Error('API returned non-array data')
        }

        if (data.length === 0) {
          console.warn('API returned empty array')
          setInstansiList([])
          setSelectedInstansi(null)
          return
        }

        setInstansiList(data)
        console.log('Instansi list set, length:', data.length)

        // Set selected instansi with better fallback logic
        if (user?.role === 'admin') {
          // Admin can see all instansi, default to first one
          setSelectedInstansi(data[0])
        } else if (user) {
          // Regular user - find their institution or default to first
          const userInstansi = data.find(inst => inst.id_instansi === user?.institution?.id)
          setSelectedInstansi(userInstansi || data[0])
        } else {
          // Non-authenticated user - show first instansi
          setSelectedInstansi(data[0])
        }
        console.log('Selected instansi set:', data[0]?.nama_instansi)
      } catch (err) {
        console.error('Error fetching instansi data:', err)
        setError(err instanceof Error ? err.message : 'Gagal memuat data instansi')
        setInstansiList([])
        setSelectedInstansi(null)
      } finally {
        setIsLoading(false)
        console.log('Loading finished')
      }
    }

    fetchInstansiData()
  }, [user]) // Fetch on mount and when user changes

  // Use first instansi as fallback if selectedInstansi is null
  const currentInstansi = selectedInstansi || instansiList[0]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full bg-card border-r z-50 ${sidebarCollapsed ? 'w-18' : 'w-64'}`}>
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
                  variant="default"
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

              <Link href="/daftar-harga">
                <Button
                  variant="outline"
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {!sidebarCollapsed && "Daftar Harga"}
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

                  <Link href="/manajemen-user">
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {!sidebarCollapsed && "Manajemen User"}
                    </Button>
                  </Link>
                </>
              )}

              {/* User Profile Section */}
              <div className="mt-auto pt-4 border-t">
                {user ? (
                  <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2'}`}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => logout()}
                      className={`${sidebarCollapsed ? 'px-2' : 'px-2'}`}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
                      <LogIn className="h-4 w-4 mr-2" />
                      {!sidebarCollapsed && "Login"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

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
        {/* Main Content with Loading */}
        <div className={`${sidebarCollapsed ? 'ml-18' : 'ml-64'} p-8`}>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="animate-spin w-10 h-10 border-t-2 border-b-2 border-primary rounded-full mb-4"></div>
            <div className="text-2xl font-bold mb-2">Loading Dashboard...</div>
            <div className="text-sm text-muted-foreground">Please wait while we load the data</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-600 mb-2">Gagal memuat data instansi</div>
        <div className="text-sm text-muted-foreground mb-4">{error}</div>
        <div className="text-xs text-muted-foreground">
          Coba refresh halaman atau hubungi administrator jika masalah berlanjut.
        </div>
      </div>
    )
  }

  // Handle case when no instansi data is available
  if (instansiList.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full bg-card border-r z-50 ${sidebarCollapsed ? 'w-18' : 'w-64'}`}>
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
                  variant="default"
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

              <Link href="/daftar-harga">
                <Button
                  variant="outline"
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {!sidebarCollapsed && "Daftar Harga"}
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

                  <Link href="/manajemen-user">
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {!sidebarCollapsed && "Manajemen User"}
                    </Button>
                  </Link>
                </>
              )}

              {/* User Profile Section */}
              <div className="mt-auto pt-4 border-t">
                {user ? (
                  <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2'}`}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => logout()}
                      className={`${sidebarCollapsed ? 'px-2' : 'px-2'}`}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
                      <LogIn className="h-4 w-4 mr-2" />
                      {!sidebarCollapsed && "Login"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${sidebarCollapsed ? 'ml-18' : 'ml-64'} p-8`}>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h1 className="text-2xl font-bold mb-2">Data Instansi Tidak Tersedia</h1>
              <p className="text-muted-foreground mb-4">
                Saat ini tidak ada data instansi yang dapat ditampilkan.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Halaman
                </Button>
                <Link href="/analisis-dokumen">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Analisis Dokumen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-card border-r z-50 ${sidebarCollapsed ? 'w-18' : 'w-64'}`}>
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
                variant="default"
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

            <Link href="/daftar-harga">
              <Button
                variant="outline"
                className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {!sidebarCollapsed && "Daftar Harga"}
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

                <Link href="/manajemen-user">
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {!sidebarCollapsed && "Manajemen User"}
                  </Button>
                </Link>
              </>
            )}

            {/* User Profile Section */}
            <div className="mt-auto pt-4 border-t">
              {user ? (
                <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2'}`}>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logout()}
                    className={`${sidebarCollapsed ? 'px-2' : 'px-2'}`}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
                    <LogIn className="h-4 w-4 mr-2" />
                    {!sidebarCollapsed && "Login"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Instansi:</span>
                  <select
                    value={currentInstansi?.id_instansi || ''} // Use optional chaining
                    onChange={(e) => {
                      const selected = instansiList.find(inst => inst.id_instansi === parseInt(e.target.value))
                      setSelectedInstansi(selected || null)
                    }}
                    className="border rounded px-3 py-1 text-sm bg-muted"
                  >
                    {instansiList.map((instansi) => (
                      <option key={instansi.id_instansi} value={instansi.id_instansi}>
                        {instansi.nama_instansi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='px-8 py-8'>
          {/* Instansi Info Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informasi Instansi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-semibold">{currentInstansi?.nama_instansi || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">
                  <div>Status: {currentInstansi?.status_lembaga || 'N/A'}</div>
                  <div>Alamat: {currentInstansi?.alamat || 'N/A'}</div>
                  <div>Telepon: {currentInstansi?.no_telp || 'N/A'}</div>
                  <div>Email: {currentInstansi?.email || 'N/A'}</div>
                  <div>Website: {currentInstansi?.website || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Instansi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Didirikan:</span>
                  <span className="text-sm font-medium">{currentInstansi?.tahun_berdiri || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Pegawai:</span>
                  <span className="text-sm font-medium">{(currentInstansi?.total_pegawai || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Peraturan:</span>
                  <span className="text-sm font-medium">{currentInstansi?.total_peraturan || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Update Terakhir:</span>
                  <span className="text-sm font-medium">{currentInstansi?.update_terakhir || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentInstansi?.total_dokumen || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skor Kepatuhan</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentInstansi?.mean_skor_kepatuhan || 0}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sentiment Positif</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentInstansi?.mean_sentiment_positive || 0}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total User</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentInstansi?.total_user || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Analisis Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sangat Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_class1 || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sesuaikan Sebagian</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_class2 || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Tidak Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_class3 || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efisiensi Anggaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sangat Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_class1 || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sesuaikan Sebagian</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_class2 || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Tidak Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_class3 || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transparansi & Regulasi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Transparansi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sangat Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_class1 || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sesuaikan Sebagian</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_class2 || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Tidak Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_class3 || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sangat Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_class1 || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Sesuaikan Sebagian</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_class2 || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Tidak Sesuai</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_class3 || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis - Prosedural</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Positif</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_sentiment_positive || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Netral</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_sentiment_neutral || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Negatif</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_sentiment_negative || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.prosedural_sentiment_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis - Efisiensi Anggaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Positif</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_sentiment_positive || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Netral</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_sentiment_neutral || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Negatif</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_sentiment_negative || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.efisiensi_anggaran_sentiment_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Sentiment Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis - Transparansi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Positif</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_sentiment_positive || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Netral</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_sentiment_neutral || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Negatif</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_sentiment_negative || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.transparansi_sentiment_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis - Regulasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-green-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Positif</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_sentiment_positive || 0}</div>
                  </div>
                  <div className="bg-yellow-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Netral</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_sentiment_neutral || 0}</div>
                  </div>
                  <div className="bg-red-500 text-white text-center p-2 rounded">
                    <div className="text-xs">Negatif</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_sentiment_negative || 0}</div>
                  </div>
                  <div className="bg-gray-500 text-white text-center p-2 rounded">
                    <div className="text-xs">None</div>
                    <div className="text-lg font-bold">{currentInstansi?.regulasi_sentiment_none || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
