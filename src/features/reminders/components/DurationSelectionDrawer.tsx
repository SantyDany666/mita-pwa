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
import { DurationMode } from "../utils/duration-utils";
import { DurationMenu } from "./duration/DurationMenu";
import { FixedDaysConfig } from "./duration/FixedDaysConfig";
import { SpecificDateConfig } from "./duration/SpecificDateConfig";
import { ForeverConfig } from "./duration/ForeverConfig";

interface DurationSelectionDrawerProps {
  value?: string;
  onSelect: (value: string) => void;
  frequency: string;
  startDate?: string;
  children: React.ReactNode;
}

export function DurationSelectionDrawer({
  value = "",
  onSelect,
  frequency,
  startDate,
  children,
}: DurationSelectionDrawerProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"menu" | "config">("menu");
  const [mode, setMode] = useState<DurationMode>("forever");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Hydrate
      if (!value || value === "forever") {
        if (value === "forever") {
          setMode("forever");
          setStep("config");
        } else {
          setStep("menu");
          setMode("forever");
        }
      } else {
        setStep("config");
        if (value.startsWith("days:")) setMode("days");
        else if (value.startsWith("date:")) setMode("date");
      }
    }
  };

  const handleModeSelect = (selectedMode: DurationMode) => {
    setMode(selectedMode);
    setStep("config");
  };

  const handleBack = () => {
    setStep("menu");
  };

  const handleConfirm = (finalValue: string) => {
    onSelect(finalValue);
    setOpen(false);
  };

  // Parsing Helpers
  const getDaysInitial = () => {
    if (mode === "days" && value && value.startsWith("days:")) {
      return value.replace("days:", "");
    }
    return "5";
  };

  const getDateInitial = () => {
    if (mode === "date" && value && value.startsWith("date:")) {
      return value.replace("date:", "");
    }
    return "";
  };

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
                ? "¿Duración del tratamiento?"
                : mode === "forever"
                  ? "Sin fecha de fin"
                  : mode === "days"
                    ? "Número de días"
                    : "Hasta una fecha"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4 pt-6">
            {/* === STEP 1: MENU === */}
            {step === "menu" && (
              <>
                <DurationMenu onSelect={handleModeSelect} />
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
                {mode === "forever" && (
                  <ForeverConfig onConfirm={() => handleConfirm("forever")} />
                )}
                {mode === "days" && (
                  <FixedDaysConfig
                    onConfirm={handleConfirm}
                    frequency={frequency}
                    initialValue={getDaysInitial()}
                    startDate={startDate}
                  />
                )}
                {mode === "date" && (
                  <SpecificDateConfig
                    onConfirm={handleConfirm}
                    frequency={frequency}
                    initialValue={getDateInitial()}
                    startDate={startDate}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
