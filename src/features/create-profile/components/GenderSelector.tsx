interface GenderSelectorProps {
  value: 'male' | 'female' | null
  onChange: (value: 'male' | 'female') => void
  label?: string
  error?: string
}

export const GenderSelector = ({ value, onChange, label, error }: GenderSelectorProps) => {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="flex bg-[#DBE4EE] dark:bg-gray-800 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => onChange('male')}
          className={`flex-1 py-3 text-lg font-semibold rounded-xl transition-all ${value === 'male'
            ? 'bg-[#054A91] text-white shadow-sm'
            : 'text-[#054A91] dark:text-[#81A4CD] hover:bg-white/50 dark:hover:bg-white/10'
            }`}
        >
          Hombre
        </button>
        <button
          type="button"
          onClick={() => onChange('female')}
          className={`flex-1 py-3 text-lg font-semibold rounded-xl transition-all ${value === 'female'
            ? 'bg-[#054A91] text-white shadow-sm'
            : 'text-[#054A91] dark:text-[#81A4CD] hover:bg-white/50 dark:hover:bg-white/10'
            }`}
        >
          Mujer
        </button>
      </div>
      {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
    </div>
  )
}
