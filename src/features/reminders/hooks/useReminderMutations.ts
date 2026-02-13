import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { reminderSchedulerService } from "../services/reminder-scheduler.service";
import { ReminderFormValues } from "../utils/validation";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { calculateEndDate } from "../utils/duration-utils";
import { useNavigate } from "@tanstack/react-router";

// Helper to invalidate scheduler queries
const invalidateScheduler = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["reminders"] }),
    queryClient.invalidateQueries({ queryKey: ["scheduler-pending-doses"] }),
    // Invalidate dashboard stats if they exist
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
  ]);
};

export const useReminderMutations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProfile } = useProfileStore();

  const createReminder = useMutation({
    mutationFn: async (data: ReminderFormValues) => {
      if (!user || !currentProfile) throw new Error("No authentifcated user");

      const endDate = calculateEndDate(data.startDate, data.duration);
      const endDateIso = endDate ? endDate.toISOString() : null;

      return reminderSchedulerService.createReminder(
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
    },
    onSuccess: async () => {
      toast.success("Recordatorio creado y programado");
      await invalidateScheduler(queryClient);
      window.history.back();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al crear el recordatorio");
    },
  });

  const updateReminder = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ReminderFormValues;
    }) => {
      const endDate = calculateEndDate(data.startDate, data.duration);
      const endDateIso = endDate ? endDate.toISOString() : null;

      return reminderSchedulerService.updateReminder(id, {
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
    },
    onSuccess: async () => {
      toast.success("Recordatorio actualizado");
      await invalidateScheduler(queryClient);
      window.history.back();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al actualizar el recordatorio");
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      return reminderSchedulerService.deleteReminder(id);
    },
    onSuccess: async () => {
      toast.success("Recordatorio eliminado");
      await invalidateScheduler(queryClient);
      navigate({ to: "/reminders" });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al eliminar");
    },
  });

  const pauseReminder = useMutation({
    mutationFn: async (id: string) => {
      return reminderSchedulerService.pauseReminder(id);
    },
    onSuccess: async () => {
      toast.success("Recordatorio pausado");
      await invalidateScheduler(queryClient);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al pausar");
    },
  });

  const resumeReminder = useMutation({
    mutationFn: async (id: string) => {
      return reminderSchedulerService.resumeReminder(id);
    },
    onSuccess: async () => {
      toast.success("Recordatorio reanudado");
      await invalidateScheduler(queryClient);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al reanudar");
    },
  });

  const finishReminder = useMutation({
    mutationFn: async (id: string) => {
      return reminderSchedulerService.finishReminder(id);
    },
    onSuccess: async () => {
      toast.success("Recordatorio finalizado");
      await invalidateScheduler(queryClient);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al finalizar");
    },
  });

  return {
    createReminder,
    updateReminder,
    deleteReminder,
    pauseReminder,
    resumeReminder,
    finishReminder,
  };
};
