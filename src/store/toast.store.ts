import { toast as sonnerToast } from "sonner";

export type ToastVariant = "default" | "destructive" | "success";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export const toast = ({
  title,
  description,
  variant = "default",
}: ToastProps) => {
  switch (variant) {
    case "success":
      return sonnerToast.success(title, { description });
    case "destructive":
      return sonnerToast.error(title, { description });
    default:
      return sonnerToast.message(title, { description });
  }
};
