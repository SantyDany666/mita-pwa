import { z } from "zod"

export const step1Schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  dob: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
      "El formato debe ser DD/MM/AAAA"
    )
    .refine((dateString) => {
      const [day, month, year] = dateString.split("/").map(Number)
      const date = new Date(year, month - 1, day)
      // Validate date is valid and in the past
      return (
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year &&
        date < new Date()
      )
    }, "La fecha debe ser válida y estar en el pasado"),
  gender: z.enum(["male", "female"]),
})

export type Step1Data = z.infer<typeof step1Schema>

export const step2Schema = z.object({
  weight: z
    .string()
    .optional()
    .refine((val) => !val || (Number(val) > 0 && Number(val) < 500), {
      message: "El peso debe ser un número válido mayor a 0 y menor a 500",
    }),
  height: z
    .string()
    .optional()
    .refine((val) => !val || (Number(val) > 0 && Number(val) < 300), {
      message: "La talla debe ser un número válido mayor a 0 y menor a 300",
    }),
})

export type Step2Data = z.infer<typeof step2Schema>

export const step3Schema = z.object({
  allergies: z.string().optional(),
  additionalInfo: z.string().optional(),
})

export type Step3Data = z.infer<typeof step3Schema>

// Combined schema for final submission (if needed)
export const profileSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)

export type ProfileData = z.infer<typeof profileSchema>
