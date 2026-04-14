import { z } from "zod";

export const moodEntrySchema = z.object({
  mood: z
    .number({
      error: "Por favor selecciona cómo te sientes",
    })
    .min(1, "Por favor selecciona cómo te sientes")
    .max(5, "Valor inválido"),
  note: z
    .string()
    .max(500, "La nota no puede exceder los 500 caracteres")
    .optional(),
});

export type MoodEntryValues = z.infer<typeof moodEntrySchema>;
