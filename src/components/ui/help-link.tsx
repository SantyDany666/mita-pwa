import { CircleHelp } from "lucide-react"

export const HelpLink = () => {
  return (
    <a
      className="inline-flex items-center text-secondary dark:text-secondary hover:text-opacity-80 text-sm font-medium transition-colors border-b border-transparent hover:border-secondary gap-1"
      href="#"
    >
      <CircleHelp className="h-4 w-4" />
      ¿Necesitas ayuda?
    </a>
  )
}
