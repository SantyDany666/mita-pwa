import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const COMMON_SYMPTOMS = [
  "Dolor de cabeza",
  "Náuseas / Vómitos",
  "Mareo / Vértigo",
  "Ansiedad / Nerviosismo",
  "Fatiga / Cansancio",
  "Insomnio",
  "Dolor abdominal",
  "Tos / Estornudos",
  "Fiebre / Escalofríos",
  "Falta de hambre",
];

interface SymptomSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SymptomSelector({
  value,
  onChange,
  error,
}: SymptomSelectorProps) {
  const isCommon = COMMON_SYMPTOMS.includes(value) || value === "";
  const [selection, setSelection] = useState(isCommon ? value : "Otro");
  const [customValue, setCustomValue] = useState(isCommon ? "" : value);

  useEffect(() => {
    if (selection === "Otro") {
      onChange(customValue);
    } else {
      onChange(selection);
    }
  }, [selection, customValue, onChange]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Select
        label="¿Qué síntoma presentas?"
        value={selection}
        onChange={(e) => {
          const val = e.target.value;
          setSelection(val);
          if (val !== "Otro") setCustomValue("");
        }}
        error={error}
      >
        <option value="" disabled>
          Selecciona un síntoma...
        </option>
        {COMMON_SYMPTOMS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
        <option value="Otro">Otro (Escribir...)</option>
      </Select>

      {selection === "Otro" && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <Input
            autoFocus
            label="Especificar síntoma"
            placeholder="Ej: Dolor lumbar, Alergia..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
