import { Calendar } from "lucide-react";
import { ChangeEvent, forwardRef, useRef, useImperativeHandle } from "react";
import { cn } from "../../../lib/utils";

export interface DateOfBirthInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  error?: string;
  value?: string;
  onChange: (value: string) => void;
  containerClassName?: string;
}

export const DateOfBirthInput = forwardRef<
  HTMLInputElement,
  DateOfBirthInputProps
>(
  (
    {
      className,
      label,
      error,
      value = "",
      onChange,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // Sync forwarded ref with internal ref
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    // Helper: DD/MM/YYYY -> YYYY-MM-DD (for input value)
    const toInputFormat = (val: string) => {
      if (!val || val.length !== 10) return "";
      const [d, m, y] = val.split("/");
      if (!d || !m || !y) return "";
      return `${y}-${m}-${d}`;
    };

    // Helper: YYYY-MM-DD -> DD/MM/YYYY (for parent state)
    const fromInputFormat = (val: string) => {
      if (!val) return "";
      const [y, m, d] = val.split("-");
      return `${d}/${m}/${y}`;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Input date always returns YYYY-MM-DD
      const rawValue = e.target.value;
      onChange(fromInputFormat(rawValue));
    };

    const handleIconClick = () => {
      try {
        if (internalRef.current?.showPicker) {
          internalRef.current.showPicker();
        } else {
          // Fallback for browsers without showPicker (e.g. older Safari)
          // Focus might trigger it on mobile, but not always desktop
          internalRef.current?.focus();
          internalRef.current?.click();
        }
      } catch (error) {
        console.warn("Browser error showing picker:", error);
      }
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={internalRef}
            type="date"
            value={toInputFormat(value)}
            onChange={handleChange}
            placeholder="DD/MM/AAAA"
            className={cn(
              "w-full py-4 px-5 pr-12 bg-white dark:bg-gray-800 border border-[#DBE4EE] dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#054A91] focus:border-[#054A91] outline-none shadow-sm transition-all text-gray-800 dark:text-white text-lg placeholder-slate-400 dark:placeholder-gray-500 appearance-none min-h-[60px] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0",
              className,
            )}
            {...props}
          />
          <div
            onClick={handleIconClick}
            className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-[#3E7CB1] dark:text-[#81A4CD] hover:text-[#054A91] dark:hover:text-white transition-colors"
          >
            <Calendar />
          </div>
        </div>
        {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
      </div>
    );
  },
);

DateOfBirthInput.displayName = "DateOfBirthInput";
