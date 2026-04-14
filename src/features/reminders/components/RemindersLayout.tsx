import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppHeader } from "@/components/ui/AppHeader";
import { BottomNavigation } from "@/components/ui/BottomNavigation";

interface RemindersLayoutProps {
  children: ReactNode;
}

export function RemindersLayout({ children }: RemindersLayoutProps) {
  return (
    <div className="relative flex h-dvh w-full flex-col bg-white dark:bg-gray-900 overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-md mx-auto relative">
        <div className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-transparent transition-all">
          <AppHeader
            title="Recordatorios"
            className="shadow-none bg-transparent pt-[max(1rem,env(safe-area-inset-top))] pb-2 relative z-20 border-none"
            titleClassName="text-[#054A91] dark:text-white"
            leftAction={
              <Link to="/pending-doses" search={{ view: "today" }}>
                <div className="flex size-12 items-center justify-center">
                  <ChevronLeft className="w-8 h-8 text-[#054A91] dark:text-[#81A4CD]" />
                </div>
              </Link>
            }
          />
        </div>

        <div className="flex-1 pb-32 w-full">{children}</div>
      </div>

      <BottomNavigation />
    </div>
  );
}
