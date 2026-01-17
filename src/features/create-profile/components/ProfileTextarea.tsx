import { forwardRef } from "react"
import { cn } from "../../../lib/utils"

export interface ProfileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  containerClassName?: string
}

export const ProfileTextarea = forwardRef<HTMLTextAreaElement, ProfileTextareaProps>(
  ({ className, label, error, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "w-full px-5 py-4 bg-white dark:bg-gray-800 border border-[#DBE4EE] dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#054A91] focus:border-[#054A91] outline-none shadow-sm transition-all text-gray-800 dark:text-white text-lg placeholder-slate-400 dark:placeholder-gray-500 resize-none",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
      </div>
    )
  }
)

ProfileTextarea.displayName = "ProfileTextarea"
