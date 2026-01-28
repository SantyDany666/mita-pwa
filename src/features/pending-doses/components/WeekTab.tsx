import { DoseCard } from "./DoseCard";
import { DoseSection } from "./DoseSection";
import { Sun, Moon, Sunset } from "lucide-react";

export function WeekTab() {
  const days = [
    { name: "Lun", num: "12", active: false },
    { name: "Mar", num: "13", active: false },
    { name: "Mié", num: "14", active: true },
    { name: "Jue", num: "15", active: false },
    { name: "Vie", num: "16", active: false },
    { name: "Sáb", num: "17", active: false },
    { name: "Dom", num: "18", active: false },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Calendar Strip */}
      <div className="flex overflow-x-auto px-4 py-2 gap-3 hide-scrollbar">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center min-w-[50px] h-20 rounded-2xl border ${
              day.active
                ? "bg-[#054A91] border-[#054A91] text-white shadow-md"
                : "bg-[#F7F9FC] dark:bg-gray-800 border-gray-100 dark:border-gray-700"
            }`}
          >
            <span
              className={`text-[10px] font-medium uppercase ${day.active ? "text-white/70" : "text-gray-400 dark:text-gray-500"}`}
            >
              {day.name}
            </span>
            <span
              className={`text-base font-bold ${day.active ? "" : "text-gray-700 dark:text-gray-200"}`}
            >
              {day.num}
            </span>
            {day.active && (
              <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
            )}
          </div>
        ))}
      </div>

      {/* Mañana */}
      <DoseSection
        title="Mañana"
        variant="morning"
        icon={<Sun className="w-5 h-5" />}
      >
        <DoseCard
          time="08:00 AM"
          medicine="Omeprazol 20mg"
          instruction="1 cápsula en ayunas"
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
          time="02:00 PM"
          medicine="Multivitamínico"
          instruction="1 tableta con el almuerzo"
          status="pending"
          variant="default"
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
          instruction="1 cápsula antes de dormir"
          status="pending"
          variant="default"
        />
      </DoseSection>
    </div>
  );
}
