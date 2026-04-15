import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
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

/** Converts a Blob to a base64 string (required by Capacitor Filesystem) */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // result is "data:application/pdf;base64,XXXX" — strip the prefix
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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

      const from = format(dateRange.start, "yyyyMMdd");
      const to = format(dateRange.end, "yyyyMMdd");
      const filename = `MITA_Reporte_${patientName.replace(/\s+/g, "_")}_${from}-${to}.pdf`;

      if (Capacitor.isNativePlatform()) {
        // ── Mobile: save to cache then share natively ──────────────────────
        const base64 = await blobToBase64(blob);

        const writeResult = await Filesystem.writeFile({
          path: filename,
          data: base64,
          directory: Directory.Cache,
        });

        await Share.share({
          title: `Reporte MITA — ${patientName}`,
          text: "Reporte médico generado con MITA App.",
          url: writeResult.uri,
          dialogTitle: "Compartir reporte PDF",
        });
      } else {
        // ── Desktop / browser: standard anchor download ─────────────────────
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        toast.success("Reporte exportado correctamente");
      }
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
