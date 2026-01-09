import { Button } from "../../../components/ui/button"
import { useAuthNavigation } from "../hooks/useAuthNavigation"
import { ChevronDown } from "lucide-react"
import { HelpLink } from "../../../components/ui/help-link"
import { AuthHeader } from "./AuthHeader"
import { useNavigate } from "@tanstack/react-router"

export const PhoneLoginScreen = () => {
  const { navigateToOtp } = useAuthNavigation()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToOtp()
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center p-4">
      <AuthHeader
        title="Registro"
        onBack={() => navigate({ to: '/welcome' })}
      />
      <main className="w-full max-w-md flex-1 flex flex-col px-2 pt-4 pb-6 relative">
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-primary dark:text-white mb-6">Registro</h1> */}
          <h2 className="text-xl font-semibold text-[#3E7CB1] dark:text-[#81A4CD] mb-2 mt-4">
            Ingresa tu número
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-normal">
            Te enviaremos un código de verificación por SMS para activar tu cuenta.
          </p>
        </div>

        <form className="space-y-8 flex-1 flex flex-col" onSubmit={handleSubmit}>
          <div className="relative group">
            <div className="flex items-center w-full h-14 bg-white dark:bg-gray-800 border border-[#DBE4EE] dark:border-gray-700 rounded-xl shadow-soft focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all duration-200 overflow-hidden">

              {/* Country Code Selector */}
              <div className="relative h-full">
                <select
                  className="h-full pl-4 pr-10 appearance-none bg-transparent font-medium text-primary dark:text-white outline-none border-r border-[#DBE4EE] dark:border-gray-700 cursor-pointer hover:bg-[#DBE4EE]/30 transition-colors bg-white dark:bg-gray-800"
                  defaultValue="+57"
                >
                  <option value="+57">+57</option>
                  <option value="+1">+1</option>
                  <option value="+34">+34</option>
                  <option value="+52">+52</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#3E7CB1] pointer-events-none" />
              </div>

              <input
                className="w-full h-full px-4 border-none bg-transparent text-gray-900 dark:text-white placeholder-[#81A4CD]/70 focus:ring-0 text-base font-medium focus:outline-none"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Número de móvil"
                type="tel"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full text-lg shadow-glow h-14">
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
