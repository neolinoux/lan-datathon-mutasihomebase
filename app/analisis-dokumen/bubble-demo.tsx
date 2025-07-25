import BubbleAIRecommendation from "../components/BubbleAIRecommendation";
import BubbleAIAnalisisIndikator from "../components/BubbleAIAnalisisIndikator";

export default function BubbleDemoPage() {
  return (
    <div className="flex flex-col items-center py-10 gap-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Demo Bubble AI</h1>
      <BubbleAIRecommendation />
      <BubbleAIAnalisisIndikator />
      <BubbleAIAnalisisIndikator />
      <BubbleAIAnalisisIndikator />
    </div>
  );
} 