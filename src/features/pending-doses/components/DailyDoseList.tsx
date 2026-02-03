import { DoseCard } from "./DoseCard";
import { DoseSection } from "./DoseSection";
import { Sun, Sunset, AlertCircle, CheckCircle, Moon } from "lucide-react";

export function DailyDoseList() {
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <DoseSection
        title="Vencidas"
        variant="overdue"
        icon={<AlertCircle className="w-5 h-5" />}
      >
        <DoseCard
          time="AYER - 09:00 PM"
          medicine="Vitamina D3 1000UI"
          status="pending"
          variant="overdue"
          icon="capsule"
        />
      </DoseSection>

      {/* Mañana */}
      <DoseSection
        title="Mañana"
        variant="morning"
        icon={<Sun className="w-5 h-5" />}
      >
        <DoseCard
          time="08:00 AM"
          medicine="Omeprazol 20mg"
          status="pending"
          variant="default"
          icon="capsule"
        />
        <DoseCard
          time="09:00 AM"
          medicine="Paracetamol 500mg"
          status="pending"
          variant="default"
          icon="tablet"
        />
      </DoseSection>

      {/* Tarde */}
      <DoseSection
        title="Tarde"
        variant="afternoon"
        icon={<Sunset className="w-5 h-5" />}
      >
        <DoseCard
          time="02:00 PM"
          medicine="Multivitamínico"
          status="pending"
          variant="default"
          icon="tablet"
        />
        <DoseCard
          time="03:00 PM"
          medicine="Ibuprofeno 400mg"
          status="pending"
          variant="default"
          icon="tablet"
        />
      </DoseSection>

      {/* Noche */}
      <DoseSection
        title="Noche"
        variant="night"
        icon={<Moon className="w-5 h-5" />}
      >
        <DoseCard
          time="10:00 PM"
          medicine="Magnesio 400mg"
          status="pending"
          variant="default"
          icon="capsule"
        />
      </DoseSection>

      {/* Completadas Section */}
      <DoseSection
        title="Completadas"
        variant="completed"
        icon={<CheckCircle className="w-5 h-5" />}
      >
        <DoseCard
          time="09:00 AM"
          medicine="Loratadina 10mg"
          status="taken"
          variant="default"
          showActions={false}
          icon="tablet"
          takenTime="09:12 AM"
        />
      </DoseSection>
    </div>
  );
}
