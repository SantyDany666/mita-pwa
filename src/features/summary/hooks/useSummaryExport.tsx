import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { SummaryData, SummaryEventType } from "../services/summary.service";
import { buildSummaryPdfData } from "../utils/summary-pdf-data";
import { SummaryPdfDocument } from "../components/SummaryPdfDocument";
import { format } from "date-fns";

interface UseSummaryExportOptions {
  data: SummaryData | null | undefined;
  patientName: string;
  dateRange: { start: Date; end: Date };
  selectedCategories: SummaryEventType[];
}

export function useSummaryExport({
  data,
  patientName,
  dateRange,
  selectedCategories,
}: UseSummaryExportOptions) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async () => {
    if (!data) return;

    setIsExporting(true);
    try {
      const pdfData = buildSummaryPdfData(
        data,
        patientName,
        dateRange,
        selectedCategories,
      );

      const blob = await pdf(
        <SummaryPdfDocument data={pdfData} />,
      ).toBlob();

      // Build a descriptive filename for the doctor
      const from = format(dateRange.start, "yyyyMMdd");
      const to = format(dateRange.end, "yyyyMMdd");
      const filename = `MITA_Reporte_${patientName.replace(/\s+/g, "_")}_${from}-${to}.pdf`;

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Reporte exportado correctamente");
    } catch (err) {
      console.error("[useSummaryExport] Error generating PDF:", err);
      toast.error("No se pudo generar el reporte. Intenta de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  const hasData =
    !!data &&
    (data.doses.length > 0 ||
      data.symptoms.length > 0 ||
      data.moods.length > 0);

  return { exportToPdf, isExporting, hasData };
}
