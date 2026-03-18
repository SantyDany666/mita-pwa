import { ArrowLeft } from "lucide-react"

interface ProfileHeaderProps {
  title: string
  onBack?: () => void
}

export const ProfileHeader = ({ title, onBack }: ProfileHeaderProps) => {
  return (
    <header className="fixed top-0 w-full z-10 bg-[#DBE4EE]/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-200 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
      <div className="relative max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="relative z-20 flex size-12 shrink-0 items-center justify-start">
          <button
            onClick={onBack}
            className="flex size-12 items-center justify-center -ml-3 rounded-full hover:bg-white/50 dark:hover:bg-gray-800 text-[#054A91] dark:text-white transition-colors"
            type="button"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <h1 className="text-lg font-bold text-center text-[#054A91] dark:text-white">
            {title}
          </h1>
        </div>

        <div className="relative z-20 flex min-w-12 items-center justify-end" />
      </div>
    </header>
  )
}
