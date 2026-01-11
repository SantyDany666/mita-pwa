import { Button } from "../../../components/ui/button"
import { OtpInput } from "../../../components/ui/otp-input"
import { useAuthNavigation } from "../hooks/useAuthNavigation"
import { LockOpen, Clock, Loader2 } from "lucide-react"
import { HelpLink } from "../../../components/ui/help-link"
import { AuthHeader } from "./AuthHeader"
import { useAuthOtp } from "../hooks/useAuthOtp"

export const OtpScreen = () => {
  const { navigateToLogin } = useAuthNavigation()
  const {
    form,
    onConfirm,
    handleResend,
    timeLeft,
    canResend,
    phoneNumber,
    isLoading,
    error
  } = useAuthOtp()

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center p-4">
      <AuthHeader
        title="Verificación OTP"
        onBack={navigateToLogin}
      />

      <main className="w-full max-w-md flex-1 flex flex-col px-2 pt-6 pb-6 relative overflow-y-auto no-scrollbar">
        <div className="w-full text-center mb-10">
          <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full mx-auto mb-6 flex items-center justify-center text-secondary">
            <LockOpen className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-3">
            Ingresa el código
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-2 font-medium">
            Hemos enviado un código de 6 dígitos a tu número <br />
            <span className="text-primary dark:text-white font-bold whitespace-nowrap text-base mt-1 block">
              {phoneNumber}
            </span>
          </p>
        </div>

        <div className="mb-4 w-full flex flex-col items-center">
          {/* Using Controller or just value/onChange from react-hook-form if OtpInput supports it directly */}
          {/* Assuming OtpInput takes value and onChange */}
          <OtpInput
            value={form.watch('otp')}
            onChange={(val) => form.setValue('otp', val)}
            maxLength={6}
          />
          {form.formState.errors.otp && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.otp.message}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {canResend ? (
          <Button
            variant="ghost"
            onClick={handleResend}
            className="mb-10 mx-auto text-secondary font-bold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Reenviar código
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-10 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-full mx-auto w-fit">
            <Clock className="h-5 w-5 text-secondary" />
            <p className="text-sm font-medium">
              Reenviar código en <span className="text-secondary font-bold">{formatTime(timeLeft)}</span>
            </p>
          </div>
        )}

        <Button
          className="w-full shadow-lg shadow-[#054A91]/30 mb-6 font-bold h-14"
          onClick={form.handleSubmit(onConfirm)}
          disabled={isLoading || form.watch('otp').length !== 6}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          Confirmar
        </Button>

        <div className="w-full text-center">
          <HelpLink />
        </div>
      </main>
    </div>
  )
}
