import { LogOut } from "lucide-react"

interface ProfileLogoutButtonProps {
  onLogout?: () => void
}

export const ProfileLogoutButton = ({ onLogout }: ProfileLogoutButtonProps) => {
  return (
    <div className="pt-6 pb-4 flex justify-center w-full">
      <button
        onClick={onLogout}
        className="group flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 text-[#991B1B] dark:text-[#FEE2E2] font-medium transition-all hover:bg-red-200 dark:hover:bg-[#7F1D1D]/50 active:scale-95 shadow-sm"
      >
        <LogOut className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  )
}
