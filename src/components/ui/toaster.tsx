import { Toaster as Sonner } from "sonner";
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      richColors
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-slate-900 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:text-sm group-[.toaster]:font-sans",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:font-normal",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:border-red-500 group-[.toaster]:bg-red-50 group-[.toaster]:dark:bg-red-950/20 group-[.toaster]:text-red-600 group-[.toaster]:dark:text-red-400",
          success:
            "group-[.toaster]:border-[#00B8A5] group-[.toaster]:bg-[#00B8A5]/10 group-[.toaster]:dark:bg-[#00B8A5]/20 group-[.toaster]:text-[#00B8A5] group-[.toaster]:dark:text-[#00B8A5]",
          warning:
            "group-[.toaster]:border-amber-500 group-[.toaster]:bg-amber-50 group-[.toaster]:dark:bg-amber-950/20 group-[.toaster]:text-amber-600 group-[.toaster]:dark:text-amber-400",
          info: "group-[.toaster]:border-blue-500 group-[.toaster]:bg-blue-50 group-[.toaster]:dark:bg-blue-950/20 group-[.toaster]:text-blue-600 group-[.toaster]:dark:text-blue-400",
        },
      }}
      {...props}
    />
  );
};
