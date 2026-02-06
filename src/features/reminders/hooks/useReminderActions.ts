import { useNavigate } from "@tanstack/react-router";
import { reminderSchedulerService } from "../services/reminder-scheduler.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useReminderActions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const pauseReminder = async (id: string) => {
    try {
      await reminderSchedulerService.pauseReminder(id);
      toast.success("Recordatorio pausado");
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
    } catch (error) {
      console.error(error);
      toast.error("Error al pausar el recordatorio");
    }
  };

  const resumeReminder = async (id: string) => {
    try {
      await reminderSchedulerService.resumeReminder(id);
      toast.success("Recordatorio reanudado");
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
    } catch (error) {
      console.error(error);
      toast.error("Error al reanudar el recordatorio");
    }
  };

  const finishReminder = async (id: string) => {
    try {
      await reminderSchedulerService.finishReminder(id);
      toast.success("Recordatorio finalizado");
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
    } catch (error) {
      console.error(error);
      toast.error("Error al finalizar el recordatorio");
    }
  };

  const reactivateReminder = async (id: string) => {
    try {
      await reminderSchedulerService.resumeReminder(id);
      toast.success("Recordatorio reactivado");
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
    } catch (error) {
      console.error(error);
      toast.error("Error al reactivar el recordatorio");
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await reminderSchedulerService.deleteReminder(id);
      toast.success("Recordatorio eliminado");
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
      navigate({ to: "/reminders" });
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el recordatorio");
    }
  };

  return {
    pauseReminder,
    resumeReminder,
    finishReminder,
    reactivateReminder,
    deleteReminder,
  };
};
