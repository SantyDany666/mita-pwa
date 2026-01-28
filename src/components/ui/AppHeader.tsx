import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  className?: string;
  titleClassName?: string;
  onBack?: () => void;
}

export function AppHeader({
  title,
  leftAction,
  rightAction,
  className,
  titleClassName,
  onBack,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "relative flex items-center bg-white dark:bg-gray-900 p-4 pb-2 justify-between sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:border-gray-800",
        className,
      )}
    >
      <div className="relative z-20 flex size-12 shrink-0 items-center justify-start text-[#054A91] dark:text-[#81A4CD]">
        {leftAction ? (
          leftAction
        ) : (
          <button
            onClick={onBack || (() => window.history.back())}
            className="flex size-12 items-center justify-center p-0"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <h1
          className={cn(
            "text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] text-center pt-2",
            titleClassName,
          )}
        >
          {title}
        </h1>
      </div>

      <div className="relative z-20 flex min-w-12 items-center justify-end">
        {rightAction || <div className="w-12" />}
      </div>
    </header>
  );
}
