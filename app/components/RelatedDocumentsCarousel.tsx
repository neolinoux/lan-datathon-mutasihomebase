import { Card } from "@/components/ui/card";

interface RelatedDocumentsCarouselProps {
  list_peraturan_terkait?: Array<{
    judul_peraturan: string;
    instansi: string;
    tingkat_kepatuhan: number;
    url_pera: string;
  }>;
  error?: string;
}

export default function RelatedDocumentsCarousel({ list_peraturan_terkait, error }: RelatedDocumentsCarouselProps) {
  // Jika ada error, tampilkan pesan error
  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-red-700">
          <p className="font-medium">Gagal memuat dokumen terkait:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Jika tidak ada data peraturan terkait, tampilkan pesan
  if (!list_peraturan_terkait || list_peraturan_terkait.length === 0) {
    return (
      <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-md">
        <div className="text-gray-600">
          <p>Tidak ada dokumen terkait yang ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {list_peraturan_terkait.map((doc, i) => (
          <Card
            key={i}
            className="min-w-[220px] max-w-[220px] p-4 flex flex-col items-start border border-gray-200 shadow-sm bg-muted"
          >
            <div className="font-semibold mb-1 line-clamp-2">{doc.judul_peraturan}</div>
            <div className="text-xs text-muted-foreground mb-2">{doc.instansi}</div>
            <div className="text-xs font-medium text-blue-700 bg-blue-50 rounded px-2 py-1">
              {Math.round(doc.tingkat_kepatuhan * 100)}% kepatuhan
            </div>
            {doc.url_pera && (
              <a
                href={doc.url_pera}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Lihat peraturan →
              </a>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 