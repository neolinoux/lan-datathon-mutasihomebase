"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, FileText, User, LogOut, Home } from "lucide-react";
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

const DUMMY_USERS = [
  { id: 1, name: "Andi Setiawan", email: "andi@bps.go.id", role: "Admin" },
  { id: 2, name: "Budi Santoso", email: "budi@bps.go.id", role: "Operator" },
  { id: 3, name: "Citra Dewi", email: "citra@bps.go.id", role: "Viewer" },
];

export default function ManajemenPenggunaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [instansi, setInstansi] = useState(INSTANSIS[0]);
  const [users, setUsers] = useState<any[]>([]);
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute requiredRole="admin">
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
            <nav className="flex flex-col gap-2 items-center flex-1">
              {/* Dashboard */}
              <Link href="/" className="w-11/12 cursor-pointer">
                <Button
                  variant="ghost"
                  className={`w-full font-semibold text-left border border-border rounded-lg cursor-pointer mt-4 ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors`}
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
                  className={`w-full font-semibold text-left border border-border rounded-lg cursor-pointer mt-2 ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors`}
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
              <Link href="/manajemen-pengguna" className="w-11/12 cursor-pointer">
                <Button
                  variant="ghost"
                  className={`w-full font-semibold text-left border border-border rounded-lg cursor-pointer mt-2 ${sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-0 py-3'} hover:bg-muted focus:bg-muted transition-colors bg-muted`}
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
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar atas */}
          <nav className="w-full bg-card border-b px-8 py-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Manajemen Pengguna</div>
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
            <Card className="p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-semibold text-xl">Daftar Pengguna</div>
                  <div className="text-sm text-muted-foreground">Kelola pengguna dan hak akses sistem</div>
                </div>
                <Button>+ Tambah Pengguna</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-semibold">Nama</th>
                      <th className="py-3 text-left font-semibold">Email</th>
                      <th className="py-3 text-left font-semibold">Role</th>
                      <th className="py-3 text-left font-semibold">Status</th>
                      <th className="py-3 text-left font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_USERS.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted">
                        <td className="py-3 font-medium">{user.name}</td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'Operator' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Hapus</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 