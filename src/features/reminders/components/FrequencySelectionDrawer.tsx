import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { FrequencyMode } from "../utils/frequency-utils";
import { FrequencyMenu } from "./frequency/FrequencyMenu";
import { DailyConfig } from "./frequency/DailyConfig";
import { WeekdaysConfig } from "./frequency/WeekdaysConfig";
import { CyclicConfig } from "./frequency/CyclicConfig";
import { SosConfig } from "./frequency/SosConfig";

interface FrequencySelectionDrawerProps {
  value?: string;
  timeValue?: string;
  startDate?: string;
  doseLogs?: Record<string, "taken" | "skipped" | undefined>;
  onSelect: (
    value: string,
    time?: string,
    logs?: Record<string, "taken" | "skipped" | undefined>,
  ) => void;
  children: React.ReactNode;
}

export function FrequencySelectionDrawer({
  value = "",
  timeValue = "08:00",
  startDate,
  doseLogs,
  onSelect,
  children,
}: FrequencySelectionDrawerProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"menu" | "config">("menu");
  const [mode, setMode] = useState<FrequencyMode>("daily");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset to menu if no value, or hydrate if exists
      if (!value) {
        setStep("menu");
        setMode("daily"); // Default
      } else {
        setStep("config");
        if (value === "sos") setMode("sos");
        else if (value.startsWith("cycle:")) setMode("cyclic");
        else if (value.startsWith("days:")) setMode("weekdays");
        else setMode("daily");
      }
    }
  };

  const handleModeSelect = (selectedMode: FrequencyMode) => {
    setMode(selectedMode);
    setStep("config");
  };

  const handleBack = () => {
    setStep("menu");
  };

  const handleConfirm = (
    finalValue: string,
    finalTime?: string,
    logs?: Record<string, "taken" | "skipped" | undefined>,
  ) => {
    onSelect(finalValue, finalTime, logs);
    setOpen(false);
  };

  // -- PARSING HELPERS --
  const getDailyInitial = () => {
    if (mode === "daily" && value?.endsWith("h") && !value.includes("days"))
      return value;
    return "8h";
  };

  const getWeekdaysInitial = () => {
    if (mode === "weekdays" && value?.startsWith("days:")) {
      return value.replace("days:", "").split(",");
    }
    return [];
  };

  const getCyclicInitial = () => {
    if (mode === "cyclic" && value?.startsWith("cycle:")) {
      const match = value
        .replace("cycle:", "")
        .match(/^(\d+)(days|weeks|months)$/);
      if (match) {
        return {
          value: match[1],
          unit: match[2] as "days" | "weeks" | "months",
        };
      }
    }
    return { value: "2", unit: "days" as const };
  };

  const cyclicData = getCyclicInitial();

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-sm flex flex-col flex-1 overflow-hidden">
          {/* HEADER */}
          <DrawerHeader className="pb-0 shrink-0 relative">
            {step === "config" && (
              <button
                onClick={handleBack}
                className="absolute left-8 top-5 p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-50 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <DrawerTitle className="text-center text-lg font-bold text-[#054A91] dark:text-[#81A4CD] pt-2">
              {step === "menu"
                ? "¿Con qué frecuencia?"
                : mode === "daily"
                  ? "Frecuencia Diaria"
                  : mode === "weekdays"
                    ? "Días Específicos"
                    : mode === "cyclic"
                      ? "Intervalos"
                      : "Solo si es necesario"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4 pt-6">
            {/* === STEP 1: MENU === */}
            {step === "menu" && (
              <>
                <FrequencyMenu onSelect={handleModeSelect} />
                <div className="mt-4">
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full h-12 rounded-xl text-slate-500 dark:text-gray-400"
                    >
                      Cancelar
                    </Button>
                  </DrawerClose>
                </div>
              </>
            )}

            {/* === STEP 2: CONFIG === */}
            {step === "config" && (
              <>
                {mode === "daily" && (
                  <DailyConfig
                    onConfirm={handleConfirm}
                    initialInterval={getDailyInitial()}
                    initialTime={timeValue}
                    startDate={startDate}
                    initialLogs={doseLogs}
                  />
                )}
                {mode === "weekdays" && (
                  <WeekdaysConfig
                    onConfirm={handleConfirm}
                    initialDays={getWeekdaysInitial()}
                    initialTime={timeValue}
                  />
                )}
                {mode === "cyclic" && (
                  <CyclicConfig
                    onConfirm={handleConfirm}
                    initialValue={cyclicData.value}
                    initialUnit={cyclicData.unit}
                    initialTime={timeValue}
                    startDate={startDate}
                  />
                )}
                {mode === "sos" && (
                  <SosConfig onConfirm={() => handleConfirm("sos")} />
                )}
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
