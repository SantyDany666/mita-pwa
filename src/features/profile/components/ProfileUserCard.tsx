import { Edit, User } from "lucide-react"

interface ProfileUserCardProps {
  name: string
  email: string
  avatarUrl: string
  onEdit?: () => void
}

export const ProfileUserCard = ({ name, email, avatarUrl, onEdit }: ProfileUserCardProps) => {
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-[0_4px_20px_-2px_rgba(5,74,145,0.1),0_2px_4px_-2px_rgba(0,0,0,0.05)] p-6 relative mt-8 transition-colors duration-200">
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          {avatarUrl ? (
            <img
              alt={`Foto de perfil de ${name}`}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1F2937] object-cover shadow-lg transition-colors duration-200"
              src={avatarUrl}
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1F2937] shadow-lg transition-colors duration-200 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <div className="absolute bottom-1 right-1 bg-[#00B8A5] w-5 h-5 rounded-full border-4 border-white dark:border-[#1F2937]"></div>
        </div>
      </div>
      <div className="mt-12 text-center space-y-1">
        <h2 className="text-xl font-bold text-[#054A91] dark:text-white">{name}</h2>
        <p className="text-sm text-[#3E7CB1] dark:text-gray-400 font-medium">{email}</p>
      </div>
      <button
        onClick={onEdit}
        className="w-full mt-6 bg-[#054A91] hover:bg-[#043d7a] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[#054A91]/30 transition-all active:scale-95 flex items-center justify-center space-x-2"
      >
        <Edit className="w-4 h-4" />
        <span>Editar Perfil</span>
      </button>
    </div>
  )
}
