import { z } from "zod";

export const symptomEntrySchema = z.object({
  symptom: z.string().min(1, "Por favor selecciona o escribe un síntoma"),
  intensity: z.number().min(1, "Por favor selecciona la intensidad").max(5),
  note: z.string().max(500, "La nota no puede exceder los 500 caracteres").optional(),
});

export type SymptomEntryValues = z.infer<typeof symptomEntrySchema>;
