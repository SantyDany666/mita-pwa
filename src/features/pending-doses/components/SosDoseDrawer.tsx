import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "@/features/reminders/services/reminder.service";
import { doseService } from "@/features/reminders/services/dose.service";
import { MedicineIconDisplay } from "@/features/reminders/components/MedicineIconDisplay";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SosDoseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SosDoseDrawer({ open, onOpenChange }: SosDoseDrawerProps) {
  const { currentProfile } = useProfileStore();
  const queryClient = useQueryClient();
  const [takingId, setTakingId] = useState<string | null>(null);

  // Fetch SOS Reminders
  const { data: sosReminders, isLoading } = useQuery({
    queryKey: ["sos-reminders", currentProfile?.id],
    queryFn: async () => {
      if (!currentProfile) return [];
      return reminderService.getSosReminders(currentProfile.id);
    },
    enabled: !!currentProfile && open,
  });

  // Take Dose Mutation
  const takeSosMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      if (!currentProfile) throw new Error("No profile");
      setTakingId(reminderId);
      await doseService.createSosDose(reminderId, currentProfile.id);
    },
    onSuccess: () => {
      // Invalidate doses so the main list updates (if we show SOS history there)
      // Also invalidate reminders if stock changed
      queryClient.invalidateQueries({ queryKey: ["doses"] });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Dosis registrada correctamente");
      setTakingId(null);
      onOpenChange(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al registrar la dosis");
      setTakingId(null);
    },
  });

  const handleTake = (reminderId: string) => {
    takeSosMutation.mutate(reminderId);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-[#054A91] dark:text-[#81A4CD] text-xl font-bold">
              Botiquín (SOS)
            </DrawerTitle>
            <DrawerDescription className="text-center text-gray-500">
              Registra una toma rápida de tus medicamentos "Solo si es
              necesario".
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : sosReminders && sosReminders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {sosReminders.map((reminder) => (
                  <button
                    key={reminder.id}
                    onClick={() => handleTake(reminder.id)}
                    disabled={takingId === reminder.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-200 dark:hover:border-teal-700 transition-all group text-left"
                  >
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-[#054A91] dark:text-[#81A4CD] group-hover:scale-110 transition-transform">
                      <MedicineIconDisplay
                        type={reminder.medicine_icon as MedicineIconType}
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                        {reminder.medicine_name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {reminder.dose} {reminder.unit || ""}
                      </p>
                    </div>
                    {takingId === reminder.id ? (
                      <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-gray-300 group-hover:text-teal-500" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No tienes medicamentos configurados como SOS.</p>
                <p className="text-sm mt-2">
                  Agrega uno nuevo con frecuencia "Solo si es necesario".
                </p>
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full text-gray-500">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
