"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Edit } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Document {
  id: number
  title: string
  description: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  created_at: string
  uploaded_by_user: {
    name: string
    email: string
  }
}

interface EditDocumentModalProps {
  document: Document
  onEditSuccess: () => void
}

export default function EditDocumentModal({ document, onEditSuccess }: EditDocumentModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  useEffect(() => {
    if (open && document) {
      setTitle(document.title)
      setDescription(document.description)
      setError("")
    }
  }, [open, document])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      setError('Judul dan deskripsi harus diisi')
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim()
        })
      })

      if (response.ok) {
        const result = await response.json()

        setOpen(false)
        onEditSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Gagal mengedit dokumen')
      }
    } catch (error) {
      console.error('Edit error:', error)
      setError('Terjadi kesalahan saat mengedit dokumen')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setOpen(false)
      setTitle(document.title)
      setDescription(document.description)
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
          <DialogTitle>Edit Dokumen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Judul Dokumen *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul dokumen"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Deskripsi Dokumen *</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi dokumen"
              rows={3}
              disabled={loading}
            />
          </div>

          {/* File Info (Read-only) */}
          <div className="space-y-2">
            <Label>Informasi File</Label>
            <div className="p-3 bg-muted rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Nama file:</span>
                <span className="font-medium">{document.filename}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipe file:</span>
                <span className="font-medium">{document.file_type}</span>
              </div>
              <div className="flex justify-between">
                <span>Ukuran:</span>
                <span className="font-medium">
                  {(document.file_size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
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
              disabled={loading || !title.trim() || !description.trim()}
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