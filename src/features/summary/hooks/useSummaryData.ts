import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@/store/profile.store";
import { summaryService, SummaryEventType } from "../services/summary.service";
import { startOfDay, endOfDay, subDays } from "date-fns";

export const useSummaryData = () => {
  const { currentProfile } = useProfileStore();
  
  // Date State
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  });

  // Filter Categories State
  const [selectedCategories, setSelectedCategories] = useState<SummaryEventType[]>([
    "dose",
    "symptom",
    "mood",
  ]);

  const summaryQuery = useQuery({
    queryKey: ["summary", currentProfile?.id, dateRange.start.toISOString(), dateRange.end.toISOString()],
    queryFn: () => {
      if (!currentProfile) return null;
      return summaryService.getSummary(currentProfile.id, dateRange.start, dateRange.end);
    },
    enabled: !!currentProfile,
  });

  const toggleCategory = (category: SummaryEventType) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const setPreset = (preset: "today" | "last7" | "last30") => {
    const end = endOfDay(new Date());
    let start = startOfDay(new Date());

    if (preset === "last7") {
      start = startOfDay(subDays(new Date(), 7));
    } else if (preset === "last30") {
      start = startOfDay(subDays(new Date(), 30));
    }

    setDateRange({ start, end });
  };

  return {
    data: summaryQuery.data,
    isLoading: summaryQuery.isLoading,
    dateRange,
    setDateRange,
    setPreset,
    selectedCategories,
    toggleCategory,
    currentProfile,
  };
};
