"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText, FileSpreadsheet, FileImage } from "lucide-react"

interface AnalysisDocument {
  id: number;
  analysis_id: string;
  judul_kegiatan: string;
  deskripsi_kegiatan: string;
  include_dok_keuangan: boolean;
  path_dok_kegiatan: string;
  path_dok_keuangan: string | null;
  created_at: string;
  institution: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  analysis_files: Array<{
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
  }>;
}

interface DocumentPreviewProps {
  document: AnalysisDocument
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <DialogTitle>Preview Dokumen Analisis</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Analysis Info */}
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{document.judul_kegiatan}</h3>
              <p className="text-sm text-muted-foreground mb-2">ID Analisis: {document.analysis_id}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{document.institution.name}</Badge>
                <Badge variant="outline">{document.include_dok_keuangan ? 'Dengan Dok. Keuangan' : 'Tanpa Dok. Keuangan'}</Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Deskripsi Kegiatan</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {document.deskripsi_kegiatan}
            </p>
          </div>

          {/* Files */}
          <div>
            <h4 className="font-medium mb-2">Dokumen Terkait</h4>
            <div className="space-y-2">
              {document.analysis_files.map((file, index) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.file_name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary">{formatFileSize(file.file_size)}</Badge>
                      <Badge variant="outline">{file.file_type.split('/')[1]?.toUpperCase()}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Dianalisis oleh:</span>
              <p className="text-muted-foreground">{document.user.name}</p>
              <p className="text-muted-foreground text-xs">{document.user.email}</p>
            </div>
            <div>
              <span className="font-medium">Tanggal analisis:</span>
              <p className="text-muted-foreground">
                {formatDate(document.created_at)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 