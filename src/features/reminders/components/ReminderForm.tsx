import {
  CalendarClock,
  Repeat,
  CalendarRange,
  Package,
  ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FrequencySelectionDrawer } from "./FrequencySelectionDrawer";
import { getFrequencyLabel } from "../utils/frequency-utils";
import { getDurationLabel, calculateEndDate } from "../utils/duration-utils";
import { DurationSelectionDrawer } from "./DurationSelectionDrawer";
import { InventorySelectionDrawer } from "./InventorySelectionDrawer";
import { MedicineIconSelector } from "./MedicineIconSelector";
import { AppHeader } from "@/components/ui/AppHeader";
import { StartSelectionDrawer } from "./StartSelectionDrawer";
import { getSmartDateLabel } from "../utils/date-utils";
import { useReminderForm } from "../hooks/useReminderForm";
import { ReminderFormValues } from "../utils/validation";
import { useProfileStore } from "@/store/profile.store";
import { useAuthStore } from "@/store/auth.store";
import { reminderSchedulerService } from "../services/reminder-scheduler.service";

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

  const queryClient = useQueryClient();
  const watchedStartDate = useWatch({ control, name: "startDate" });
  const watchedDoseLogs = useWatch({ control, name: "doseLogs" });
  const { currentProfile } = useProfileStore();
  const { user } = useAuthStore();

  const handleFormSubmit = async (data: ReminderFormValues) => {
    if (!user || !currentProfile) {
      toast.error("Error de sesión: No se encontró usuario o perfil activo.");
      return;
    }

    try {
      const endDate = calculateEndDate(data.startDate, data.duration);
      const endDateIso = endDate ? endDate.toISOString() : null;

      if (mode === "create") {
        await reminderSchedulerService.createReminder(
          {
            user_id: user.id,
            profile_id: currentProfile.id,
            medicine_name: data.name,
            dose: data.dose,
            unit: data.unit,
            medicine_icon: data.medicineIcon,
            schedule_config: {
              frequency: data.frequency,
              duration: data.duration,
              startTime: data.startTime,
              startDate: data.startDate,
            },
            start_date: data.startDate,
            end_date: endDateIso,
            status: "active",
            stock_config: data.inventory,
            indications: data.indications,
          },
          data.doseLogs,
        );

        await queryClient.invalidateQueries({ queryKey: ["reminders"] });
        toast.success("Recordatorio creado con éxito");
        window.history.back();
      } else {
        if (!reminderId) {
          toast.error("Error: ID de recordatorio no encontrado");
          return;
        }

        await reminderSchedulerService.updateReminder(reminderId, {
          medicine_name: data.name,
          dose: data.dose,
          unit: data.unit,
          medicine_icon: data.medicineIcon,
          schedule_config: {
            frequency: data.frequency,
            duration: data.duration,
            startTime: data.startTime,
            startDate: data.startDate,
          },
          start_date: data.startDate,
          end_date: endDateIso,
          stock_config: data.inventory,
          indications: data.indications,
        });

        await queryClient.invalidateQueries({ queryKey: ["reminders"] });
        toast.success("Recordatorio actualizado");
        window.history.back();
      }

      onSubmit?.(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el recordatorio");
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-[#F7F9FC] dark:bg-gray-950 font-sans">
      {/* Sticky Header */}
      <AppHeader
        title={mode === "create" ? "Nuevo Recordatorio" : "Editar Recordatorio"}
        className="border-gray-100 dark:border-gray-800 shadow-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
        titleClassName="text-[#054A91] dark:text-white"
        rightAction={
          <button onClick={() => window.history.back()} type="button">
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

          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Nombre
            </p>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border ${errors.name ? "border-red-500" : "border-slate-200 dark:border-gray-700"} bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-all`}
                  placeholder="Ej: Ibuprofeno"
                />
              )}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </span>
            )}
          </label>

          <div className="flex w-full gap-4">
            <label className="flex flex-col min-w-0 flex-1">
              <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Dosis
              </p>
              <Controller
                control={control}
                name="dose"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border ${errors.dose ? "border-red-500" : "border-slate-200 dark:border-gray-700"} bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-all`}
                    placeholder="500"
                  />
                )}
              />
            </label>
            <label className="flex flex-col min-w-0 flex-1">
              <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                Unidad
              </p>
              <div className="relative">
                <Controller
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="appearance-none w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-14 p-[15px] text-base font-normal leading-normal transition-all pr-10"
                    >
                      <option value="mg">mg</option>
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                      <option value="mcg">mcg</option>
                      <option value="oz">oz</option>
                      <option value="units">unidades</option>
                    </select>
                  )}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#00B8A5]">
                  <ChevronRight className="rotate-90 w-5 h-5" />
                </div>
              </div>
            </label>
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
            render={({ field, formState }) => (
              <DurationSelectionDrawer
                value={field.value}
                onSelect={field.onChange}
                frequency={formState.defaultValues?.frequency || ""}
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
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Indicaciones{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-1">
                (Opcional)
              </span>
            </p>
            <Controller
              control={control}
              name="indications"
              render={({ field }) => (
                <textarea
                  {...field}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-28 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-all"
                  placeholder="Ej: Tomar con comida, no conducir..."
                />
              )}
            />
          </label>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 bg-[#F7F9FC] dark:bg-gray-950 p-4 pt-2">
        <button
          onClick={handleSubmit(handleFormSubmit)}
          disabled={!isValid || isSubmitting}
          className="w-full bg-[#054A91] text-white text-lg font-bold rounded-xl h-14 flex items-center justify-center transition-all hover:bg-[#054A91]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#054A91]/20"
        >
          {isSubmitting ? "Guardando..." : "Guardar Recordatorio"}
        </button>
      </footer>
    </div>
  );
}
