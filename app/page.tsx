"use client"

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, MapPin, Phone, Mail, Globe, FileText, User, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/toggle-dark-mode";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";

const INSTANSIS = [
  "BPS",
  "Kemenkeu",
  "Kemendagri"
];

const INSTANSI_DATA = {
  "BPS": {
    nama: "Badan Pusat Statistik",
    kategori: "Lembaga Pemerintah Non Kementerian",
    alamat: "Jl. Dr. Sutomo No. 6-8, Jakarta Pusat",
    telp: "(021) 3841195",
    email: "bps@bps.go.id",
    web: "www.bps.go.id",
    didirikan: "1960",
    pegawai: "12,450",
    totalDokumen: "1,234",
    update: "2024-01-15",
    stats: [
      { label: "Total Dokumen", value: "1,234", change: "+12% dari bulan lalu" },
      { label: "Kepatuhan", value: "87%", change: "+5% dari bulan lalu" },
      { label: "Analisis Selesai", value: "892", change: "+23% dari bulan lalu" },
      { label: "Rekomendasi", value: "156", change: "+8% dari bulan lalu" }
    ],
    complianceDokumen: [
      {
        label: "Transparansi Keuangan",
        sangat: 45,
        sebagian: 23,
        tidak: 12,
        none: 20
      },
      {
        label: "Akuntabilitas Publik",
        sangat: 38,
        sebagian: 31,
        tidak: 15,
        none: 16
      }
    ],
    complianceSentimen: [
      {
        label: "Review Publik",
        positif: 52,
        netral: 28,
        negatif: 15,
        none: 5
      },
      {
        label: "Feedback Stakeholder",
        positif: 48,
        netral: 35,
        negatif: 12,
        none: 5
      }
    ]
  },
  "Kemenkeu": {
    nama: "Kementerian Keuangan",
    kategori: "Kementerian",
    alamat: "Jl. Lapangan Banteng Timur No. 2-4, Jakarta Pusat",
    telp: "(021) 3449230",
    email: "humas@kemenkeu.go.id",
    web: "www.kemenkeu.go.id",
    didirikan: "1945",
    pegawai: "8,920",
    totalDokumen: "2,156",
    update: "2024-01-20",
    stats: [
      { label: "Total Dokumen", value: "2,156", change: "+18% dari bulan lalu" },
      { label: "Kepatuhan", value: "92%", change: "+3% dari bulan lalu" },
      { label: "Analisis Selesai", value: "1,234", change: "+15% dari bulan lalu" },
      { label: "Rekomendasi", value: "89", change: "+12% dari bulan lalu" }
    ],
    complianceDokumen: [
      {
        label: "Transparansi Keuangan",
        sangat: 58,
        sebagian: 25,
        tidak: 8,
        none: 9
      },
      {
        label: "Akuntabilitas Publik",
        sangat: 52,
        sebagian: 28,
        tidak: 12,
        none: 8
      }
    ],
    complianceSentimen: [
      {
        label: "Review Publik",
        positif: 65,
        netral: 22,
        negatif: 10,
        none: 3
      },
      {
        label: "Feedback Stakeholder",
        positif: 61,
        netral: 28,
        negatif: 8,
        none: 3
      }
    ]
  },
  "Kemendagri": {
    nama: "Kementerian Dalam Negeri",
    kategori: "Kementerian",
    alamat: "Jl. Medan Merdeka Utara No. 7, Jakarta Pusat",
    telp: "(021) 34832556",
    email: "humas@kemendagri.go.id",
    web: "www.kemendagri.go.id",
    didirikan: "1945",
    pegawai: "6,780",
    totalDokumen: "987",
    update: "2024-01-18",
    stats: [
      { label: "Total Dokumen", value: "987", change: "+8% dari bulan lalu" },
      { label: "Kepatuhan", value: "78%", change: "+7% dari bulan lalu" },
      { label: "Analisis Selesai", value: "654", change: "+19% dari bulan lalu" },
      { label: "Rekomendasi", value: "123", change: "+6% dari bulan lalu" }
    ],
    complianceDokumen: [
      {
        label: "Transparansi Keuangan",
        sangat: 32,
        sebagian: 35,
        tidak: 18,
        none: 15
      },
      {
        label: "Akuntabilitas Publik",
        sangat: 28,
        sebagian: 38,
        tidak: 22,
        none: 12
      }
    ],
    complianceSentimen: [
      {
        label: "Review Publik",
        positif: 42,
        netral: 38,
        negatif: 18,
        none: 2
      },
      {
        label: "Feedback Stakeholder",
        positif: 38,
        netral: 42,
        negatif: 16,
        none: 4
      }
    ]
  }
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [instansi, setInstansi] = useState(INSTANSIS[0]);
  const [data, setData] = useState<any>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchInstitutions();
      fetchInstitutionData();
    } else {
      // Fallback ke dummy data jika tidak ada token
      setData(INSTANSI_DATA[instansi as keyof typeof INSTANSI_DATA]);
    }
  }, [token, instansi]);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/institutions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data);
      }
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const fetchInstitutionData = async () => {
    try {
      const response = await fetch(`/api/compliance/indicators?institutionId=${instansi}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        // Fallback ke dummy data jika API gagal
        setData(INSTANSI_DATA[instansi as keyof typeof INSTANSI_DATA]);
      }
    } catch (error) {
      console.error('Error fetching institution data:', error);
      // Fallback ke dummy data jika error
      setData(INSTANSI_DATA[instansi as keyof typeof INSTANSI_DATA]);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar kiri collapsable */}
        <aside className={`transition-all duration-200 border-r bg-card flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} h-screen min-h-screen p-0`}>
          <div className="flex flex-col h-full justify-between">
            {/* Burger button di kanan atas sidebar */}
            <div className="flex justify-end p-2">
              <button
                className="p-2 rounded hover:bg-muted transition-colors flex items-center justify-center w-10 h-10"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle Sidebar"
              >
                <Menu size={24} />
              </button>
            </div>
            <div className="border-b border-border w-full" />
            {/* Menu utama */}
            <nav className="flex flex-col gap-2 items-center flex-1 mt-4">
              {/* Dashboard */}
              <Link href="/" className="w-11/12 cursor-pointer">
                <Button
                  variant="ghost"
                  className={`w-full font-semibold text-left border border-border rounded-lg cursor-pointer ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors`}
                >
                  {sidebarOpen ? (
                    <div className="flex items-center gap-2">
                      <Home size={22} />
                      <span>Dashboard</span>
                    </div>
                  ) : (
                    <Home size={22} />
                  )}
                </Button>
              </Link>
              <Link href="/analisis-dokumen" className="w-11/12 cursor-pointer">
                <Button
                  variant="ghost"
                  className={`w-full font-semibold text-left border border-border rounded-lg cursor-pointer ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors`}
                >
                  {sidebarOpen ? (
                    <div className="flex items-center gap-2">
                      <FileText size={22} />
                      <span>Analisis Dokumen</span>
                    </div>
                  ) : (
                    <FileText size={22} />
                  )}
                </Button>
              </Link>
              {/* New Link for Manajemen Pengguna */}
              <Link href="/manajemen-pengguna" className="w-11/12 cursor-pointer">
                <Button
                  variant="ghost"
                  className={`w-full font-semibold text-left border border-border rounded-lg cursor-pointer mt-2 ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors`}
                >
                  {sidebarOpen ? (
                    <div className="flex items-center gap-2">
                      <User size={22} />
                      <span>Manajemen Pengguna</span>
                    </div>
                  ) : (
                    <User size={22} />
                  )}
                </Button>
              </Link>
            </nav>
            <div />
          </div>
        </aside>
        {/* Konten utama */}
        <div className="flex-1 flex flex-col">
          {/* Navbar atas */}
          <nav className="w-full bg-card border-b px-8 py-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Dashboard Monitoring Kepatuhan AI</div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[220px] justify-between">
                    {instansi}
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {institutions.length > 0 ? (
                    institutions.map((institution) => (
                      <DropdownMenuItem key={institution.id} onClick={() => setInstansi(institution.name)}>
                        {institution.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    INSTANSIS.map((item) => (
                      <DropdownMenuItem key={item} onClick={() => setInstansi(item)}>
                        {item}
                      </DropdownMenuItem>
                    ))
                  )}
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
            {!data ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Loading...</div>
                  <div className="text-sm text-muted-foreground">Memuat data instansi</div>
                </div>
              </div>
            ) : (
              <>
                {/* Info Instansi & Statistik */}
                <Card className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">Informasi Instansi</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Detail lengkap instansi yang sedang dimonitor</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Kiri: Info Instansi */}
                    <div>
                      <div className="font-bold text-base mb-1 flex items-center gap-2">{data.nama} <span className="px-2 py-1 text-xs rounded bg-muted">{data.kategori}</span></div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><MapPin size={16} />{data.alamat}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Phone size={16} />{data.telp}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Mail size={16} />{data.email}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Globe size={16} />{data.web}</div>
                    </div>
                    {/* Kanan: Statistik */}
                    <div className="md:pl-8">
                      <div className="font-semibold mb-2">Statistik</div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                        <span className="text-muted-foreground">Didirikan:</span><span className="font-semibold text-foreground text-right">{data.didirikan}</span>
                        <span className="text-muted-foreground">Total Pegawai:</span><span className="font-semibold text-foreground text-right">{data.pegawai}</span>
                        <span className="text-muted-foreground">Total Dokumen:</span><span className="font-semibold text-foreground text-right">{data.totalDokumen}</span>
                        <span className="text-muted-foreground">Update Terakhir:</span><span className="font-semibold text-foreground text-right">{data.update}</span>
                      </div>
                    </div>
                  </div>
                </Card>
                {/* Statistik Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {data.stats?.map((s: { label: string; value: string; change: string }, i: number) => (
                    <Card key={i} className="p-6 flex flex-col gap-1 items-start">
                      <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                      <div className="text-2xl font-bold">{s.value}</div>
                      <div className="text-xs text-green-700">{s.change}</div>
                    </Card>
                  ))}
                </div>
                {/* Indikator Compliance Dokumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex flex-col gap-0 mb-0">
                      <div className="font-semibold text-lg">Indikator Compliance Berbasis Dokumen</div>
                      <div className="text-sm text-muted-foreground">Analisis kepatuhan berdasarkan dokumen yang diunggah</div>
                    </div>
                    <div className="space-y-6">
                      {data.complianceDokumen?.map((row: { label: string; sangat: number; sebagian: number; tidak: number; none: number }, i: number) => (
                        <div key={i}>
                          <div className="mb-2 font-semibold text-sm">{row.label}</div>
                          <div className="flex gap-2">
                            <div className="bg-green-600 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">Sangat Sesuai</div>
                              <div className="text-2xl font-bold mt-1">{row.sangat}</div>
                            </div>
                            <div className="bg-yellow-400 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">Sesuaikan Sebagian</div>
                              <div className="text-2xl font-bold mt-1">{row.sebagian}</div>
                            </div>
                            <div className="bg-red-500 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">Tidak Sesuai</div>
                              <div className="text-2xl font-bold mt-1">{row.tidak}</div>
                            </div>
                            <div className="bg-gray-400 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">None</div>
                              <div className="text-2xl font-bold mt-1">{row.none}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex flex-col gap-0 mb-0">
                      <div className="font-semibold text-lg">Indikator Compliance Berbasis Sentimen Review</div>
                      <div className="text-sm text-muted-foreground">Analisis kepatuhan berdasarkan sentimen dari review dan feedback</div>
                    </div>
                    <div className="space-y-6">
                      {data.complianceSentimen?.map((row: { label: string; positif: number; netral: number; negatif: number; none: number }, i: number) => (
                        <div key={i}>
                          <div className="mb-2 font-semibold text-sm">{row.label}</div>
                          <div className="flex gap-2">
                            <div className="bg-green-600 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">Positif</div>
                              <div className="text-2xl font-bold mt-1">{row.positif}</div>
                            </div>
                            <div className="bg-yellow-400 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">Netral</div>
                              <div className="text-2xl font-bold mt-1">{row.netral}</div>
                            </div>
                            <div className="bg-red-500 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">Negatif</div>
                              <div className="text-2xl font-bold mt-1">{row.negatif}</div>
                            </div>
                            <div className="bg-gray-400 text-white rounded min-w-28 flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
                              <div className="text-xs font-semibold">None</div>
                              <div className="text-2xl font-bold mt-1">{row.none}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
