import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const rekomendasiDummy = [
  {
    title: "Implementasi Dashboard Transparansi",
    category: "Transparansi",
    level: "TINGGI",
    description: "Membuat dashboard publik untuk pelaporan transparansi secara real-time",
    steps: [
      "Merancang antarmuka dashboard",
      "Mengintegrasikan sumber data",
      "Implementasi pembaruan real-time",
      "Melatih staf untuk pemeliharaan",
    ],
  },
  {
    title: "Program Pelatihan Etika",
    category: "Etika dan Antikorupsi",
    level: "SEDANG",
    description: "Mengembangkan program pelatihan etika komprehensif untuk seluruh pegawai",
    steps: [
      "Menilai pengetahuan etika saat ini",
      "Mengembangkan materi pelatihan",
      "Menjadwalkan sesi pelatihan",
      "Implementasi sistem penilaian",
    ],
  },
];

export default function BubbleAISentiment() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-6 w-full max-w-xl">
        <Card className="p-5 border-l-4 border-yellow-400 bg-muted text-card-foreground flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base flex-1">Analisis Sentimen</span>
            <Badge className="bg-green-600 text-white">Positif</Badge>
            <span className="text-xs text-muted-foreground">Kepercayaan: 82.0%</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">Tingkat Risiko:</span>
            <Badge className="bg-yellow-500 text-white">Sedang</Badge>
          </div>
          <div className="font-semibold mb-2 text-sm">Rekomendasi Perbaikan</div>
          {rekomendasiDummy.map((rec, i) => (
            <Card key={i} className="p-4 border-l-4 border-yellow-400 bg-card text-card-foreground flex flex-col gap-2 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold flex-1">{rec.title}</span>
                <Badge variant="outline" className="mr-1">{rec.category}</Badge>
                <Badge className="bg-yellow-500 text-white">{rec.level}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{rec.description}</div>
              <div>
                <div className="flex items-center gap-2 font-medium mb-1">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  Langkah-langkah Implementasi:
                </div>
                <ol className="list-decimal ml-6 space-y-1 text-sm">
                  {rec.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline">Lihat Detail</Button>
                <Button>Mulai Implementasi</Button>
              </div>
            </Card>
          ))}
        </Card>
      </div>
    </div>
  );
} 