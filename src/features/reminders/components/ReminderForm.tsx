import { Calendar, Clock, ChevronRight, Pill } from "lucide-react";
import { useState } from "react";
import { FrequencySelectionDrawer } from "./FrequencySelectionDrawer";
import { getFrequencyLabel } from "../utils/frequency-utils";
import { getDurationLabel } from "../utils/duration-utils";
import { DurationSelectionDrawer } from "./DurationSelectionDrawer";
import { InventorySelectionDrawer } from "./InventorySelectionDrawer";
import { MedicineIconSelector, MedicineIconType } from "./MedicineIconSelector";
import { AppHeader } from "@/components/ui/AppHeader";

interface ReminderFormProps {
  initialValues?: {
    name: string;
    dose: string;
    unit: string;
    route: string;
    frequency: string;
    duration: string;
    indications: string;
  };
  mode: "create" | "edit";
}

export function ReminderForm({ initialValues, mode }: ReminderFormProps) {
  const [frequency, setFrequency] = useState(initialValues?.frequency || "");
  const [duration, setDuration] = useState(initialValues?.duration || "");
  const [medicineIcon, setMedicineIcon] = useState<MedicineIconType>("capsule");
  const [startTime, setStartTime] = useState("08:00");

  // Inventory State
  const [stock, setStock] = useState(0);
  const [stockAlertEnabled, setStockAlertEnabled] = useState(false);
  const [stockThreshold, setStockThreshold] = useState(5);

  const handleFrequencySelect = (freq: string, time?: string) => {
    setFrequency(freq);
    if (time) setStartTime(time);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-[#F7F9FC] dark:bg-gray-950 font-sans">
      {/* Sticky Header */}
      <AppHeader
        title={mode === "create" ? "Nuevo Recordatorio" : "Editar Recordatorio"}
        className="border-gray-100 dark:border-gray-800 shadow-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
        titleClassName="text-[#054A91] dark:text-white"
        rightAction={
          <button onClick={() => window.history.back()}>
            <p className="text-[#00B8A5] text-base font-bold leading-normal tracking-[0.015em] shrink-0">
              Cancelar
            </p>
          </button>
        }
      />

      <main className="flex-grow px-4 py-4 space-y-6 overflow-y-auto">
        {/* Section 1: Medicine Details */}
        <section className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[#054A91] dark:text-[#81A4CD] font-semibold text-lg">
            Detalles del Medicamento
          </h2>

          <MedicineIconSelector
            selected={medicineIcon}
            onSelect={setMedicineIcon}
          />

          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Nombre
            </p>
            <input
              type="text"
              defaultValue={initialValues?.name}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-all"
              placeholder="Ej: Ibuprofeno"
            />
          </label>

          <div className="flex w-full gap-4">
            <label className="flex flex-col min-w-0 flex-1">
              <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Dosis
              </p>
              <input
                type="text"
                defaultValue={initialValues?.dose}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-all"
                placeholder="500"
              />
            </label>
            <label className="flex flex-col min-w-0 flex-1">
              <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Unidad
              </p>
              <div className="relative">
                <select
                  defaultValue={initialValues?.unit || "mg"}
                  className="appearance-none w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-14 p-[15px] text-base font-normal leading-normal transition-all pr-10"
                >
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                  <option value="mcg">mcg</option>
                  <option value="oz">oz</option>
                  <option value="units">unidades</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#00B8A5]">
                  <ChevronRight className="rotate-90 w-5 h-5" />
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Section 2: Frequency & Duration */}
        <section className="flex flex-col gap-px overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {/* Frequency Item */}
          <FrequencySelectionDrawer
            value={frequency}
            timeValue={startTime}
            onSelect={handleFrequencySelect}
          >
            <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 min-h-[72px] py-2 justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-lg bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                    Frecuencia
                  </p>
                  <p className="text-[#00B8A5] text-sm font-normal leading-normal line-clamp-2">
                    {getFrequencyLabel(frequency)}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <div className="text-[#00B8A5] flex size-7 items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </FrequencySelectionDrawer>

          <hr className="border-t border-slate-100 dark:border-gray-800 mx-4" />

          {/* Duration Item */}
          <DurationSelectionDrawer
            value={duration}
            onSelect={setDuration}
            frequency={frequency}
          >
            <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 min-h-[72px] py-2 justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-lg bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                    Duración
                  </p>
                  <p className="text-[#00B8A5] text-sm font-normal leading-normal line-clamp-2">
                    {getDurationLabel(duration)}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <div className="text-[#00B8A5] flex size-7 items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </DurationSelectionDrawer>

          <hr className="border-t border-slate-100 dark:border-gray-800 mx-4" />

          {/* Inventory Item */}
          <InventorySelectionDrawer
            stock={stock}
            alertEnabled={stockAlertEnabled}
            alertThreshold={stockThreshold}
            onSave={(newStock, enabled, threshold) => {
              setStock(newStock);
              setStockAlertEnabled(enabled);
              setStockThreshold(threshold);
            }}
          >
            <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 min-h-[72px] py-2 justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-lg bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                  <Pill className="w-6 h-6" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                    Inventario{" "}
                    <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-1">
                      (Opcional)
                    </span>
                  </p>
                  <p className="text-[#00B8A5] text-sm font-normal leading-normal line-clamp-2">
                    {stock > 0 ? `${stock} unidades` : "Sin control de stock"}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <div className="text-[#00B8A5] flex size-7 items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </InventorySelectionDrawer>
        </section>

        {/* Section 3: Indications */}
        <section className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Indicaciones{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-1">
                (Opcional)
              </span>
            </p>
            <textarea
              defaultValue={initialValues?.indications}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-28 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-all"
              placeholder="Ej: Tomar con comida, no conducir..."
            />
          </label>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 bg-[#F7F9FC] dark:bg-gray-950 p-4 pt-2">
        <button className="w-full bg-[#054A91] text-white text-lg font-bold rounded-xl h-14 flex items-center justify-center transition-all hover:bg-[#054A91]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#054A91]/20">
          Guardar Recordatorio
        </button>
      </footer>
    </div>
  );
}
