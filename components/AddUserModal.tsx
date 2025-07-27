"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Institution {
  id: number
  name: string
}

interface AddUserModalProps {
  onUserAdded: () => void
}

export default function AddUserModal({ onUserAdded }: AddUserModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [institutionId, setInstitutionId] = useState("")
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  useEffect(() => {
    if (open) {
      fetchInstitutions()
    }
  }, [open])

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

    if (!name.trim() || !email.trim() || !password.trim() || !role || !institutionId) {
      setError('Semua field harus diisi')
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: role,
          institution_id: parseInt(institutionId)
        })
      })

      if (response.ok) {
        const result = await response.json()

        // Reset form
        setName("")
        setEmail("")
        setPassword("")
        setRole("")
        setInstitutionId("")
        setOpen(false)

        // Notify parent component
        onUserAdded()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Gagal menambahkan pengguna')
      }
    } catch (error) {
      console.error('Add user error:', error)
      setError('Terjadi kesalahan saat menambahkan pengguna')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setOpen(false)
      setName("")
      setEmail("")
      setPassword("")
      setRole("")
      setInstitutionId("")
      setError("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Pengguna
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Tambah Pengguna Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
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
            <Label htmlFor="institution">Instansi *</Label>
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
              disabled={loading || !name.trim() || !email.trim() || !password.trim() || !role || !institutionId}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menambahkan...
                </>
              ) : (
                'Tambah Pengguna'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 