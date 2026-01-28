import { DoseCard } from "./DoseCard";
import { DoseSection } from "./DoseSection";
import { Sun, Sunset, AlertCircle } from "lucide-react";

export function TodayTab() {
  return (
    <div className="flex flex-col gap-2">
      {/* Vencida */}
      <DoseSection
        title="Vencida"
        variant="overdue"
        icon={<AlertCircle className="w-5 h-5" />}
      >
        <DoseCard
          time="AYER - 09:00 PM"
          medicine="Vitamina D3 1000UI"
          instruction="1 cápsula después de cenar"
          status="pending"
          variant="overdue"
        />
      </DoseSection>

      {/* Mañana */}
      <DoseSection
        title="Mañana"
        variant="morning"
        icon={<Sun className="w-5 h-5" />}
      >
        <DoseCard
          time="09:00 AM"
          medicine="Paracetamol 500mg"
          instruction="1 pastilla con comida"
          status="pending"
          variant="default"
        />
      </DoseSection>

      {/* Tarde */}
      <DoseSection
        title="Tarde"
        variant="afternoon"
        icon={<Sunset className="w-5 h-5" />}
      >
        <DoseCard
          time="03:00 PM"
          medicine="Ibuprofeno 400mg"
          instruction="1 pastilla con comida"
          status="pending"
          variant="default"
        />
      </DoseSection>

      {/* Example Completed Item from HTML (bottom list check) */}
      <div className="px-4">
        <DoseCard
          time="09:00 AM"
          medicine="Loratadina 10mg"
          instruction="1 pastilla"
          status="taken"
          variant="default"
          showActions={false}
        />
      </div>
    </div>
  );
}
