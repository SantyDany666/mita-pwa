import { ArrowLeft } from "lucide-react"

interface ProfileHeaderProps {
  title: string
  onBack?: () => void
}

export const ProfileHeader = ({ title, onBack }: ProfileHeaderProps) => {
  return (
    <header className="fixed top-0 w-full z-10 bg-[#DBE4EE]/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800 text-[#054A91] dark:text-white transition-colors"
          type="button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 mr-8 text-[#054A91] dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  )
}
