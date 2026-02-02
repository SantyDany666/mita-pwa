import { createElement } from "react";
import { cn } from "@/lib/utils";
import { getMedicineIcon, MedicineIconType } from "../utils/medicine-icons";

interface MedicineIconDisplayProps {
  type?: MedicineIconType;
  className?: string;
}

export function MedicineIconDisplay({
  type = "capsule",
  className,
}: MedicineIconDisplayProps) {
  const Icon = getMedicineIcon(type);

  return createElement(Icon, { className: cn("shrink-0", className) });
}
