import { Button } from "../../../components/ui/button"
import { useAuthNavigation } from "../hooks/useAuthNavigation"
import { useAuth } from "../hooks/useAuth"
import { Smartphone, Loader2 } from "lucide-react"

export const WelcomeScreen = () => {
  const { navigateToLogin } = useAuthNavigation()
  const { loginWithGoogle, isLoading } = useAuth()

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center p-4">
      {/* Card Container matching HTML structure */}
      <div className="w-full max-w-md flex-1 flex flex-col px-2 pt-8 pb-6 relative justify-center">

        {/* Background Blobs
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#81A4CD]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" /> */}

        {/* Illustration Area */}
        <div className="flex items-center justify-center w-full mb-8 mt-4">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#81A4CD]/20 dark:bg-blue-900/20 rounded-full scale-90 blur-xl opacity-70" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {/* SVG from Pantalla_1.html */}
              <svg className="w-60 h-60 drop-shadow-sm" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle className="fill-[#DBE4EE] dark:fill-slate-700" cx="100" cy="100" r="80" />
                <path className="fill-[#81A4CD]/20 stroke-[#3E7CB1] dark:stroke-blue-400 stroke-2" d="M60 120 C40 100 40 70 65 70 C75 70 85 75 90 85 C95 75 105 70 115 70 C140 70 140 100 120 120 L90 150 L60 120 Z" />
                <path className="stroke-[#054A91] dark:stroke-blue-300 stroke-2 fill-none stroke-linecap-round stroke-linejoin-round" d="M50 105 L70 105 L80 85 L95 125 L110 95 L120 105 L130 105" />
                <rect className="fill-white dark:fill-gray-800 stroke-[#054A91] dark:stroke-blue-400 stroke-2" height="50" rx="12" width="60" x="110" y="40" />
                <circle className="fill-[#00B8A5]" cx="125" cy="60" r="3" />
                <circle className="fill-[#00B8A5]" cx="155" cy="60" r="3" />
                <path className="stroke-[#3E7CB1] stroke-2 fill-none stroke-linecap-round" d="M132 72 Q140 80 148 72" />
                <line className="stroke-[#054A91] dark:stroke-blue-400 stroke-2" x1="140" x2="140" y1="40" y2="30" />
                <circle className="fill-white dark:fill-gray-800 stroke-[#054A91] dark:stroke-blue-400 stroke-2" cx="140" cy="28" r="4" />
                <path className="fill-white dark:fill-gray-800 stroke-[#054A91] dark:stroke-blue-400 stroke-2" d="M115 85 L110 95 L125 90" />
                <rect className="fill-[#00B8A5]/10 dark:fill-teal-900/40 stroke-[#00B8A5] dark:stroke-teal-400 stroke-2" height="50" rx="6" width="35" x="135" y="110" />
                <rect className="fill-white dark:fill-gray-800 stroke-[#00B8A5] dark:stroke-teal-400 stroke-2" height="10" rx="2" width="41" x="132" y="105" />
                <line className="stroke-[#00B8A5] stroke-2 stroke-linecap-round" x1="142" x2="162" y1="130" y2="130" />
                <line className="stroke-[#00B8A5] stroke-2 stroke-linecap-round" x1="142" x2="155" y1="138" y2="138" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold text-primary dark:text-white leading-tight tracking-tight">
              ¡Hola! Te damos la bienvenida
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4 font-medium">
              Tu compañero de salud personal. Sigue tus medicamentos, síntomas y ánimo con facilidad.
            </p>
          </div>

          <div className="space-y-4 pt-2 w-full">
            <Button
              variant="outline"
              className="w-full space-x-3 h-14"
              onClick={loginWithGoogle}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              <span>Continuar con Google</span>
            </Button>

            <Button
              variant="default"
              className="w-full space-x-3 h-14"
              onClick={navigateToLogin}
            >
              <Smartphone className="h-5 w-5" />
              <span>Iniciar Sesión con Teléfono</span>
            </Button>
          </div>
        </div>

      </div>
      <div className="h-6" />
    </div>
  )
}
