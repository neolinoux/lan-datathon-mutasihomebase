import RelatedDocumentsCarousel from "./RelatedDocumentsCarousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BubbleAIPromptResultProps {
  fileName: string;
}

const indikatorDummy = [
  {
    indikator: "Prosedural",
    skor: 85,
    status: "Sangat Sesuai",
    detail: "Prosedur telah didokumentasikan dengan baik dan diikuti secara konsisten",
    alasan: "Kepatuhan yang kuat terhadap prosedur yang telah ditetapkan dengan sedikit celah dalam pembaruan dokumentasi",
  },
  {
    indikator: "Efisiensi Anggaran",
    skor: 72,
    status: "Cukup",
    detail: "Beberapa area efisiensi anggaran perlu ditingkatkan",
    alasan: "Pengelolaan anggaran sudah baik namun masih ada ruang untuk optimalisasi dalam alokasi sumber daya",
  },
  {
    indikator: "Transparansi",
    skor: 68,
    status: "Cukup",
    detail: "Beberapa celah transparansi teridentifikasi",
    alasan: "Keterbukaan informasi perlu ditingkatkan, terutama dalam proses pengadaan barang dan jasa",
  },
  {
    indikator: "Regulasi",
    skor: 90,
    status: "Sangat Sesuai",
    detail: "Kepatuhan regulasi penuh telah tercapai",
    alasan: "Kepatuhan yang sangat baik terhadap semua regulasi yang berlaku dan pembaruan yang tepat waktu",
  },
  {
    indikator: "Etika dan Antikorupsi",
    skor: 90,
    status: "Sangat Sesuai",
    detail: "Kepatuhan etika dan antikorupsi telah tercapai",
    alasan: "Kepatuhan yang sangat baik terhadap semua etika dan antikorupsi yang berlaku dan pembaruan yang tepat waktu",
  },
  {
    indikator: "Pengelolaan Sumber Daya",
    skor: 90,
    status: "Sangat Sesuai",
    detail: "Kepatuhan pengelolaan sumber daya telah tercapai",
    alasan: "Kepatuhan yang sangat baik terhadap semua pengelolaan sumber daya yang berlaku dan pembaruan yang tepat waktu",
  },
];

export default function BubbleAIPromptResult({ fileName }: BubbleAIPromptResultProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-6 w-full max-w-xl">
        {/* Pesan hasil analisis */}
        <Card className="p-5 border-l-4 border-blue-500 bg-muted text-card-foreground">
          <div className="text-sm mb-2">
            Analisis dokumen <span className="font-semibold">"{fileName}"</span> telah selesai. Berikut adalah hasil analisis kepatuhan:
          </div>
        </Card>
        {/* Dokumen terkait */}
        <Card className="p-5 border-l-4 border-blue-500 bg-muted text-card-foreground">
          <div className="font-semibold mb-2 text-sm">Dokumen Terkait</div>
          <RelatedDocumentsCarousel />
        </Card>
        {/* Indikator kepatuhan */}
        {indikatorDummy.map((item, i) => (
          <Card key={i} className="p-5 border-l-4 border-blue-500 bg-card text-card-foreground flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold flex-1">{item.indikator}</span>
              <Badge variant="outline">{item.status}</Badge>
              <span className="ml-2 font-bold text-base">{item.skor}%</span>
            </div>
            <Progress value={item.skor} className="h-2 mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Detail: {item.detail}</div>
            <div className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1">Alasan Klasifikasi: {item.alasan}</div>
          </Card>
        ))}
      </div>
    </div>
  );
} 