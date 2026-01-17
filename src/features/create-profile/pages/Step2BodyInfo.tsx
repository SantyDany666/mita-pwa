import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Info } from 'lucide-react'
import { useForm } from "react-hook-form"
import { Button } from '../../../components/ui/button'
import { CreateProfileHeader } from '../components/CreateProfileHeader'
import { ProfileInput } from '../components/ProfileInput'
import { Step2Data, step2Schema } from "../schemas/profile-schemas"
import { useCreateProfileStore } from "../stores/create-profile.store"

export const Step2BodyInfo = () => {
  const navigate = useNavigate()
  const { step2, setStep2 } = useCreateProfileStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      weight: step2?.weight || "",
      height: step2?.height || "",
    },
    mode: "onChange",
  })

  const onSubmit = (data: Step2Data) => {
    setStep2(data)
    navigate({ to: '/create-profile/step-3' })
  }

  const onSkip = () => {
    // Clear step 2 data or save as empty/null if preferred, but usually 'skip' means 'no data provided'
    // User requirement: "omite todos los campos y no los guarda en el estado"
    // So we might set null or just ignore. The store allows null.
    setStep2(null)
    navigate({ to: '/create-profile/step-3' })
  }

  return (
    <>
      <CreateProfileHeader
        step={2}
        title="Información corporal"
        subtitle="Estos datos son clave para calcular dosis o rangos médicos precisos."
        onBack={() => navigate({ to: '/create-profile' })}
      />

      <form
        className="space-y-6 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4">
          <ProfileInput
            id="weight"
            label="Peso (kg)"
            placeholder="70"
            type="number"
            step="0.1"
            suffix={<span className="text-xs font-bold text-[#81A4CD]">KG</span>}
            error={errors.weight?.message}
            {...register("weight")}
          />
          <ProfileInput
            id="height"
            label="Talla (cm)"
            placeholder="170"
            type="number"
            suffix={<span className="text-xs font-bold text-[#81A4CD]">CM</span>}
            error={errors.height?.message}
            {...register("height")}
          />
        </div>

        <div className="bg-[#00B8A5]/10 dark:bg-[#00B8A5]/20 p-4 rounded-2xl flex items-start space-x-3">
          <Info className="text-[#00B8A5] min-w-[24px]" />
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
            Su privacidad es nuestra prioridad. Estos datos se procesan de forma cifrada y solo con fines clínicos.
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <Button
            type="submit"
            className="w-full text-lg font-bold rounded-2xl h-auto py-5 shadow-xl shadow-[#054A91]/20"
          >
            Continuar
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          <button
            type="button"
            className="w-full text-lg text-[#3E7CB1] font-semibold py-2 transition-colors hover:text-[#054A91]"
            onClick={onSkip}
          >
            Saltar este paso
          </button>
        </div>
      </form>
    </>
  )
}
