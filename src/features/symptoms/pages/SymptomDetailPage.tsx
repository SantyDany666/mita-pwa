import { AppHeader } from "@/components/ui/AppHeader";
import { useNavigate } from "@tanstack/react-router";
import { format, parseISO, differenceInHours } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import {
  Thermometer,
  CalendarDays,
  FileText,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSymptomDetail } from "../hooks/useSymptomDetail";
import { useSymptomActions } from "../hooks/useSymptomActions";

const INTENSITY_DATA = [
  {
    value: 1,
    label: "Muy Leve",
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    cardBg: "bg-emerald-50 dark:bg-emerald-900/10",
    border: "border-emerald-100 dark:border-emerald-800/30",
  },
  {
    value: 2,
    label: "Leve",
    color: "text-yellow-500",
    bg: "bg-yellow-500",
    cardBg: "bg-yellow-50 dark:bg-yellow-900/10",
    border: "border-yellow-100 dark:border-yellow-800/30",
  },
  {
    value: 3,
    label: "Moderado",
    color: "text-orange-500",
    bg: "bg-orange-500",
    cardBg: "bg-orange-50 dark:bg-orange-900/10",
    border: "border-orange-100 dark:border-orange-800/30",
  },
  {
    value: 4,
    label: "Severo",
    color: "text-red-500",
    bg: "bg-red-500",
    cardBg: "bg-red-50 dark:bg-red-900/10",
    border: "border-red-100 dark:border-red-800/30",
  },
  {
    value: 5,
    label: "Muy Severo",
    color: "text-red-700",
    bg: "bg-red-700",
    cardBg: "bg-red-50 dark:bg-red-900/10",
    border: "border-red-100 dark:border-red-800/30",
  },
];

interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmDrawer({
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl p-6 space-y-5 shadow-2xl">
        <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="size-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
            <Trash2 className="size-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            ¿Eliminar registro?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px]">
            Este registro de síntoma será eliminado permanentemente y no se
            puede recuperar.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold text-sm disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

interface SymptomDetailPageProps {
  symptomId: string;
}

export function SymptomDetailPage({ symptomId }: SymptomDetailPageProps) {
  const navigate = useNavigate();
  const { data: symptom, isLoading, error } = useSymptomDetail(symptomId);
  const { deleteSymptom, isDeleting } = useSymptomActions(symptomId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-[#F7F9FC] dark:bg-gray-950">
        <Loader2 className="w-10 h-10 animate-spin text-[#054A91]" />
      </div>
    );
  }

  if (error || !symptom) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center bg-[#F7F9FC] dark:bg-gray-950 p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Registro no encontrado
        </h2>
        <p className="text-gray-500 mt-2 mb-6">
          No pudimos localizar este síntoma.
        </p>
        <button
          onClick={() => navigate({ to: "/summary" })}
          className="bg-[#054A91] text-white px-6 py-3 rounded-xl font-semibold"
        >
          Volver al Resumen
        </button>
      </div>
    );
  }

  const createdAt = parseISO(symptom.created_at!);
  const hoursSince = differenceInHours(new Date(), createdAt);
  const canEdit = hoursSince < 24;
  const intensity =
    INTENSITY_DATA.find((i) => i.value === symptom.intensity) ??
    INTENSITY_DATA[2];

  const handleDelete = async () => {
    try {
      await deleteSymptom();
      toast.success("Registro eliminado");
      navigate({ to: "/summary" });
    } catch {
      toast.error("Error al eliminar el registro");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F7F9FC] dark:bg-gray-950 font-sans pb-32">
      <AppHeader
        title="Detalle de Síntoma"
        className="border-none shadow-none bg-[#F7F9FC] dark:bg-gray-950 pt-[max(1rem,env(safe-area-inset-top))] pb-2"
        titleClassName="text-[#054A91] dark:text-white"
        onBack={() => window.history.back()}
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-5">
        {/* Hero Card */}
        <section className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-center size-20 rounded-2xl mb-4 bg-orange-100/50 dark:bg-orange-900/30 text-orange-500">
            <Thermometer className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
            {symptom.symptom}
          </h1>
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full",
              intensity.bg + "/10",
            )}
          >
            <div className={cn("size-2 rounded-full", intensity.bg)} />
            <span className={cn("text-sm font-bold", intensity.color)}>
              {intensity.label}
            </span>
          </div>
        </section>

        {/* Date */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-slate-50 dark:bg-gray-800 p-3 rounded-xl shrink-0">
              <CalendarDays className="w-6 h-6 text-[#054A91] dark:text-[#81A4CD]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                Registrado el
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {format(createdAt, "hh:mm a")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                {format(createdAt, "EEEE, d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>
          </div>
        </section>

        {/* Note */}
        {symptom.note && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-[#00B8A5]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Nota
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
              "{symptom.note}"
            </p>
          </section>
        )}
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-[#F7F9FC] via-[#F7F9FC]/90 to-transparent dark:from-gray-950 dark:via-gray-950/90 pointer-events-none z-10">
        <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl border-2 border-red-200 dark:border-red-800/50 text-red-500 font-bold text-sm bg-white dark:bg-gray-900 shadow-sm active:scale-[0.98] transition-all"
          >
            <Trash2 className="size-5" />
            Eliminar
          </button>
          {canEdit && (
            <button
              onClick={() =>
                navigate({
                  to: "/symptoms/$symptomId/edit",
                  params: { symptomId },
                })
              }
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#054A91] text-white font-bold text-sm shadow-lg shadow-[#054A91]/20 active:scale-[0.98] transition-all"
            >
              <Pencil className="size-5" />
              Editar
            </button>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmDrawer
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
