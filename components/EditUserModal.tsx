"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Edit, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Institution {
  id: number
  name: string
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
}

interface EditUserModalProps {
  user: User
  onUserUpdated: () => void
}

export default function EditUserModal({ user, onUserUpdated }: EditUserModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [institutionId, setInstitutionId] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  useEffect(() => {
    if (open && user) {
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
      setInstitutionId(user.institution?.id?.toString() || "")
      setIsActive(user.is_active)
      setError("")
      fetchInstitutions()
    }
  }, [open, user])

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/institutions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setInstitutions(data)
      }
    } catch (error) {
      console.error('Error fetching institutions:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !role) {
      setError('Nama, email, dan role harus diisi')
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role,
          institution_id: institutionId ? parseInt(institutionId) : null,
          is_active: isActive
        })
      })

      if (response.ok) {
        const result = await response.json()

        setOpen(false)
        onUserUpdated()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Gagal mengupdate pengguna')
      }
    } catch (error) {
      console.error('Update user error:', error)
      setError('Terjadi kesalahan saat mengupdate pengguna')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setOpen(false)
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
      setInstitutionId(user.institution?.id?.toString() || "")
      setIsActive(user.is_active)
      setError("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-3 w-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Pengguna
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nama Lengkap *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role *</Label>
            <Select value={role} onValueChange={setRole} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-institution">Instansi *</Label>
            <Select value={institutionId} onValueChange={setInstitutionId} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih instansi" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id.toString()}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="edit-status">Status Akun</Label>
            <Switch
              id="edit-status"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim() || !email.trim() || !role || !institutionId}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 