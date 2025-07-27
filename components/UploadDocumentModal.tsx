"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface UploadDocumentModalProps {
  onUploadSuccess: () => void
  institutionId: number
}

export default function UploadDocumentModal({ onUploadSuccess, institutionId }: UploadDocumentModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Tipe file tidak didukung. Hanya PDF, Word, dan Excel yang diizinkan.')
        return
      }

      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 10MB.')
        return
      }

      setFile(selectedFile)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !file) {
      setError('Semua field harus diisi')
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('institutionId', institutionId.toString())

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()

        // Reset form
        setTitle("")
        setDescription("")
        setFile(null)
        setOpen(false)

        // Notify parent component
        onUploadSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Gagal mengunggah dokumen')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Terjadi kesalahan saat mengunggah dokumen')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setOpen(false)
      setTitle("")
      setDescription("")
      setFile(null)
      setError("")
    }
  }

  const removeFile = () => {
    setFile(null)
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Dokumen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Dokumen Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Dokumen *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul dokumen"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Dokumen *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi dokumen"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File Dokumen *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted transition-colors">
              {file ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Klik untuk memilih file</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Word, atau Excel (maks. 10MB)
                    </p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file')?.click()}
                    disabled={loading}
                  >
                    Pilih File
                  </Button>
                </div>
              )}
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
              disabled={loading || !title.trim() || !description.trim() || !file}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                'Upload Dokumen'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 