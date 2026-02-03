import { z } from "zod";

export const reminderSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  dose: z.string().min(1, "La dosis es obligatoria"), // Keeping as string to allow "1/2", "1.5", etc. or parsed later.
  unit: z.string().min(1, "La unidad es obligatoria"),
  medicineIcon: z.enum([
    "capsule",
    "tablet",
    "syrup",
    "injection",
    "drops",
    "inhaler",
    "cream",
    "powder",
    "other",
  ]),

  // Frequency & Timing
  frequency: z.string().min(1, "La frecuencia es obligatoria"),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
  startDate: z.string().min(1, "Fecha inválida"),

  // Duration
  duration: z.string().min(1, "La duración es obligatoria"),

  // Inventory (Optional)
  inventory: z.object({
    stock: z.number().min(0),
    stockAlertEnabled: z.boolean(),
    stockThreshold: z.number().min(0),
  }),

  // Additional
  indications: z.string().optional(),

  // History/Logs for past doses (when creating from a past start time)
  doseLogs: z.record(z.enum(["taken", "skipped"])).optional(),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
