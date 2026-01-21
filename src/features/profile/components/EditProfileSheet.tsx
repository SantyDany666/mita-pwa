
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { toast } from "@/store/toast.store"
import { Profile } from "@/features/profile/services/profile.service"
import { ProfileInput } from "@/features/create-profile/components/ProfileInput"
import { GenderSelector } from "@/features/create-profile/components/GenderSelector"
import { DateOfBirthInput } from "@/features/create-profile/components/DateOfBirthInput"
import { ProfileTextarea } from "@/features/create-profile/components/ProfileTextarea"
import { useProfile } from "../hooks/useProfile"
import { Loader2 } from "lucide-react"

import {
  dobSchema,
  weightSchema,
  heightSchema
} from "@/features/profile/schemas/profile-schemas"

// Define Schema using shared validations
const editProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  dob: dobSchema.optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).nullable().optional(),
  weight: weightSchema,
  height: heightSchema,
  allergies: z.string().optional(),
  additional_info: z.string().optional(),
})

type EditProfileFormValues = z.infer<typeof editProfileSchema>

interface EditProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null | undefined
}

export const EditProfileSheet = ({ open, onOpenChange, profile }: EditProfileSheetProps) => {
  const { updateProfile, isUpdating } = useProfile(profile?.user_id)

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      dob: "",
      gender: null,
      weight: "",
      height: "",
      allergies: "",
      additional_info: "",
    },
  })

  // Reset form when profile data changes or sheet opens
  useEffect(() => {
    if (profile && open) {
      // Format DOB for internal input logic if needed, but Profile stores it probably as YYYY-MM-DD
      // DateOfBirthInput expects DD/MM/YYYY. We need to convert.
      let formattedDob = ""
      if (profile.dob) {
        const [year, month, day] = profile.dob.split('-')
        if (year && month && day) {
          formattedDob = `${day}/${month}/${year}`
        }
      }

      form.reset({
        name: profile.name || "",
        dob: formattedDob,
        gender: profile.gender as "male" | "female" | null,
        weight: profile.weight?.toString() || "",
        height: profile.height?.toString() || "",
        allergies: profile.allergies || "",
        additional_info: profile.additional_info || "",
      })
    }
  }, [profile, open, form])

  const dob = useWatch({ control: form.control, name: "dob" });
  const gender = useWatch({ control: form.control, name: "gender" });

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      // Convert DOB back to YYYY-MM-DD
      let apiDob = null
      if (data.dob && data.dob.length === 10) {
        const [day, month, year] = data.dob.split('/')
        apiDob = `${year}-${month}-${day}`
      }

      await updateProfile({
        name: data.name,
        dob: apiDob || undefined,
        gender: data.gender || undefined,
        weight: data.weight ? parseFloat(data.weight) : null,
        height: data.height ? parseFloat(data.height) : null,
        allergies: data.allergies,
        additional_info: data.additional_info,
      })
      toast({ title: "Perfil actualizado correctamente", variant: "success" })
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast({ title: "Error al actualizar el perfil", variant: "destructive" })
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={true}>
      <DrawerContent className="h-[90dvh] flex flex-col bg-white dark:bg-gray-900 border-none rounded-t-[20px]">

        {/* Header */}
        <DrawerHeader className="px-6 pt-2 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 rounded-t-[20px] shrink-0">
          <DrawerTitle className="text-xl font-bold text-[#054A91] dark:text-white text-center">Editar Perfil</DrawerTitle>
        </DrawerHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 bg-[#F8FAFC] dark:bg-gray-900">
          <form id="edit-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Información Personal</h3>

              <ProfileInput
                label="Nombre Completo"
                placeholder="Tu nombre"
                {...form.register("name")}
                error={form.formState.errors.name?.message}
              />

              <DateOfBirthInput
                label="Fecha de Nacimiento"
                value={dob || ""}
                onChange={(val) => form.setValue("dob", val, { shouldValidate: true })}
                error={form.formState.errors.dob?.message}
              />

              <GenderSelector
                label="Sexo asignado al nacer"
                value={gender ?? null}
                onChange={(val) => form.setValue("gender", val, { shouldValidate: true })}
                error={form.formState.errors.gender?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <ProfileInput
                  label="Peso (kg)"
                  placeholder="ej. 70"
                  type="number"
                  {...form.register("weight")}
                  error={form.formState.errors.weight?.message}
                />
                <ProfileInput
                  label="Altura (cm)"
                  placeholder="ej. 175"
                  type="number"
                  {...form.register("height")}
                  error={form.formState.errors.height?.message}
                />
              </div>
            </div>

            {/* Datos Médicos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Datos Médicos</h3>

              <ProfileTextarea
                label="Alergias"
                placeholder="Lista tus alergias..."
                {...form.register("allergies")}
                error={form.formState.errors.allergies?.message}
              />

              <ProfileTextarea
                label="Información Adicional"
                placeholder="Cualquier otro dato relevante..."
                {...form.register("additional_info")}
                error={form.formState.errors.additional_info?.message}
              />
            </div>
          </form>
        </div>

        {/* Footer Actions (Sticky Bottom) */}
        <DrawerFooter className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div className="grid grid-cols-2 gap-3 w-full">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl text-gray-600 border-gray-200 dark:text-gray-300 dark:border-gray-700"
              >
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              form="edit-profile-form"
              disabled={isUpdating}
              className="h-12 bg-[#054A91] hover:bg-[#043d7a] text-white rounded-xl shadow-lg shadow-[#054A91]/20"
            >
              {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
