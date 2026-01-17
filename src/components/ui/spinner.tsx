import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  className?: string
}

export function Spinner({ size = 48, className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center pointer-events-none", className)}
      {...props}
    >
      <div className="relative">
        {/* Outer Ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-t-[#00B8A5] border-r-[#054A91] border-b-[#00B8A5] border-l-[#054A91] opacity-20 animate-spin"
          style={{ width: size, height: size }}
        />
        {/* Inner Lucide Spinner */}
        <Loader2
          className="animate-spin text-[#00B8A5]"
          size={size}
        />
      </div>
    </div>
  )
}

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          {/* Decorative pulsing blur behind */}
          <div className="absolute inset-0 bg-[#00B8A5]/20 blur-xl rounded-full animate-pulse" />
          <Spinner size={64} />
        </div>
        <p className="text-sm font-medium text-muted-foreground dark:text-gray-300 animate-pulse">
          Cargando...
        </p>
      </div>
    </div>
  )
}
