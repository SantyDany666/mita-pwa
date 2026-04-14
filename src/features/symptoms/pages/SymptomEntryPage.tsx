import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { symptomEntrySchema, SymptomEntryValues } from "../utils/validation";
import { SymptomSelector } from "../components/SymptomSelector";
import { IntensitySelector } from "../components/IntensitySelector";
import { Textarea } from "@/components/ui/textarea";
import { useSymptomMutations } from "../hooks/useSymptomMutations";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";

export function SymptomEntryPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const { logSymptom, isLogging } = useSymptomMutations();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SymptomEntryValues>({
    resolver: zodResolver(symptomEntrySchema),
    defaultValues: {
      symptom: "",
      intensity: 0,
      note: "",
    },
  });

  const onSubmit = async (data: SymptomEntryValues) => {
    if (!user || !currentProfile) {
      toast.error("Error: No hay sesión activa o perfil seleccionado");
      return;
    }

    try {
      await logSymptom({
        userId: user.id,
        profileId: currentProfile.id,
        symptom: data.symptom,
        intensity: data.intensity,
        note: data.note,
      });

      toast.success("Síntoma registrado correctamente");
      navigate({ to: "/pending-doses", search: { view: "today" } });
    } catch {
      toast.error("Hubo un error al registrar el síntoma");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-950 flex flex-col font-sans">
      <AppHeader
        title="Registrar Síntoma"
        className="border-none shadow-none bg-[#F7F9FC] dark:bg-gray-950 pt-[max(1rem,env(safe-area-inset-top))] pb-2"
        titleClassName="text-[#054A91] dark:text-white"
        onBack={() => window.history.back()}
      />

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm italic px-6">
              "Registrar tus síntomas nos ayuda a entender mejor tu evolución
              diaria."
            </p>
          </div>

          {/* Symptom Selector Card */}
          <section className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <Controller
              name="symptom"
              control={control}
              render={({ field }) => (
                <SymptomSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.symptom?.message}
                />
              )}
            />
          </section>

          <section className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <Controller
              name="intensity"
              control={control}
              render={({ field }) => (
                <IntensitySelector
                  {...field}
                  label="Intensidad"
                  error={errors.intensity?.message}
                />
              )}
            />
          </section>

          {/* Note Card */}
          <section className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Notas o detalles"
                  optional
                  placeholder="Ej: Empezó después de almorzar, es un dolor punzante..."
                  className="min-h-[120px]"
                  error={errors.note?.message}
                />
              )}
            />
          </section>
        </div>
      </main>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F7F9FC] via-[#F7F9FC] to-transparent dark:from-gray-950 dark:via-gray-950 pb-[max(1rem,env(safe-area-inset-bottom))] flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLogging}
            className="w-full h-14 bg-[#054A91] hover:bg-[#043c75] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#054A91]/20 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {isLogging ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
