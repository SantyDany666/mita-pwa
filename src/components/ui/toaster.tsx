import { useToastStore, ToastVariant } from '@/store/toast.store'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

const icons = {
  default: Info,
  success: CheckCircle,
  destructive: AlertCircle,
}

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100',
  success: 'bg-[#00B8A5]/10 border-[#00B8A5]/20 text-[#00B8A5] dark:bg-[#00B8A5]/20',
  destructive: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400',
}

function ToastItem({ id, title, description, variant = 'default' }: { id: string, title?: string, description?: string, variant?: ToastVariant }) {
  const dismiss = useToastStore((state) => state.dismiss)
  const [isVisible, setIsVisible] = useState(false)
  const Icon = icons[variant]

  useEffect(() => {
    // Small delay to trigger animation
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => dismiss(id), 300) // Wait for exit animation
  }

  return (
    <div
      className={cn(
        "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300 ease-out",
        variantStyles[variant],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {variant !== 'default' && <Icon className="h-5 w-5 mt-0.5 shrink-0" />}
        <div className="flex-1">
          {title && <h5 className="mb-1 font-semibold leading-none tracking-tight">{title}</h5>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-md p-1 opacity-50 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  )
}
