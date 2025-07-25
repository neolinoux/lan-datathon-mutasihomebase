"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, MapPin, Phone, Mail, Globe, FileText } from "lucide-react";
import Link from "next/link";

const instansiInfo = {
  nama: "Badan Pusat Statistik",
  kategori: "Lembaga Pemerintah Nonkementerian",
  alamat: "Jl. Dr. Sutomo No.6-8, Jakarta 10710",
  telp: "+62 21 3841195",
  email: "bps@bps.go.id",
  web: "www.bps.go.id",
  didirikan: "26 Februari 1960",
  pegawai: "12,500",
  totalDokumen: "8,320",
  update: "15 Juli 2025, 10:00 WIB",
};

const stats = [
  { label: "Total Analisis Dokumen", value: "2,847", change: "+12% dari bulan lalu" },
  { label: "Rata-rata Skor Kepatuhan", value: "84.2%", change: "+3.1% dari bulan lalu" },
  { label: "Sentimen Positif", value: "78.5%", change: "+5.2% dari bulan lalu" },
  { label: "Pengguna Aktif", value: "1,247", change: "+8.1% dari bulan lalu" },
];

const complianceDokumen = [
  { label: "Prosedural", sangat: 88, sebagian: 45, tidak: 2, none: 0 },
  { label: "Efisiensi Anggaran", sangat: 88, sebagian: 45, tidak: 2, none: 0 },
  { label: "Transparansi", sangat: 75, sebagian: 52, tidak: 8, none: 0 },
  { label: "Regulasi", sangat: 92, sebagian: 38, tidak: 5, none: 0 },
];
const complianceSentimen = [
  { label: "Prosedural", positif: 88, netral: 45, negatif: 2, none: 0 },
  { label: "Efisiensi Anggaran", positif: 88, netral: 45, negatif: 2, none: 0 },
  { label: "Transparansi", positif: 75, netral: 52, negatif: 8, none: 0 },
  { label: "Regulasi", positif: 92, netral: 38, negatif: 5, none: 0 },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar kiri collapsable */}
      <aside className={`transition-all duration-200 border-r bg-card flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} min-h-screen h-screen p-0`}>
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
          <hr className="w-full p-2" />
          {/* Menu utama */}
          <nav className="flex flex-col gap-2 items-center flex-1">
            <Link href="/analisis-dokumen" className="w-11/12 cursor-pointer">
              <Button
                variant="ghost"
                className={`w-full font-semibold text-left border border-border rounded-lg cursor-pointer ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors`}
              >
                {sidebarOpen ? (
                  <span>Analisis Dokumen</span>
                ) : (
                  <FileText size={22} />
                )}
              </Button>
            </Link>
          </nav>
          <div />
        </div>
      </aside>
      {/* Konten utama */}
      <main className="flex-1 p-6 space-y-4">
        {/* Info Instansi & Statistik */}
        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1 flex-col md:flex-row">
            <div className="flex flex-col items-start w-full">
              <span className="font-semibold text-lg md:text-xl mb-1">Informasi Instansi</span>
              <div className="text-sm text-muted-foreground">Detail lengkap instansi yang sedang dimonitor</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Kiri: Info Instansi */}
            <div>
              <div className="font-bold text-base mb-1 flex items-center gap-2">{instansiInfo.nama} <span className="px-2 py-1 text-xs rounded bg-muted">{instansiInfo.kategori}</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><MapPin size={16} />{instansiInfo.alamat}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Phone size={16} />{instansiInfo.telp}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Mail size={16} />{instansiInfo.email}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Globe size={16} />{instansiInfo.web}</div>
            </div>
            {/* Kanan: Statistik */}
            <div className="md:pl-8">
              <div className="font-semibold mb-2">Statistik</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                <span className="text-muted-foreground">Didirikan:</span><span className="font-semibold text-foreground text-right">{instansiInfo.didirikan}</span>
                <span className="text-muted-foreground">Total Pegawai:</span><span className="font-semibold text-foreground text-right">{instansiInfo.pegawai}</span>
                <span className="text-muted-foreground">Total Dokumen:</span><span className="font-semibold text-foreground text-right">{instansiInfo.totalDokumen}</span>
                <span className="text-muted-foreground">Update Terakhir:</span><span className="font-semibold text-foreground text-right">{instansiInfo.update}</span>
              </div>
            </div>
          </div>
        </Card>
        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((s, i) => (
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
            <div className="font-semibold mb-2 text-lg">Indikator Compliance Berbasis Dokumen</div>
            <div className="text-sm text-muted-foreground mb-4">Analisis kepatuhan berdasarkan dokumen yang diunggah</div>
            <div className="space-y-4">
              {complianceDokumen.map((row, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-40 font-semibold">{row.label}</div>
                  <div className="flex gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded px-4 py-2 font-bold">Sangat Sesuai<br />{row.sangat}</div>
                    <div className="bg-yellow-400 text-white rounded px-4 py-2 font-bold">Sesuaikan Sebagian<br />{row.sebagian}</div>
                    <div className="bg-red-500 text-white rounded px-4 py-2 font-bold">Tidak Sesuai<br />{row.tidak}</div>
                    <div className="bg-gray-400 text-white rounded px-4 py-2 font-bold">None<br />{row.none}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="font-semibold mb-2 text-lg">Indikator Compliance Berbasis Sentimen Review</div>
            <div className="text-sm text-muted-foreground mb-4">Analisis kepatuhan berdasarkan sentimen dari review dan feedback</div>
            <div className="space-y-4">
              {complianceSentimen.map((row, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-40 font-semibold">{row.label}</div>
                  <div className="flex gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded px-4 py-2 font-bold">Positif<br />{row.positif}</div>
                    <div className="bg-yellow-400 text-white rounded px-4 py-2 font-bold">Netral<br />{row.netral}</div>
                    <div className="bg-red-500 text-white rounded px-4 py-2 font-bold">Negatif<br />{row.negatif}</div>
                    <div className="bg-gray-400 text-white rounded px-4 py-2 font-bold">None<br />{row.none}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
