import { PendingDosesLayout } from "../components/PendingDosesLayout";
import { TodayTab } from "../components/TodayTab";
import { WeekTab } from "../components/WeekTab";
import { Route } from "@/routes/pending-doses";

export function PendingDosesPage() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const activeTab = search.view;

  const handleTabChange = (view: "today" | "week") => {
    navigate({
      search: (old) => ({ ...old, view }),
      replace: true,
    });
  };

  return (
    <PendingDosesLayout>
      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#F7F9FC] dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700">
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-colors ${
              activeTab === "today"
                ? "bg-[#054A91] shadow-sm text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => handleTabChange("today")}
          >
            <span className="truncate">Hoy</span>
            <input
              type="radio"
              name="view-toggle"
              value="today"
              className="invisible w-0"
              checked={activeTab === "today"}
              readOnly
            />
          </label>
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-colors ${
              activeTab === "week"
                ? "bg-[#054A91] shadow-sm text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => handleTabChange("week")}
          >
            <span className="truncate">Semana</span>
            <input
              type="radio"
              name="view-toggle"
              value="week"
              className="invisible w-0"
              checked={activeTab === "week"}
              readOnly
            />
          </label>
        </div>
      </div>

      {activeTab === "today" ? <TodayTab /> : <WeekTab />}
    </PendingDosesLayout>
  );
}
