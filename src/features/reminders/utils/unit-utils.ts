import { MedicineIconType } from "./medicine-icons";

export interface UnitOption {
  value: string;
  label: string;
}

export const UNITS_BY_ICON: Record<MedicineIconType, UnitOption[]> = {
  capsule: [
    { value: "mg", label: "mg" },
    { value: "mcg", label: "mcg" },
    { value: "units", label: "unidades" },
    { value: "capsules", label: "cápsulas" },
    { value: "g", label: "g" },
  ],
  tablet: [
    { value: "mg", label: "mg" },
    { value: "mcg", label: "mcg" },
    { value: "units", label: "unidades" },
    { value: "tablets", label: "tabletas" },
    { value: "g", label: "g" },
  ],
  syrup: [
    { value: "ml", label: "ml" },
    { value: "units", label: "unidades" },
    { value: "oz", label: "oz" },
    { value: "tsp", label: "cucharaditas" },
    { value: "tbsp", label: "cucharadas" },
  ],
  injection: [
    { value: "ml", label: "ml" },
    { value: "units", label: "unidades" },
    { value: "mg", label: "mg" },
    { value: "mcg", label: "mcg" },
  ],
  drops: [
    { value: "drops", label: "gotas" },
    { value: "ml", label: "ml" },
    { value: "units", label: "unidades" },
  ],
  inhaler: [
    { value: "puffs", label: "inhalaciones" },
    { value: "units", label: "unidades" },
    { value: "mg", label: "mg" },
    { value: "mcg", label: "mcg" },
  ],
  cream: [
    { value: "g", label: "g" },
    { value: "units", label: "unidades" },
    { value: "mg", label: "mg" },
    { value: "applications", label: "aplicaciones" },
  ],
  powder: [
    { value: "sachets", label: "sobres" },
    { value: "g", label: "g" },
    { value: "mg", label: "mg" },
    { value: "units", label: "unidades" },
  ],
  other: [
    { value: "units", label: "unidades" },
    { value: "mg", label: "mg" },
    { value: "ml", label: "ml" },
    { value: "g", label: "g" },
    { value: "mcg", label: "mcg" },
    { value: "oz", label: "oz" },
  ],
};

export function getUnitsForIcon(icon: MedicineIconType): UnitOption[] {
  return UNITS_BY_ICON[icon] || UNITS_BY_ICON.other;
}
