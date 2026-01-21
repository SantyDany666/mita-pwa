import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { CreateProfileHeader } from "../components/CreateProfileHeader";
import { DateOfBirthInput } from "../components/DateOfBirthInput";
import { GenderSelector } from "../components/GenderSelector";
import { ProfileInput } from "../components/ProfileInput";
import {
  Step1Data,
  step1Schema,
} from "@/features/profile/schemas/profile-schemas";
import { useCreateProfileStore } from "../stores/create-profile.store";

export const Step1BasicInfo = () => {
  const navigate = useNavigate();
  const { step1, setStep1 } = useCreateProfileStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: step1?.name || "",
      dob: step1?.dob || "",
      gender: step1?.gender,
    },
    mode: "onChange",
  });

  const onSubmit = (data: Step1Data) => {
    setStep1(data);
    navigate({ to: "/create-profile/step-2" });
  };

  return (
    <>
      <CreateProfileHeader
        step={1}
        title="¡Hola! Cuéntanos de ti"
        subtitle="Esto nos ayuda a personalizar tu historial y tu salud."
      />

      <form
        className="space-y-6 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ProfileInput
          id="name"
          label="Nombre Completo"
          placeholder="Ej. Juan Pérez"
          error={errors.name?.message}
          {...register("name")}
        />

        <Controller
          control={control}
          name="dob"
          render={({ field }) => (
            <DateOfBirthInput
              id="dob"
              label="Fecha de Nacimiento"
              value={field.value}
              onChange={(val) => field.onChange(val)}
              error={errors.dob?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <GenderSelector
              label="Sexo asignado al nacer"
              value={field.value || null}
              onChange={(val) => field.onChange(val)}
              error={errors.gender?.message}
            />
          )}
        />

        <div className="pt-6">
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full text-lg font-bold rounded-2xl h-auto py-5 shadow-xl shadow-[#054A91]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </form>
    </>
  );
};
