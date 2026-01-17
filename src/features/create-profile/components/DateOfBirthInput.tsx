import { Calendar } from "lucide-react"
import { ChangeEvent, forwardRef } from "react"
import { cn } from "../../../lib/utils"

export interface DateOfBirthInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string
  error?: string
  value?: string
  onChange: (value: string) => void
  containerClassName?: string
}

export const DateOfBirthInput = forwardRef<HTMLInputElement, DateOfBirthInputProps>(
  ({ className, label, error, value = "", onChange, containerClassName, ...props }, ref) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      let inputValue = input.value.replace(/\D/g, "") // Remove non-digits
      const isDeleting = input.value.length < value.length

      // Limit length to 8 characters (DDMMYYYY)
      if (inputValue.length > 8) {
        inputValue = inputValue.slice(0, 8)
      }

      // Format logic
      let formattedValue = ""
      if (inputValue.length > 0) {
        // Day
        const day = inputValue.slice(0, 2)
        if (parseInt(day) > 31) {
          formattedValue = "31"
        } else {
          formattedValue = day
        }

        if (inputValue.length >= 2) {
          // Only add slash if we are NOT deleting or if we already have more chars following
          if (!isDeleting || inputValue.length > 2) {
            formattedValue += "/"
          }
        }
      }

      if (inputValue.length > 2) {
        // Month
        const month = inputValue.slice(2, 4)
        if (month.length === 2 && parseInt(month) > 12) {
          formattedValue += "12"
        } else {
          formattedValue += month
        }

        if (inputValue.length >= 4) {
          // Only add slash if we are NOT deleting or if we already have more chars following
          if (!isDeleting || inputValue.length > 4) {
            formattedValue += "/"
          }
        }
      }

      if (inputValue.length > 4) {
        // Year
        const year = inputValue.slice(4, 8)
        formattedValue += year
      }

      onChange(formattedValue)
    }

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/AAAA"
            value={value}
            onChange={handleChange}
            maxLength={10} // DD/MM/YYYY = 10 chars
            className={cn(
              "w-full py-4 px-5 pr-12 bg-white dark:bg-gray-800 border border-[#DBE4EE] dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#054A91] focus:border-[#054A91] outline-none shadow-sm transition-all text-gray-800 dark:text-white text-lg placeholder-slate-400 dark:placeholder-gray-500",
              className
            )}
            {...props}
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Calendar className="text-[#3E7CB1] dark:text-[#81A4CD]" />
          </div>
        </div>
        {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
      </div>
    )
  }
)

DateOfBirthInput.displayName = "DateOfBirthInput"
