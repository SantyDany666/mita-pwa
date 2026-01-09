import * as React from "react"
import { cn } from "../../lib/utils"

interface OtpInputProps {
  maxLength?: number
  value: string
  onChange: (value: string) => void
}

const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  ({ maxLength = 6, value, onChange }, ref) => {
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const val = e.target.value
      if (isNaN(Number(val))) return

      const newValue = value.split("")
      newValue[index] = val.substring(val.length - 1)
      const newString = newValue.join("")
      onChange(newString)

      // Focus next
      if (val && index < maxLength - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
    }

    return (
      <div ref={ref} className="flex gap-2.5 justify-center w-full">
        {Array.from({ length: maxLength }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={cn(
              "w-12 h-14 border rounded-xl text-center text-xl font-semibold bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary transition-all",
              value[i] ? "border-primary text-primary dark:text-white" : "border-gray-300 dark:border-gray-600"
            )}
          />
        ))}
      </div>
    )
  }
)
OtpInput.displayName = "OtpInput"

export { OtpInput }
