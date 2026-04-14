import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  optional?: boolean;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, optional, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
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
        <div className="relative">
          <select
            className={cn(
              "appearance-none flex h-14 w-full rounded-lg border bg-slate-50 dark:bg-gray-800 px-[15px] py-2 text-base font-normal text-slate-900 dark:text-white transition-all focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 focus:border-[#054A91] disabled:cursor-not-allowed disabled:opacity-50 pr-10",
              error ? "border-red-500" : "border-slate-200 dark:border-gray-700",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#00B8A5]">
            <ChevronRight className="rotate-90 w-5 h-5" />
          </div>
        </div>
        {error && (
          <span className="text-red-500 text-xs mt-1 px-1 block">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
