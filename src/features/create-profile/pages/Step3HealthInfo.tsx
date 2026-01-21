import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { CreateProfileHeader } from "../components/CreateProfileHeader";
import { ProfileInput } from "../components/ProfileInput";
import { ProfileTextarea } from "../components/ProfileTextarea";
import {
  Step3Data,
  step3Schema,
  ProfileData,
} from "@/features/profile/schemas/profile-schemas";
import { useCreateProfileStore } from "../stores/create-profile.store";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { toast } from "@/store/toast.store";

export const Step3HealthInfo = () => {
  const navigate = useNavigate();
  const { step3, setStep3, getProfileData, reset } = useCreateProfileStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      allergies: step3?.allergies || "",
      additional_info: step3?.additional_info || "",
    },
    mode: "onChange",
  });

  const { createProfile, isCreating } = useProfile();

  const completeProfile = async (finalStep3Data: Step3Data | null) => {
    try {
      // Create generic object from store
      const currentData = getProfileData();

      const fullProfile = {
        ...currentData,
        ...finalStep3Data,
      } as ProfileData;

      // Basic validation check - step1 is required
      if (!fullProfile.name || !fullProfile.dob || !fullProfile.gender) {
        navigate({ to: "/create-profile" });
        return;
      }

      await createProfile(fullProfile);

      reset();
      navigate({ to: "/" });
    } catch {
      toast({
        title: "Error al crear perfil",
        description:
          "Hubo un problema al guardar tus datos. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: Step3Data) => {
    setStep3(data);
    completeProfile(data);
  };

  const onSkip = () => {
    setStep3(null);
    completeProfile(null);
  };

  return (
    <>
      <CreateProfileHeader
        step={3}
        title="Historial de riesgo"
        subtitle="Cuéntanos si debemos tener algún cuidado especial con tu atención."
        onBack={() => navigate({ to: "/create-profile/step-2" })}
      />

      <form
        className="space-y-6 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <ProfileInput
            id="allergies"
            label="Alergias"
            placeholder="Ej. Penicilina, polen, etc."
            error={errors.allergies?.message}
            {...register("allergies")}
          />
        </div>

        <div className="space-y-2">
          <ProfileTextarea
            id="additional_info"
            label="Información Adicional"
            placeholder="Condiciones preexistentes, cirugías recientes o cualquier otro dato relevante."
            rows={5}
            error={errors.additional_info?.message}
            {...register("additional_info")}
          />
        </div>

        <div className="bg-[#00B8A5]/10 dark:bg-[#00B8A5]/20 p-4 rounded-2xl flex items-start space-x-3">
          <ShieldCheck className="text-[#00B8A5] min-w-[24px]" />
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
            Tu información está protegida con encriptación de grado médico y
            solo será compartida con profesionales autorizados.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Button
            type="submit"
            disabled={isCreating}
            className="w-full text-lg font-bold rounded-2xl h-auto py-5 shadow-xl shadow-[#054A91]/20"
          >
            {isCreating ? "Finalizando..." : "Finalizar"}
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
  );
};
