import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  optional?: boolean;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, optional, error, type, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
            {label}
            {optional && (
              <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-1">
                (Opcional)
              </span>
            )}
          </p>
        )}
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-lg border bg-slate-50 dark:bg-gray-800 px-[15px] py-2 text-base font-normal text-slate-900 dark:text-white transition-all placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 focus:border-[#054A91] disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500" : "border-slate-200 dark:border-gray-700",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-red-500 text-xs mt-1 px-1">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
