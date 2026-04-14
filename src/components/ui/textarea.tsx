import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  optional?: boolean;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, optional, error, ...props }, ref) => {
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
        <textarea
          className={cn(
            "flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-all",
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
Textarea.displayName = "Textarea"

export { Textarea }
