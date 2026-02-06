import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { reminderSchema, type ReminderFormValues } from "../utils/validation";
import { getTodayString } from "../utils/date-utils";

interface UseReminderFormProps {
  initialValues?: Partial<ReminderFormValues>;
}

export function useReminderForm({ initialValues }: UseReminderFormProps = {}) {
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      name: "",
      dose: "",
      unit: "mg",
      medicineIcon: "capsule",
      frequency: "",
      startTime: "08:00",
      startDate: getTodayString(),
      duration: "",
      inventory: {
        stock: 0,
        stockAlertEnabled: false,
        stockThreshold: 0,
      },
      indications: "",
      ...initialValues,
    } as unknown as ReminderFormValues,
    mode: "onChange", // Real-time validation
  });

  return form;
}
