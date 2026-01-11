import { Button } from "../../../components/ui/button"
import { useAuthNavigation } from "../hooks/useAuthNavigation"
import { HelpLink } from "../../../components/ui/help-link"
import { AuthHeader } from "./AuthHeader"
import { usePhoneLogin } from "../hooks/usePhoneLogin"
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { Loader2 } from "lucide-react"

export const PhoneLoginScreen = () => {
  const { navigateToWelcome } = useAuthNavigation()
  const { form, onSubmit, isLoading, error } = usePhoneLogin()

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center p-4">
      <AuthHeader
        title="Registro"
        onBack={navigateToWelcome} // Go back to welcome or login selection
      />
      <main className="w-full max-w-md flex-1 flex flex-col px-2 pt-4 pb-6 relative">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#3E7CB1] dark:text-[#81A4CD] mb-2 mt-4">
            Ingresa tu número
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-normal">
            Te enviaremos un código de verificación por SMS para activar tu cuenta.
          </p>
        </div>

        <form className="space-y-8 flex-1 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative group">
            {/* Wrapper for styling since containerClassName might be invalid or buggy in some versions */}
            <div className="flex items-center w-full h-14 bg-white dark:bg-gray-800 border border-[#DBE4EE] dark:border-gray-700 rounded-xl shadow-soft focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all duration-200 z-10 relative">
              <PhoneInput
                defaultCountry="co"
                value={form.watch('phone')}
                onChange={(phone) => form.setValue('phone', phone)}
                inputClassName="!w-full !h-14 !bg-transparent !border-none !text-base !font-medium !text-gray-900 dark:!text-white focus:!ring-0"
                countrySelectorStyleProps={{
                  buttonClassName: "!h-14 !bg-transparent !border-none !pl-3 !pr-2 hover:!bg-gray-100 dark:hover:!bg-gray-700",
                  buttonContentWrapperClassName: "!gap-2",
                  flagClassName: "!w-6 !h-6 !rounded-sm",
                  dropdownStyleProps: {
                    className: "!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !border-[#DBE4EE] dark:!border-gray-700 !shadow-lg !rounded-xl"
                  }
                }}
              />
            </div>

            {form.formState.errors.phone && (
              <p className="text-red-500 text-sm mt-2">{form.formState.errors.phone.message}</p>
            )}

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full text-lg shadow-glow h-14"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            Enviar Código
          </Button>

          <div className="w-full text-center">
            <HelpLink />
          </div>
        </form>
      </main>
    </div>
  )
}
