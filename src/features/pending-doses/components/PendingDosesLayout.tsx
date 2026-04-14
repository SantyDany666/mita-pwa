import { ReactNode, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MoreVertical } from "lucide-react";
import { AppHeader } from "@/components/ui/AppHeader";
import { BottomNavigation } from "@/components/ui/BottomNavigation";

interface PendingDosesLayoutProps {
  children: ReactNode;
  headerContent?: ReactNode;
  title?: string;
}

export function PendingDosesLayout({
  children,
  headerContent,
  title = "Dosis Pendientes",
}: PendingDosesLayoutProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex h-dvh w-full flex-col bg-white dark:bg-gray-900 overflow-hidden font-sans">
      {/* Scrollable Area for Header + Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-md mx-auto relative">
        {/* Unified Sticky Header Container */}
        <div className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-transparent transition-all">
          <AppHeader
            title={title}
            className="shadow-none bg-transparent pt-[max(1rem,env(safe-area-inset-top))] pb-2 relative z-20 border-none"
            titleClassName="text-[#054A91] dark:text-white"
            leftAction={<div />}
            rightAction={
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-transparent text-[#054A91] dark:text-[#81A4CD]"
                >
                  <MoreVertical className="w-6 h-6" />
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30 bg-transparent"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute top-12 right-0 z-40 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate({ to: "/reminders" });
                        }}
                      >
                        Ver Recordatorios
                      </button>
                    </div>
                  </>
                )}
              </div>
            }
          />
          {/* Sub-header Content (Calendar, Filters, etc.) */}
          {headerContent && (
            <div className="relative z-10">{headerContent}</div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-32 w-full">{children}</div>
      </div>

      <BottomNavigation />
    </div>
  );
}
