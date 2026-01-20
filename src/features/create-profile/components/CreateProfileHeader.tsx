import { ArrowLeft } from "lucide-react"

interface CreateProfileHeaderProps {
  step: number
  totalSteps?: number
  title: string
  subtitle: string
  onBack?: () => void
}

export const CreateProfileHeader = ({
  step,
  totalSteps = 3,
  title,
  subtitle,
  onBack
}: CreateProfileHeaderProps) => {
  const isFirstStep = step === 1

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-6 h-10">
        {isFirstStep ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#3E7CB1] dark:text-[#81A4CD]">
              Paso {step} de {totalSteps}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${i + 1 === step
                      ? "w-10 bg-[#054A91] dark:bg-[#3E7CB1]"
                      : "w-6 bg-[#81A4CD] dark:bg-slate-700"
                    }`}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-[#DBE4EE] dark:hover:bg-gray-800 transition-colors focus:outline-none"
              type="button"
            >
              <ArrowLeft className="text-[#054A91] dark:text-[#81A4CD] w-6 h-6" />
            </button>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-[#3E7CB1] dark:text-[#81A4CD] uppercase tracking-widest mb-1">
                Paso {step} de {totalSteps}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full ${i + 1 === step
                        ? "w-10 bg-[#054A91] dark:bg-[#3E7CB1]"
                        : "w-6 bg-[#81A4CD] dark:bg-slate-700"
                      }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold text-[#054A91] dark:text-white mb-3">{title}</h1>
      <p className="text-slate-500 dark:text-gray-400 text-base leading-relaxed">{subtitle}</p>
    </header>
  )
}
