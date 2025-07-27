"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Building2, Users, FileText, Home, History, LogOut, Search, Package, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ModeToggle } from '@/components/toggle-dark-mode'

interface PriceItem {
  "Barang/Jasa": string
  "Satuan": string
  "Harga": number
}

export default function DaftarHargaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceList, setPriceList] = useState<PriceItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'unit'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/daftar-harga')

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data: PriceItem[] = await response.json()
        setPriceList(data)
      } catch (err) {
        console.error('Error fetching price list:', err)
        setError(err instanceof Error ? err.message : 'Gagal memuat data daftar harga')
        setPriceList([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceList()
  }, [])

  // Filter and sort data
  const filteredAndSortedData = priceList
    .filter(item =>
      item["Barang/Jasa"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item["Satuan"].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a["Barang/Jasa"].localeCompare(b["Barang/Jasa"])
          break
        case 'price':
          comparison = a["Harga"] - b["Harga"]
          break
        case 'unit':
          comparison = a["Satuan"].localeCompare(b["Satuan"])
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-t-2 border-b-2 border-primary rounded-full"></div>
        <div className="text-2xl font-bold">Loading...</div>
        <div className="text-sm text-muted-foreground">Please wait while we load the price list</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-600 mb-2">Gagal memuat data daftar harga</div>
        <div className="text-sm text-muted-foreground">{error}</div>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Coba Lagi
        </Button>
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


            <Link href="/daftar-harga">
              <Button
                variant="default"
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
              <h1 className="text-2xl font-bold">Daftar Harga Barang & Jasa</h1>
            </div>

            <div className="flex items-center space-x-4">
              {error && (
                <div className="text-red-600 text-sm bg-red-50 px-2 py-1 rounded">
                  Error: {error}
                </div>
              )}

              {/* Show user info and logout for authenticated users */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {user.name} ({user.role})
                  </span>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
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

        {/* Content */}
        <div className="p-6">
          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari barang/jasa atau satuan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'unit')}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="name">Urutkan: Nama</option>
                  <option value="price">Urutkan: Harga</option>
                  <option value="unit">Urutkan: Satuan</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Menampilkan {filteredAndSortedData.length} dari {priceList.length} item
            </div>
          </div>

          {/* Price List Table */}
          <div className="border rounded-lg overflow-hidden w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Nama Barang/Jasa</TableHead>
                  <TableHead className="w-[20%]">Satuan</TableHead>
                  <TableHead className="w-[20%] text-right">Harga</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="truncate" title={item["Barang/Jasa"]}>
                        {item["Barang/Jasa"]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        {item["Satuan"]}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatPrice(item["Harga"])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedData.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada item ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 