import { ChevronDown } from "lucide-react"
import { ReactNode } from "react"

interface ProfileSectionProps {
  title: string
  icon: ReactNode
  children: ReactNode
}

export const ProfileSection = ({ title, icon, children }: ProfileSectionProps) => {
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-[0_4px_20px_-2px_rgba(5,74,145,0.1),0_2px_4px_-2px_rgba(0,0,0,0.05)] p-5 transition-colors duration-200">
      <div className="flex items-center space-x-2 mb-3 text-[#054A91] dark:text-white">
        <ChevronDown className="w-6 h-6 text-[#3E7CB1]" />
        <span className="text-[#00B8A5] [&>svg]:w-6 [&>svg]:h-6">{icon}</span>
        <h3 className="font-bold text-base">{title}</h3>
      </div>
      <div className="space-y-0 border-t border-gray-100 dark:border-gray-700">
        {children}
      </div>
    </div>
  )
}

interface ProfileSectionItemProps {
  label: string
  value: ReactNode
  isLast?: boolean
}

export const ProfileSectionItem = ({ label, value, isLast = false }: ProfileSectionItemProps) => {
  return (
    <div
      className={`py-3 flex justify-between items-start ${!isLast ? "border-b border-gray-100 dark:border-gray-700" : ""
        } group hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 rounded-lg transition-colors`}
    >
      <span className="text-sm font-semibold text-[#3E7CB1] dark:text-gray-400 w-1/3">{label}</span>
      <div className="text-sm text-[#054A91] dark:text-gray-200 font-medium w-2/3 text-right flex justify-end items-center">
        {value}
      </div>
    </div>
  )
}
