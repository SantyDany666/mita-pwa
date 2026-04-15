import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { moodEntrySchema, MoodEntryValues } from "../utils/validation";
import { MoodSelector } from "../components/MoodSelector";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { useMoodMutations } from "../hooks/useMoodMutations";
import { useMoodActions } from "../hooks/useMoodActions";

interface MoodEntryPageProps {
  mode?: "create" | "edit";
  moodId?: string;
  initialValues?: Partial<MoodEntryValues>;
}

export function MoodEntryPage({
  mode = "create",
  moodId = "",
  initialValues,
}: MoodEntryPageProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const { logMood } = useMoodMutations();
  const { updateMood, isUpdating } = useMoodActions(moodId);

  const isEditMode = mode === "edit";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MoodEntryValues>({
    resolver: zodResolver(moodEntrySchema),
    defaultValues: {
      mood: initialValues?.mood ?? 0,
      note: initialValues?.note ?? "",
    },
  });

  const isSaving = isSubmitting || isUpdating;

  const onSubmit = async (data: MoodEntryValues) => {
    try {
      if (isEditMode) {
        await updateMood({ moodValue: data.mood, note: data.note });
        toast.success("Estado de ánimo actualizado correctamente");
        navigate({ to: "/mood/$moodId", params: { moodId } });
      } else {
        if (!user || !currentProfile) {
          toast.error("Error: Perfil no encontrado");
          return;
        }
        await logMood({
          userId: user.id,
          profileId: currentProfile.id,
          moodValue: data.mood,
          note: data.note,
        });
        toast.success("Estado de ánimo registrado correctamente");
        navigate({ to: "/pending-doses", search: { view: "today" } });
      }
    } catch (error) {
      toast.error(isEditMode ? "Error al actualizar el estado de ánimo." : "Ocurrió un error al guardar tu estado de ánimo.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-950 flex flex-col font-sans">
      <AppHeader
        title={isEditMode ? "Editar Estado de Ánimo" : "¿Cómo te sientes hoy?"}
        className="border-none shadow-none bg-[#F7F9FC] dark:bg-gray-950 pt-[max(1rem,env(safe-area-inset-top))] pb-2"
        titleClassName="text-[#054A91] dark:text-white"
        onBack={() => window.history.back()}
      />

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <div className="max-w-md mx-auto space-y-10">
          {!isEditMode && (
            <div className="text-center space-y-2">
              <p className="text-gray-500 dark:text-gray-400 text-base italic px-6">
                "Tu salud mental es igual de importante que tu medicación."
              </p>
            </div>
          )}

          {/* Mood Selector Section */}
          <section className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Controller
              name="mood"
              control={control}
              render={({ field }) => (
                <MoodSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.mood?.message}
                />
              )}
            />
          </section>

          {/* Note Section */}
          <section className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Añadir una nota"
                  optional
                  placeholder="Escribe aquí cómo te sientes o cualquier detalle importante de hoy..."
                  className="min-h-[140px]"
                />
              )}
            />
            {errors.note && (
              <p className="px-2 mt-2 text-xs text-red-500 font-medium">
                {errors.note.message}
              </p>
            )}
          </section>
        </div>
      </main>

      {/* Floating Action Button area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F7F9FC] via-[#F7F9FC] to-transparent dark:from-gray-950 dark:via-gray-950 pb-[max(1rem,env(safe-area-inset-bottom))] flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="w-full h-14 bg-[#054A91] hover:bg-[#043c75] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#054A91]/20 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {isSaving ? "Guardando..." : isEditMode ? "Guardar Cambios" : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
