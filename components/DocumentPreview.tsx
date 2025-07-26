"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText, FileSpreadsheet, FileImage } from "lucide-react"

interface DocumentPreviewProps {
  document: {
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
}

export default function DocumentPreview({ document }: DocumentPreviewProps) {
  const [open, setOpen] = useState(false)

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-6 w-6 text-red-500" />
    if (fileType.includes('word')) return <FileText className="h-6 w-6 text-blue-500" />
    if (fileType.includes('excel')) return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    return <FileImage className="h-6 w-6 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = () => {
    // Create a temporary link to download the file
    const link = document.createElement('a')
    link.href = document.file_path
    link.download = document.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Preview Dokumen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              {getFileIcon(document.file_type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{document.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{document.filename}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{formatFileSize(document.file_size)}</Badge>
                <Badge variant="outline">{document.file_type.split('/')[1]?.toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Deskripsi</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {document.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Diunggah oleh:</span>
              <p className="text-muted-foreground">{document.uploaded_by_user.name}</p>
              <p className="text-muted-foreground text-xs">{document.uploaded_by_user.email}</p>
            </div>
            <div>
              <span className="font-medium">Tanggal upload:</span>
              <p className="text-muted-foreground">
                {new Date(document.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Preview Area */}
          <div>
            <h4 className="font-medium mb-2">Preview</h4>
            <div className="border rounded-lg p-4 bg-muted/50 min-h-[200px] flex items-center justify-center">
              {document.file_type.includes('pdf') ? (
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">PDF Preview</p>
                  <p className="text-xs text-muted-foreground">Klik download untuk melihat file lengkap</p>
                </div>
              ) : document.file_type.includes('word') ? (
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Word Document</p>
                  <p className="text-xs text-muted-foreground">Klik download untuk membuka di Word</p>
                </div>
              ) : document.file_type.includes('excel') ? (
                <div className="text-center">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Excel Spreadsheet</p>
                  <p className="text-xs text-muted-foreground">Klik download untuk membuka di Excel</p>
                </div>
              ) : (
                <div className="text-center">
                  <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">File Preview</p>
                  <p className="text-xs text-muted-foreground">Klik download untuk melihat file</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Tutup
            </Button>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 