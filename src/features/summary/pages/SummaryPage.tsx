import { AppHeader } from "@/components/ui/AppHeader";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { useSummaryData } from "../hooks/useSummaryData";
import { SummaryFilters } from "../components/SummaryFilters";
import { SummaryRecordList } from "../components/SummaryRecordList";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryPage() {
  const {
    data,
    isLoading,
    dateRange,
    setDateRange,
    setPreset,
    selectedCategories,
    toggleCategory,
  } = useSummaryData();

  return (
    <div className="flex flex-col min-h-dvh bg-[#F7F9FC] dark:bg-gray-900 transition-colors duration-300">
      <AppHeader
        title="Resumen"
        className="border-none shadow-none bg-[#F7F9FC] dark:bg-gray-900 pt-[max(1rem,env(safe-area-inset-top))] pb-2"
        titleClassName="text-[#054A91] dark:text-white"
        onBack={() => window.history.back()}
      />

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-6 max-w-md mx-auto w-full">
        <SummaryFilters
          dateRange={dateRange}
          onDateChange={setDateRange}
          onPresetChange={setPreset}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
        />

        <div className="pt-2">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl"
                >
                  <Skeleton className="size-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SummaryRecordList
              data={data}
              selectedCategories={selectedCategories}
            />
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
