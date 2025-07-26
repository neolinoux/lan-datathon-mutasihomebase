"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface DownloadDocumentProps {
  document: {
    id: number
    filename: string
    file_path: string
  }
}

export default function DownloadDocument({ document }: DownloadDocumentProps) {
  const [downloading, setDownloading] = useState(false)
  const { token } = useAuth()

  const handleDownload = async () => {
    setDownloading(true)

    try {
      // Create a temporary link to download the file
      const link = document.createElement('a')
      link.href = document.file_path
      link.download = document.filename
      link.target = '_blank'

      // Add authorization header if needed
      if (token) {
        // For files that require authentication, you might need to fetch them first
        // For now, we'll use direct link since files are in public folder
      }

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

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-3 w-3" />
          Download
        </>
      )}
    </Button>
  )
} 