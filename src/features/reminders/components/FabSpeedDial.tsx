import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Zap, Pill } from "lucide-react";
import { SosDoseDrawer } from "@/features/pending-doses/components/SosDoseDrawer";

export function FabSpeedDial() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
        {/* Menu Items */}
        {isOpen && (
          <div className="flex flex-col items-end gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200">
            {/* Quick Dose Action */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-md border border-gray-100 dark:border-gray-700/50">
                Toma Rápida
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsSosOpen(true);
                }}
                className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg hover:brightness-110 transition-all active:scale-95"
              >
                <Zap className="w-6 h-6 fill-current" />
              </button>
            </div>

            {/* New Reminder Action */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-md border border-gray-100 dark:border-gray-700/50">
                Nuevo Recordatorio
              </span>
              <Link
                to="/reminders/create"
                onClick={() => setIsOpen(false)}
                className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#054A91] to-[#043d7a] text-white shadow-lg hover:brightness-110 transition-all active:scale-95"
              >
                <Pill className="w-6 h-6" />
              </Link>
            </div>
          </div>
        )}

        {/* Main Trigger Button */}
        <button
          onClick={toggleOpen}
          className={`relative flex size-14 cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-xl transition-all duration-300 ease-spring ${
            isOpen
              ? "bg-gray-600 rotate-180 scale-90"
              : "bg-[#00B8A5] hover:bg-[#00a392]"
          } text-white`}
        >
          <Plus
            className={`w-8 h-8 transition-transform duration-300 ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* Embedded Drawer */}
      <SosDoseDrawer open={isSosOpen} onOpenChange={setIsSosOpen} />

      {/* Backdrop to close menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
