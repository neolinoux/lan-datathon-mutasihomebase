import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

const topics = [
  "Transparansi Publik",
  "Etika Kerja",
  "Prosedur Standar",
  "Manajemen Risiko",
];

export default function BubbleAIVideoPembelajaran() {
  return (
    <Card className="p-5 border-l-4 border-green-500 bg-muted text-card-foreground flex flex-col gap-4">
      <div className="font-semibold mb-1">Video Pembelajaran yang Dihasilkan</div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center justify-center w-24 h-16 bg-gray-200 dark:bg-gray-800 rounded">
          <PlayCircle size={32} className="text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="font-medium">Panduan Peningkatan Skor Kepatuhan</div>
          <div className="text-xs text-muted-foreground mb-1">Video pembelajaran interaktif untuk meningkatkan skor kepatuhan berdasarkan analisis dokumen Anda</div>
          <div className="text-xs text-muted-foreground mb-2">8:45</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {topics.map((t, i) => (
              <span key={i} className="text-xs bg-muted px-2 py-1 rounded border border-border">{t}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Tonton Video</Button>
            <Button size="sm" variant="outline">Unduh</Button>
            <Button size="sm" variant="outline">Bagikan</Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 