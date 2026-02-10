import { Toaster as Sonner } from "sonner";
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-center"
      richColors
      theme="system"
      className="toaster group !bottom-20"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-slate-900 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:text-sm group-[.toaster]:font-sans [&_[data-title]]:!text-sm [&_[data-description]]:!text-sm",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:font-normal",
          actionButton:
            "group-[.toast]:font-bold group-[.toast]:!text-sm group-[.toast]:!bg-transparent group-[.toast]:!px-3 group-[.toast]:!py-1 group-[.toast]:!h-auto group-data-[type=success]:!text-[#00B8A5] group-data-[type=success]:dark:!text-white group-data-[type=info]:!text-[#054A91] group-data-[type=info]:dark:!text-white hover:group-[.toast]:underline",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:border-red-500 group-[.toaster]:bg-red-50 group-[.toaster]:dark:bg-red-950/20 group-[.toaster]:text-red-600 group-[.toaster]:dark:text-red-400",
          success:
            "group-[.toaster]:border-[#00B8A5] group-[.toaster]:!bg-[#F0FAF9] group-[.toaster]:dark:!bg-[#003832] group-[.toaster]:!text-[#00B8A5] group-[.toaster]:dark:!text-white",
          warning:
            "group-[.toaster]:border-amber-500 group-[.toaster]:bg-amber-50 group-[.toaster]:dark:bg-amber-950/20 group-[.toaster]:text-amber-600 group-[.toaster]:dark:text-amber-400",
          info: "group-[.toaster]:border-[#054A91] group-[.toaster]:!bg-[#F0F6FA] group-[.toaster]:dark:!bg-[#001E3C] group-[.toaster]:dark:!border-[#054A91] group-[.toaster]:!text-[#054A91] group-[.toaster]:dark:!text-white",
        },
      }}
      {...props}
    />
  );
};
