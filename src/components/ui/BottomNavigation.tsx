import { Link, useRouterState } from "@tanstack/react-router";
import { Calendar, BarChart2, Bot, User, Plus } from "lucide-react";
import { useState } from "react";
import { GlobalActionDrawer } from "./GlobalActionDrawer";

export function BottomNavigation() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);

  const isActive = (path: string) => currentPath.startsWith(path);

  return (
    <>
      <div className="fixed bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-[max(0.5rem,env(safe-area-inset-bottom))] z-40 flex justify-center left-0 right-0 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] dark:shadow-none">
        <div className="flex items-center justify-between px-2 h-16 w-full max-w-md relative">
          {/* Tab 1: Hoy */}
          <Link
            to="/pending-doses"
            search={{ view: "today" }}
            className={`flex flex-col items-center justify-center gap-1 w-[20%] transition-colors ${
              isActive("/pending-doses")
                ? "text-[#054A91] dark:text-[#81A4CD]"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
          >
            <Calendar
              className="w-6 h-6"
              fill={isActive("/pending-doses") ? "currentColor" : "none"}
              fillOpacity={isActive("/pending-doses") ? 0.2 : 0}
            />
            <span className="text-[10px] font-medium leading-none">Hoy</span>
          </Link>

          {/* Tab 2: Resumen */}
          <Link
            to="/summary"
            className={`flex flex-col items-center justify-center gap-1 w-[20%] transition-colors ${
              isActive("/summary")
                ? "text-[#054A91] dark:text-[#81A4CD]"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
          >
            <BarChart2
              className="w-6 h-6"
              fill={isActive("/summary") ? "currentColor" : "none"}
              fillOpacity={isActive("/summary") ? 0.2 : 0}
            />
            <span className="text-[10px] font-medium leading-none">
              Resumen
            </span>
          </Link>

          {/* Tab 3: FAB CENTRAL (Acción Global) */}
          <div className="w-[20%] flex justify-center items-center relative">
            <button
              onClick={() => setIsActionDrawerOpen(true)}
              className="absolute -top-7 flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#00B8A5] text-white shadow-lg shadow-[#00B8A5]/30 hover:bg-[#00a392] active:scale-95 transition-all outline-none focus:ring-4 focus:ring-[#00B8A5]/20"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>

          {/* Tab 4: Chatbot */}
          <a
            href="#"
            className="flex flex-col items-center justify-center gap-1 w-[20%] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <Bot className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">
              Chatbot
            </span>
          </a>

          {/* Tab 5: Perfil */}
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center gap-1 w-[20%] transition-colors ${
              isActive("/profile")
                ? "text-[#054A91] dark:text-[#81A4CD]"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
          >
            <User
              className="w-6 h-6"
              fill={isActive("/profile") ? "currentColor" : "none"}
              fillOpacity={isActive("/profile") ? 0.2 : 0}
            />
            <span className="text-[10px] font-medium leading-none">Perfil</span>
          </Link>
        </div>
      </div>

      <GlobalActionDrawer
        open={isActionDrawerOpen}
        onOpenChange={setIsActionDrawerOpen}
      />
    </>
  );
}
