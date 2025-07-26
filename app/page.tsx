"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Building2, Users, FileText, Sun, Moon, Home, Shield, TrendingUp, History, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import ProtectedRoute from '@/components/protected-route'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ModeToggle } from '@/components/toggle-dark-mode'

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
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data instansi dari API lokal (yang akan mengambil dari external API)
    const fetchInstansiData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/instansi')

        console.log('Local API Response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data: InstansiData[] = await response.json()
        console.log('Parsed JSON data from local API:', data)

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('API returned empty or invalid data array')
        }

        setInstansiList(data)
        if (user?.role === 'admin') {
          setSelectedInstansi(data[0])
        } else {
          const userInstansi = data.find(inst => inst.id_instansi === user?.institution?.id)
          setSelectedInstansi(userInstansi || data[0])
        }
      } catch (err) {
        console.error('Error fetching instansi data:', err)
        setError(err instanceof Error ? err.message : 'Gagal memuat data instansi')
        setInstansiList([])
        setSelectedInstansi(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInstansiData()
  }, [user])


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-t-2 border-b-2 border-primary rounded-full"></div>
        <div className="text-2xl font-bold">Loading...</div>
        <div className="text-sm text-muted-foreground">Please wait while we load the data</div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-600 mb-2">Gagal memuat data instansi</div>
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    )
  }
  if (!selectedInstansi) {
    return null;
  }

  return (
    <ProtectedRoute>
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

              <Link href="/manajemen-file">
                <Button
                  variant="outline"
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
          </div>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Navbar */}
          <div className="bg-card border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Dashboard Admin - Monitoring Kepatuhan AI</h1>
              </div>

              <div className="flex items-center space-x-4">
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 px-2 py-1 rounded">
                    Error: {error}
                  </div>
                )}
                {/* Instansi Filter */}
                {user?.role === 'admin' ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Instansi:</span>
                    <select
                      value={selectedInstansi.id_instansi}
                      onChange={(e) => {
                        const selected = instansiList.find(inst => inst.id_instansi === parseInt(e.target.value))
                        setSelectedInstansi(selected || instansiList[0])
                      }}
                      className="px-3 py-1 border rounded-md text-sm bg-background"
                      disabled={isLoading}
                    >
                      {isLoading && <option>Loading...</option>}
                      {instansiList.map((instansi) => (
                        <option key={instansi.id_instansi} value={instansi.id_instansi}>
                          {instansi.nama_instansi}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Instansi:</span>
                    <span className="text-sm text-muted-foreground">
                      {user?.institution?.name || 'N/A'}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {user?.name} ({user?.role})
                  </span>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-t-2 border-b-2 border-primary rounded-full mr-3"></div>
                <span>Memuat data dashboard...</span>
              </div>
            )}
            {!isLoading && (
              <>
                {/* Top Row - Information and Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Informasi Instansi */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span>Informasi Instansi</span>
                        </div>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Detail lengkap instansi yang sedang dimonitor</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="font-semibold">{selectedInstansi.nama_instansi}</div>
                      <div className="text-sm text-muted-foreground">
                        <div>Status: {selectedInstansi.status_lembaga}</div>
                        <div>Alamat: {selectedInstansi.alamat}</div>
                        <div>Telepon: {selectedInstansi.no_telp}</div>
                        <div>Email: {selectedInstansi.email}</div>
                        <div>Website: {selectedInstansi.website}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statistik */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Statistik</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Didirikan:</span>
                        <span className="text-sm font-medium">{selectedInstansi.tahun_berdiri}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Pegawai:</span>
                        <span className="text-sm font-medium">{selectedInstansi.total_pegawai.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Peraturan:</span>
                        <span className="text-sm font-medium">{selectedInstansi.total_peraturan.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Update Terakhir:</span>
                        <span className="text-sm font-medium">{selectedInstansi.update_terakhir}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Middle Row - Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total Analisis Dokumen */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Analisis Dokumen</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedInstansi.dm_total_dokumen.toLocaleString()}</div>
                    </CardContent>
                  </Card>

                  {/* Rata-rata Skor Kepatuhan */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Rata-rata Skor Kepatuhan</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedInstansi.dm_mean_skor_kepatuhan}%</div>
                    </CardContent>
                  </Card>

                  {/* Sentimen Positif */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sentimen Positif</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedInstansi.dm_mean_sentiment_positive}%</div>
                    </CardContent>
                  </Card>

                  {/* Pengguna Aktif */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedInstansi.dm_total_user.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Row - Compliance Indicators */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Indikator Compliance Berbasis Dokumen */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Indikator Compliance Berbasis Dokumen</CardTitle>
                      <p className="text-sm text-muted-foreground">Analisis kepatuhan berdasarkan dokumen yang diunggah</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Prosedural */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Prosedural</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sangat Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_class1}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sesuaikan Sebagian</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_class2}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Tidak Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_class3}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_none}</div>
                          </div>
                        </div>
                      </div>

                      {/* Efisiensi Anggaran */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Efisiensi Anggaran</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sangat Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_class1}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sesuaikan Sebagian</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_class2}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Tidak Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_class3}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_none}</div>
                          </div>
                        </div>
                      </div>

                      {/* Transparansi */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Transparansi</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sangat Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_class1}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sesuaikan Sebagian</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_class2}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Tidak Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_class3}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_none}</div>
                          </div>
                        </div>
                      </div>

                      {/* Regulasi */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Regulasi</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sangat Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_class1}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Sesuaikan Sebagian</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_class2}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Tidak Sesuai</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_class3}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_none}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Indikator Compliance Berbasis Sentimen Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Indikator Compliance Berbasis Sentimen Review</CardTitle>
                      <p className="text-sm text-muted-foreground">Analisis kepatuhan berdasarkan sentimen dari review dan feedback</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Prosedural */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Prosedural</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Positif</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_sentiment_positive}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Netral</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_sentiment_neutral}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Negatif</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_sentiment_negative}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.prosedural_sentiment_none}</div>
                          </div>
                        </div>
                      </div>

                      {/* Efisiensi Anggaran */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Efisiensi Anggaran</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Positif</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_sentiment_positive}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Netral</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_sentiment_neutral}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Negatif</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_sentiment_negative}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.efisiensi_anggaran_sentiment_none}</div>
                          </div>
                        </div>
                      </div>

                      {/* Transparansi */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Transparansi</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Positif</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_sentiment_positive}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Netral</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_sentiment_neutral}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Negatif</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_sentiment_negative}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.transparansi_sentiment_none}</div>
                          </div>
                        </div>
                      </div>

                      {/* Regulasi */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Regulasi</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Positif</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_sentiment_positive}</div>
                          </div>
                          <div className="bg-yellow-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Netral</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_sentiment_neutral}</div>
                          </div>
                          <div className="bg-red-500 text-white text-center p-2 rounded">
                            <div className="text-xs">Negatif</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_sentiment_negative}</div>
                          </div>
                          <div className="bg-gray-500 text-white text-center p-2 rounded">
                            <div className="text-xs">None</div>
                            <div className="text-lg font-bold">{selectedInstansi.regulasi_sentiment_none}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
