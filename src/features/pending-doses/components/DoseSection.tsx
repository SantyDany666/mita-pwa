import { ReactNode } from "react";

interface DoseSectionProps {
  title: string;
  icon?: ReactNode;
  variant?: "default" | "overdue" | "morning" | "afternoon" | "night";
  children: ReactNode;
}

export function DoseSection({
  title,
  icon,
  variant = "default",
  children,
}: DoseSectionProps) {
  const getHeaderStyles = () => {
    switch (variant) {
      case "overdue":
        return "text-orange-600 dark:text-orange-300";
      case "morning":
      case "afternoon":
      case "night":
      case "default":
      default:
        return "text-[#054A91] dark:text-[#81A4CD]"; // primary
    }
  };

  return (
    <>
      <h3
        className={`text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 flex items-center gap-2 ${getHeaderStyles()}`}
      >
        {icon && <span className="text-xl">{icon}</span>}
        {title}
      </h3>
      <div className="px-4">{children}</div>
    </>
  );
}
