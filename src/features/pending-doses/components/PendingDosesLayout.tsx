import { ReactNode, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  MoreVertical,
  Plus,
  Calendar,
  BarChart2,
  Bot,
  User,
} from "lucide-react";
import { AppHeader } from "@/components/ui/AppHeader";

interface PendingDosesLayoutProps {
  children: ReactNode;
}

export function PendingDosesLayout({ children }: PendingDosesLayoutProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-gray-900 overflow-x-hidden font-sans">
      {/* Sticky Header */}
      <AppHeader
        title="Dosis Pendientes"
        className="border-gray-100 dark:border-gray-800 shadow-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
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

      {/* Main Content */}
      <div className="flex-1 pb-32">{children}</div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-30">
        <Link
          to="/reminders/create"
          className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#00B8A5] text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-opacity-90"
        >
          <Plus className="w-8 h-8" />
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-2 z-40">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/pending-doses"
            search={{ view: "today" }}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-[#054A91] dark:text-[#81A4CD]"
          >
            <Calendar
              className="w-6 h-6"
              fill="currentColor"
              fillOpacity={0.2}
            />
            <span className="text-[10px] font-medium leading-none">Hoy</span>
          </Link>
          <a
            href="#"
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-[#81A4CD] hover:text-[#054A91] dark:hover:text-white transition-colors"
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">
              Resumen
            </span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-[#81A4CD] hover:text-[#054A91] dark:hover:text-white transition-colors"
          >
            <Bot className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">
              Chatbot
            </span>
          </a>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-[#81A4CD] hover:text-[#054A91] dark:hover:text-white transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
