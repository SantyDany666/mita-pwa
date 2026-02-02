import {
  Pill,
  Syringe,
  Tablets,
  Droplet,
  GlassWater,
  SprayCan,
  Cylinder,
  CircleHelp,
} from "lucide-react";

export type MedicineIconType =
  | "capsule"
  | "tablet"
  | "syrup"
  | "injection"
  | "drops"
  | "inhaler"
  | "cream"
  | "powder"
  | "other";

export const MEDICINE_ICONS: {
  id: MedicineIconType;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "capsule", label: "Cápsula", icon: Pill },
  { id: "tablet", label: "Tableta", icon: Tablets },
  { id: "syrup", label: "Jarabe", icon: GlassWater },
  { id: "injection", label: "Inyección", icon: Syringe },
  { id: "drops", label: "Gotas", icon: Droplet },
  { id: "inhaler", label: "Inhalador", icon: SprayCan },
  { id: "cream", label: "Crema", icon: Cylinder },
  { id: "other", label: "Otro", icon: CircleHelp },
];

export function getMedicineIcon(type: MedicineIconType) {
  return MEDICINE_ICONS.find((i) => i.id === type)?.icon || Pill;
}
