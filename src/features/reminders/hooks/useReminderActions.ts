import { useReminderMutations } from "./useReminderMutations";

export const useReminderActions = () => {
  const { pauseReminder, resumeReminder, finishReminder, deleteReminder } =
    useReminderMutations();

  const handlePause = async (id: string) => {
    return pauseReminder.mutateAsync(id);
  };

  const handleResume = async (id: string) => {
    return resumeReminder.mutateAsync(id);
  };

  const handleFinish = async (id: string) => {
    return finishReminder.mutateAsync(id);
  };

  const handleReactivate = async (id: string) => {
    // Resume serves as reactivate in logic
    return resumeReminder.mutateAsync(id);
  };

  const handleDelete = async (id: string) => {
    return deleteReminder.mutateAsync(id);
  };

  return {
    pauseReminder: handlePause,
    resumeReminder: handleResume,
    finishReminder: handleFinish,
    reactivateReminder: handleReactivate,
    deleteReminder: handleDelete,
  };
};
