import { Card } from "@/components/ui/card";

const relatedDocs = [
  {
    title: "SOP Pengadaan Barang dan Jasa",
    category: "Standar Operasional Prosedur",
    relevance: 95,
  },
  {
    title: "Laporan Keuangan Q3 2024",
    category: "Laporan Keuangan",
    relevance: 88,
  },
  {
    title: "Peraturan Transparansi Publik",
    category: "Peraturan",
    relevance: 82,
  },
  {
    title: "Pedoman Audit Internal",
    category: "Pedoman",
    relevance: 80,
  },
  {
    title: "Instruksi Menteri No. 12",
    category: "Instruksi",
    relevance: 78,
  },
];

export default function RelatedDocumentsCarousel() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {relatedDocs.map((doc, i) => (
          <Card
            key={i}
            className="min-w-[220px] max-w-[220px] p-4 flex flex-col items-start border border-gray-200 shadow-sm bg-white"
          >
            <div className="font-semibold mb-1 line-clamp-2">{doc.title}</div>
            <div className="text-xs text-muted-foreground mb-2">{doc.category}</div>
            <div className="text-xs font-medium text-blue-700 bg-blue-50 rounded px-2 py-1">
              {doc.relevance}% relevan
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 