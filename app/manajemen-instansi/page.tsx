"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, FileText, User, LogOut, Home, Search, Filter, File, Building2, ChevronRight, ChevronLeft, Users, History, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/toggle-dark-mode";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Interface untuk data instansi
interface Instansi {
  id: number;
  name: string;
  full_name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  established_year: number;
  total_employees: number;
  is_active: boolean;
}

export default function ManajemenInstansiPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [institutions, setInstitutions] = useState<Instansi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { user, logout, token } = useAuth();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Instansi | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    category: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    established_year: new Date().getFullYear(),
    total_employees: 0,
    is_active: true
  });

  useEffect(() => {
    if (token) {
      fetchInstitutions();
    }
  }, [token]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
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
      console.error('Error fetching instansi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitution = async () => {
    try {
      const response = await fetch('/api/institutions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowAddModal(false);
        resetForm();
        fetchInstitutions();
      } else {
        const error = await response.json();
        alert('Gagal menambah instansi: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding instansi:', error);
      alert('Gagal menambah instansi');
    }
  };

  const handleEditInstitution = async () => {
    if (!selectedInstitution) return;

    try {
      const response = await fetch(`/api/institutions/${selectedInstitution.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        resetForm();
        fetchInstitutions();
      } else {
        const error = await response.json();
        alert('Gagal mengubah instansi: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating instansi:', error);
      alert('Gagal mengubah instansi');
    }
  };

  const handleDeleteInstitution = async () => {
    if (!selectedInstitution) return;

    try {
      const response = await fetch(`/api/institutions/${selectedInstitution.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedInstitution(null);
        fetchInstitutions();
      } else {
        const error = await response.json();
        alert('Gagal menghapus instansi: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting instansi:', error);
      alert('Gagal menghapus instansi');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      full_name: "",
      category: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      established_year: new Date().getFullYear(),
      total_employees: 0,
      is_active: true
    });
  };

  const openEditModal = (institution: Instansi) => {
    setSelectedInstitution(institution);
    setFormData({
      name: institution.name,
      full_name: institution.full_name,
      category: institution.category,
      address: institution.address,
      phone: institution.phone,
      email: institution.email,
      website: institution.website,
      established_year: institution.established_year,
      total_employees: institution.total_employees,
      is_active: institution.is_active
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (institution: Instansi) => {
    setSelectedInstitution(institution);
    setShowDeleteModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && institution.is_active) ||
      (filterStatus === "inactive" && !institution.is_active);
    const matchesCategory = filterCategory === "all" || institution.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const categories = [...new Set(institutions.map(inst => inst.category))];

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

              <Link href="/daftar-harga">
                <Button
                  variant="outline"
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {!sidebarCollapsed && "Daftar Harga"}
                </Button>
              </Link>

              {user?.role === 'admin' && (
                <>
                  <Link href="/manajemen-instansi">
                    <Button
                      variant="default"
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
            <div className="text-lg font-semibold">Manajemen Instansi</div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Status: {filterStatus === "all" ? "Semua" : filterStatus === "active" ? "Aktif" : "Nonaktif"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    Semua Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Aktif
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                    Nonaktif
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Kategori: {filterCategory === "all" ? "Semua" : filterCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                    Semua Kategori
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                      {category}
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
            <Card className="p-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-semibold text-xl">Daftar Instansi</div>
                  <div className="text-sm text-muted-foreground">
                    Kelola data instansi dan lembaga ({filteredInstitutions.length} instansi)
                  </div>
                </div>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Tambah Instansi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Instansi Baru</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nama Singkat</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Contoh: Kemenhan"
                        />
                      </div>
                      <div>
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Contoh: Kementerian Pertahanan"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Contoh: Kementerian"
                        />
                      </div>
                      <div>
                        <Label htmlFor="established_year">Tahun Berdiri</Label>
                        <Input
                          id="established_year"
                          type="number"
                          value={formData.established_year}
                          onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telepon</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Contoh: 021-1234567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Contoh: info@kemenhan.go.id"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="Contoh: https://kemenhan.go.id"
                        />
                      </div>
                      <div>
                        <Label htmlFor="total_employees">Jumlah Pegawai</Label>
                        <Input
                          id="total_employees"
                          type="number"
                          value={formData.total_employees}
                          onChange={(e) => setFormData({ ...formData, total_employees: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Status Aktif</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Alamat</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Alamat lengkap instansi"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddModal(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAddInstitution}>
                        Tambah Instansi
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Cari instansi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Institutions Table */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Loading...</div>
                    <div className="text-sm text-muted-foreground">Memuat daftar instansi</div>
                  </div>
                </div>
              ) : filteredInstitutions.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Tidak ada instansi</div>
                    <div className="text-sm text-muted-foreground">
                      {searchQuery || filterStatus !== "all" || filterCategory !== "all"
                        ? "Coba ubah filter atau kata kunci pencarian"
                        : "Belum ada instansi yang terdaftar"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-semibold">Nama</th>
                        <th className="py-3 text-left font-semibold">Kategori</th>
                        <th className="py-3 text-left font-semibold">Tahun Berdiri</th>
                        <th className="py-3 text-left font-semibold">Pegawai</th>
                        <th className="py-3 text-left font-semibold">Status</th>
                        <th className="py-3 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInstitutions.map((institution) => (
                        <tr key={institution.id} className="border-b hover:bg-muted">
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{institution.name}</div>
                              <div className="text-sm text-muted-foreground">{institution.full_name}</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge variant="outline">{institution.category}</Badge>
                          </td>
                          <td className="py-3">{institution.established_year}</td>
                          <td className="py-3">{institution.total_employees.toLocaleString()}</td>
                          <td className="py-3">
                            <Badge className={getStatusBadgeColor(institution.is_active)}>
                              {institution.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(institution)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteModal(institution)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Instansi</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nama Singkat</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-full_name">Nama Lengkap</Label>
                <Input
                  id="edit-full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Kategori</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-established_year">Tahun Berdiri</Label>
                <Input
                  id="edit-established_year"
                  type="number"
                  value={formData.established_year}
                  onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telepon</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-total_employees">Jumlah Pegawai</Label>
                <Input
                  id="edit-total_employees"
                  type="number"
                  value={formData.total_employees}
                  onChange={(e) => setFormData({ ...formData, total_employees: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="edit-is_active">Status Aktif</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address">Alamat</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button onClick={handleEditInstitution}>
                Simpan Perubahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Instansi</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Apakah Anda yakin ingin menghapus instansi <strong>{selectedInstitution?.name}</strong>?</p>
              <p className="text-sm text-muted-foreground mt-2">
                Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait instansi ini.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteInstitution}>
                Hapus Instansi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
} 