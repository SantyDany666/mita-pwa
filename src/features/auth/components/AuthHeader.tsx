import { ChevronLeft } from "lucide-react"

interface AuthHeaderProps {
  title?: string
  onBack?: () => void
  className?: string
}

export const AuthHeader = ({ title, onBack, className = "" }: AuthHeaderProps) => {
  return (
    <header className={`flex items-center justify-between w-full max-w-md px-2 py-4 z-10 relative ${className}`}>
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-primary dark:text-white group"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6 group-active:scale-95 transition-transform" />
        </button>
      )}
      {!onBack && <div className="w-10" />}

      <h1 className="text-base font-semibold text-primary dark:text-white absolute left-1/2 transform -translate-x-1/2 tracking-wide truncate max-w-[60%] text-center">
        {title}
      </h1>

      <div className="w-10" />
    </header>
  )
}
