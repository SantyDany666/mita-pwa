import {
  CalendarClock,
  Repeat,
  CalendarRange,
  Package,
  ChevronRight,
} from "lucide-react";
import { Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { FrequencySelectionDrawer } from "./FrequencySelectionDrawer";
import { getFrequencyLabel } from "../utils/frequency-utils";
import { getDurationLabel } from "../utils/duration-utils";
import { DurationSelectionDrawer } from "./DurationSelectionDrawer";
import { InventorySelectionDrawer } from "./InventorySelectionDrawer";
import { getUnitsForIcon } from "../utils/unit-utils";
import { MedicineIconSelector } from "./MedicineIconSelector";
import { AppHeader } from "@/components/ui/AppHeader";
import { StartSelectionDrawer } from "./StartSelectionDrawer";
import { getSmartDateLabel } from "../utils/date-utils";
import { useReminderForm } from "../hooks/useReminderForm";
import { ReminderFormValues } from "../utils/validation";
import { useProfileStore } from "@/store/profile.store";
import { useAuthStore } from "@/store/auth.store";
import { useReminderMutations } from "../hooks/useReminderMutations";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface ReminderFormProps {
  initialValues?: Partial<ReminderFormValues>;
  mode: "create" | "edit";
  onSubmit?: (data: ReminderFormValues) => void;
  reminderId?: string;
}

export function ReminderForm({
  initialValues,
  mode,
  onSubmit, // Optional prop if parent wants to handle it, but we handle it here mostly
  reminderId,
}: ReminderFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useReminderForm({ initialValues });

  const watchedStartDate = useWatch({ control, name: "startDate" });
  const watchedDoseLogs = useWatch({ control, name: "doseLogs" });
  const watchedFrequency = useWatch({ control, name: "frequency" });
  const watchedMedicineIcon = useWatch({ control, name: "medicineIcon" });
  const watchedUnit = useWatch({ control, name: "unit" });

  const availableUnits = useMemo(
    () => getUnitsForIcon(watchedMedicineIcon),
    [watchedMedicineIcon],
  );

  useEffect(() => {
    const isValid = availableUnits.some((u) => u.value === watchedUnit);
    if (!isValid && availableUnits.length > 0) {
      setValue("unit", availableUnits[0].value);
    }
  }, [watchedMedicineIcon, availableUnits, watchedUnit, setValue]);

  const { currentProfile } = useProfileStore();
  const { user } = useAuthStore();

  const { createReminder, updateReminder } = useReminderMutations();
  const isPending = createReminder.isPending || updateReminder.isPending;

  const handleFormSubmit = async (data: ReminderFormValues) => {
    if (!user || !currentProfile) {
      toast.error("Error de sesión: No se encontró usuario o perfil activo.");
      return;
    }

    try {
      if (mode === "create") {
        createReminder.mutate(data, {
          onSuccess: () => onSubmit?.(data),
        });
      } else {
        if (!reminderId) {
          toast.error("Error: ID de recordatorio no encontrado");
          return;
        }
        updateReminder.mutate(
          { id: reminderId, data },
          {
            onSuccess: () => onSubmit?.(data),
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-[#F7F9FC] dark:bg-gray-950 font-sans">
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        {/* Sticky Header */}
        <AppHeader
          title={
            mode === "create" ? "Nuevo Recordatorio" : "Editar Recordatorio"
          }
          className="border-none shadow-none bg-[#F7F9FC] dark:bg-gray-950 pt-[max(1rem,env(safe-area-inset-top))] pb-2"
          titleClassName="text-[#054A91] dark:text-white"
        />

        <main className="flex-grow px-4 py-4 space-y-6 overflow-y-auto">
          {/* Section 1: Medicine Details */}
          <section className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="text-[#054A91] dark:text-[#81A4CD] font-semibold text-lg">
              Detalles del Medicamento
            </h2>

            <Controller
              control={control}
              name="medicineIcon"
              render={({ field }) => (
                <MedicineIconSelector
                  selected={field.value}
                  onSelect={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre"
                  placeholder="Ej: Ibuprofeno"
                  error={errors.name?.message}
                />
              )}
            />

            <div className="flex w-full gap-4">
              <div className="flex-1">
                <Controller
                  control={control}
                  name="dose"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Dosis"
                      placeholder="500"
                      error={errors.dose?.message}
                    />
                  )}
                />
              </div>
              <div className="flex-1">
                <Controller
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Unidad"
                      error={errors.unit?.message}
                    >
                      {availableUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Frequency & Duration */}
          <section className="flex flex-col gap-px overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            {/* Start Date Item */}
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <StartSelectionDrawer
                  value={field.value}
                  onSelect={field.onChange}
                >
                  <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 min-h-[72px] py-2 justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-lg bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                        <CalendarClock className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                          Inicio
                        </p>
                        <p className="text-[#00B8A5] text-sm font-normal leading-normal line-clamp-2 capitalize">
                          {getSmartDateLabel(field.value)}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="text-[#00B8A5] flex size-7 items-center justify-center">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </StartSelectionDrawer>
              )}
            />

            <hr className="border-t border-slate-100 dark:border-gray-800 mx-4" />

            {/* Frequency Item */}
            <Controller
              control={control}
              name="frequency"
              render={({ field: frequencyField }) => (
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field: startTimeField }) => (
                    <FrequencySelectionDrawer
                      value={frequencyField.value}
                      timeValue={startTimeField.value}
                      startDate={watchedStartDate}
                      doseLogs={watchedDoseLogs}
                      onSelect={(freq, time, logs) => {
                        frequencyField.onChange(freq);
                        if (time) startTimeField.onChange(time);

                        if (logs) {
                          setValue("doseLogs", logs);
                        }
                      }}
                    >
                      <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 min-h-[72px] py-2 justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-lg bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                            <Repeat className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                              Frecuencia
                            </p>
                            <p className="text-[#00B8A5] text-sm font-normal leading-normal line-clamp-2">
                              {getFrequencyLabel(frequencyField.value)}
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
                  )}
                />
              )}
            />

            <hr className="border-t border-slate-100 dark:border-gray-800 mx-4" />

            {/* Duration Item */}
            <Controller
              control={control}
              name="duration"
              render={({ field }) => (
                <DurationSelectionDrawer
                  value={field.value}
                  onSelect={field.onChange}
                  frequency={watchedFrequency || ""}
                  startDate={watchedStartDate}
                >
                  <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 min-h-[72px] py-2 justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-lg bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                        <CalendarRange className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                          Duración
                        </p>
                        <p className="text-[#00B8A5] text-sm font-normal leading-normal line-clamp-2">
                          {getDurationLabel(field.value)}
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
              )}
            />

            <hr className="border-t border-slate-100 dark:border-gray-800 mx-4" />

            {/* Inventory Item */}
            <Controller
              control={control}
              name="inventory"
              render={({ field }) => (
                <InventorySelectionDrawer
                  value={field.value}
                  onSave={field.onChange}
                >
                  <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 min-h-[72px] py-2 justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-lg bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                          Inventario{" "}
                          <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-1">
                            (Opcional)
                          </span>
                        </p>
                        <p className="text-[#00B8A5] text-sm font-normal leading-normal line-clamp-2">
                          {field.value.stock > 0
                            ? `${field.value.stock} unidades`
                            : "Sin control de stock"}
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
              )}
            />
          </section>

          {/* Section 3: Indications */}
          <section className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Controller
              control={control}
              name="indications"
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Indicaciones"
                  optional
                  placeholder="Ej: Tomar con comida, no conducir..."
                />
              )}
            />
          </section>
        </main>

        {/* Sticky Footer */}
        <footer className="sticky bottom-0 bg-transparent px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] w-full max-w-md mx-auto relative pointer-events-none">
          <button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={!isValid || isSubmitting || isPending}
            className="w-full bg-[#054A91] text-white text-lg font-bold rounded-xl h-14 flex items-center justify-center transition-all hover:bg-[#054A91]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#054A91]/20 pointer-events-auto"
          >
            {isPending ? "Guardando..." : "Guardar Recordatorio"}
          </button>
        </footer>
      </div>
    </div>
  );
}
