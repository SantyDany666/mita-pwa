import { forwardRef } from "react"
import { cn } from "../../../lib/utils"

export interface ProfileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string
  suffix?: React.ReactNode
  prefix?: React.ReactNode
  error?: string
  containerClassName?: string
}

export const ProfileInput = forwardRef<HTMLInputElement, ProfileInputProps>(
  ({ className, label, suffix, prefix, error, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full py-4 bg-white dark:bg-gray-800 border border-[#DBE4EE] dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#054A91] focus:border-[#054A91] outline-none shadow-sm transition-all text-gray-800 dark:text-white text-lg placeholder-slate-400 dark:placeholder-gray-500",
              prefix ? "pl-12" : "px-5",
              suffix ? "pr-12" : "px-5",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
      </div>
    )
  }
)

ProfileInput.displayName = "ProfileInput"
