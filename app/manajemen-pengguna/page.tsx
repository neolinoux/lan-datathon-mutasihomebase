"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, FileText, User, LogOut, Home, Search, Filter, File, Building2, ChevronRight, ChevronLeft, Users, History } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/toggle-dark-mode";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import AddUserModal from "@/components/AddUserModal";
import EditUserModal from "@/components/EditUserModal";
import DeleteUserModal from "@/components/DeleteUserModal";

// Interface untuk data instansi dari database
interface InstansiData {
  id: number;
  name: string;
  category: string;
}

interface User {
  id: number
  name: string
  email: string
  role: string
  is_active: boolean
  institution?: {
    id: number
    name: string
  }
  created_at: string
}

export default function ManajemenPenggunaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [instansiList, setInstansiList] = useState<InstansiData[]>([]);
  const [selectedInstansi, setSelectedInstansi] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const { user, logout, token } = useAuth();

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
        }
      } catch (error) {
        console.error('Error fetching instansi:', error);
      }
    };

    if (token) {
      fetchInstansi();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterRole === "all" || user.role === filterRole
    const matchesInstansi = selectedInstansi === "" || user.institution?.name === selectedInstansi
    return matchesSearch && matchesFilter && matchesInstansi
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'user':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        {/* Sidebar kiri collapsable */}
        <aside className={`transition-all duration-200 border-r bg-card flex flex-col ${sidebarCollapsed ? 'w-18' : 'w-64'} h-screen min-h-screen p-0`}>
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

              {/* <Link href="/manajemen-file">
                <Button
                  variant="outline"
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {!sidebarCollapsed && "Manajemen File"}
                </Button>
              </Link> */}


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
                      variant="default"
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
            <div className="text-lg font-semibold">Manajemen Pengguna</div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[220px] justify-between">
                    {selectedInstansi || user?.institution?.name || 'Pilih Instansi'}
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedInstansi("")}>
                    Semua Instansi
                  </DropdownMenuItem>
                  {instansiList.map((instansi) => (
                    <DropdownMenuItem key={instansi.id} onClick={() => setSelectedInstansi(instansi.name)}>
                      {instansi.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter: {filterRole === "all" ? "Semua Role" : filterRole}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterRole("all")}>
                    Semua Role
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("admin")}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("user")}>
                    User
                  </DropdownMenuItem>
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
            <Card className="p-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-semibold text-xl">Daftar Pengguna</div>
                  <div className="text-sm text-muted-foreground">
                    Kelola pengguna dan hak akses sistem ({filteredUsers.length} pengguna)
                  </div>
                </div>
                <AddUserModal onUserAdded={fetchUsers} />
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Cari pengguna..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {/* The DropdownMenu for Filter was moved outside the main content */}
              </div>

              {/* Users Table */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Loading...</div>
                    <div className="text-sm text-muted-foreground">Memuat daftar pengguna</div>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Tidak ada pengguna</div>
                    <div className="text-sm text-muted-foreground">
                      {searchQuery || filterRole !== "all" || selectedInstansi !== ""
                        ? "Coba ubah filter atau kata kunci pencarian"
                        : "Belum ada pengguna yang terdaftar"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-semibold">Nama</th>
                        <th className="py-3 text-left font-semibold">Email</th>
                        <th className="py-3 text-left font-semibold">Role</th>
                        <th className="py-3 text-left font-semibold">Instansi</th>
                        <th className="py-3 text-left font-semibold">Status</th>
                        <th className="py-3 text-left font-semibold">Tanggal Dibuat</th>
                        <th className="py-3 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted">
                          <td className="py-3 font-medium">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3">
                            {user.institution?.name || '-'}
                          </td>
                          <td className="py-3">
                            <Badge variant={user.is_active ? "default" : "secondary"}>
                              {user.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <EditUserModal user={user} onUserUpdated={fetchUsers} />
                              <DeleteUserModal user={user} onUserDeleted={fetchUsers} />
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
  );
} 