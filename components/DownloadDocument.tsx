"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

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

interface DownloadDocumentProps {
  document: AnalysisDocument
}

export default function DownloadDocument({ document: analysisDoc }: DownloadDocumentProps) {
  const [downloading, setDownloading] = useState(false)
  const { token, user } = useAuth()

  const handleDownload = async (file: { file_name: string, file_path: string }) => {
    setDownloading(true)

    try {
      // Check if user has permission to download this file
      if (!(user?.role === 'admin' && user?.institution?.id === 0) && user?.id !== analysisDoc.user.id) {
        console.error('Unauthorized: User cannot download this file')
        setDownloading(false)
        return
      }

      // Create a temporary link to download the file
      const link = document.createElement('a')
      link.href = `/uploads/analysis/${analysisDoc.institution.id}/${analysisDoc.user.id}/${file.file_name}`
      link.download = file.file_name
      link.target = '_blank'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Optional: Add a small delay to show the loading state
      setTimeout(() => {
        setDownloading(false)
      }, 1000)

    } catch (error) {
      console.error('Download error:', error)
      setDownloading(false)
    }
  }

  // Check if user has permission to see download buttons
  const canDownload = (user?.role === 'admin' && user?.institution?.id === 0) || user?.id === analysisDoc.user.id

  if (!canDownload) {
    return null // Don't show download buttons for unauthorized users
  }

  return (
    <div className="flex gap-1">
      {analysisDoc.analysis_files.map((file, index) => (
        <Button
          key={file.id}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleDownload(file)}
          disabled={downloading}
          title={`Download ${file.file_name}`}
        >
          {downloading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-3 w-3" />
              {index === 0 ? 'Dok. Kegiatan' : 'Dok. Keuangan'}
            </>
          )}
        </Button>
      ))}
    </div>
  )
} 