import { ReactNode } from "react";

interface DoseSectionProps {
  title: string;
  icon?: ReactNode;
  variant?:
    | "default"
    | "overdue"
    | "morning"
    | "afternoon"
    | "night"
    | "completed"
    | "taken"
    | "skipped";
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
      case "completed":
        return "text-gray-500 dark:text-gray-400";
      case "taken":
        return "text-teal-600 dark:text-teal-400";
      case "skipped":
        return "text-gray-400 dark:text-gray-500";
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
        className={`text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4 flex items-center gap-2 ${getHeaderStyles()}`}
      >
        {icon && <span className="text-xl">{icon}</span>}
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </>
  );
}
