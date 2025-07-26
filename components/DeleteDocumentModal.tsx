"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Trash2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface DeleteDocumentModalProps {
  document: {
    id: number
    title: string
    filename: string
  }
  onDeleteSuccess: () => void
}

export default function DeleteDocumentModal({ document, onDeleteSuccess }: DeleteDocumentModalProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setOpen(false)
        onDeleteSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Gagal menghapus dokumen')
      }
    } catch (error) {
      console.error('Delete error:', error)
      setError('Terjadi kesalahan saat menghapus dokumen')
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    if (!deleting) {
      setOpen(false)
      setError("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Konfirmasi Hapus
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDescription>
          </Alert>

          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium">{document.title}</div>
            <div className="text-sm text-muted-foreground">{document.filename}</div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Dokumen
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 