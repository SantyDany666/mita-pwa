import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ─── Font Registration ───────────────────────────────────────────────────────
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-italic.ttf",
      fontStyle: "italic",
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-normal.ttf",
      fontWeight: "bold",
    },
  ],
});

import { SummaryPdfData, PdfEventRow } from "../utils/summary-pdf-data";

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  primary: "#054A91",
  primaryLight: "#EEF4FB",
  text: "#1a2333",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
  taken: "#059669",
  takenBg: "#ECFDF5",
  skipped: "#9CA3AF",
  skippedBg: "#F9FAFB",
  symptomColor: "#C2410C",
  symptomBg: "#FFF7ED",
  moodColor: "#7C3AED",
  moodBg: "#F5F3FF",
  statBg: "#F0F6FF",
  headerBg: "#054A91",
  sectionBg: "#F8FAFC",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    backgroundColor: C.white,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
    fontSize: 9,
    color: C.text,
  },

  // Header
  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: 36,
    paddingTop: 32,
    paddingBottom: 28,
  },
  headerBrand: {
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.white,
    letterSpacing: 2,
    marginBottom: 12,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginBottom: 12,
  },
  headerMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerPatient: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.white,
    marginBottom: 3,
  },
  headerSub: {
    fontSize: 8,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerPeriodLabel: {
    fontSize: 7,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerPeriod: {
    fontSize: 9,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.white,
  },

  // Body container
  body: {
    paddingHorizontal: 36,
    paddingTop: 24,
  },

  // Section title
  sectionTitle: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.primary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: C.statBg,
    borderRadius: 6,
    padding: 10,
    borderLeft: "3px solid #054A91",
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 7,
    color: C.textMuted,
    letterSpacing: 0.5,
  },
  statSub: {
    fontSize: 7,
    color: C.textMuted,
    marginTop: 2,
  },

  // Day group
  dayGroup: {
    marginBottom: 20,
  },
  dayHeader: {
    backgroundColor: C.sectionBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
    borderLeft: "3px solid #054A91",
  },
  dayHeaderText: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.primary,
    letterSpacing: 0.5,
    textTransform: "capitalize",
  },

  // Event rows
  eventRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottom: "1px solid #E5E7EB",
    gap: 10,
  },
  eventTime: {
    width: 30,
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.textMuted,
    paddingTop: 1,
  },
  eventBadge: {
    width: 50,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: "center",
  },
  eventBadgeText: {
    fontSize: 6,
    fontFamily: "Roboto",
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 9,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: C.text,
    marginBottom: 2,
  },
  eventNote: {
    fontSize: 8,
    color: C.textMuted,
    fontStyle: "italic",
    lineHeight: 1.4,
  },
  eventStatus: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    paddingTop: 1,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #E5E7EB",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: C.textMuted,
  },
  footerPage: {
    fontSize: 7,
    color: C.textMuted,
  },
});

// ─── Subcomponents ────────────────────────────────────────────────────────────

function DoseRow({ event }: { event: PdfEventRow & { type: "dose" } }) {
  const taken = event.status === "taken";
  return (
    <View style={s.eventRow}>
      <Text style={s.eventTime}>{event.time}</Text>
      <View
        style={[
          s.eventBadge,
          { backgroundColor: taken ? C.takenBg : C.skippedBg },
        ]}
      >
        <Text
          style={[s.eventBadgeText, { color: taken ? C.taken : C.skipped }]}
        >
          Dosis
        </Text>
      </View>
      <View style={s.eventContent}>
        <Text style={s.eventTitle}>{event.medicineName}</Text>
        {event.dosage ? <Text style={s.eventNote}>{event.dosage}</Text> : null}
      </View>
      <Text style={[s.eventStatus, { color: taken ? C.taken : C.skipped }]}>
        {taken
          ? `✓ Tomada${event.takenAt ? ` (${event.takenAt})` : ""}`
          : "✗ Omitida"}
      </Text>
    </View>
  );
}

function SymptomRow({ event }: { event: PdfEventRow & { type: "symptom" } }) {
  return (
    <View style={s.eventRow}>
      <Text style={s.eventTime}>{event.time}</Text>
      <View style={[s.eventBadge, { backgroundColor: C.symptomBg }]}>
        <Text style={[s.eventBadgeText, { color: C.symptomColor }]}>
          Síntoma
        </Text>
      </View>
      <View style={s.eventContent}>
        <Text style={s.eventTitle}>{event.symptom}</Text>
        {event.note ? <Text style={s.eventNote}>{event.note}</Text> : null}
      </View>
      <Text style={[s.eventStatus, { color: C.symptomColor }]}>
        {event.intensityLabel}
      </Text>
    </View>
  );
}

function MoodRow({ event }: { event: PdfEventRow & { type: "mood" } }) {
  return (
    <View style={s.eventRow}>
      <Text style={s.eventTime}>{event.time}</Text>
      <View style={[s.eventBadge, { backgroundColor: C.moodBg }]}>
        <Text style={[s.eventBadgeText, { color: C.moodColor }]}>Ánimo</Text>
      </View>
      <View style={s.eventContent}>
        <Text style={s.eventTitle}>{event.moodLabel}</Text>
        {event.note ? <Text style={s.eventNote}>{event.note}</Text> : null}
      </View>
      <Text style={[s.eventStatus, { color: C.moodColor }]}>
        {event.moodValue}/5
      </Text>
    </View>
  );
}

function EventRow({ event }: { event: PdfEventRow }) {
  if (event.type === "dose") return <DoseRow event={event} />;
  if (event.type === "symptom") return <SymptomRow event={event} />;
  return <MoodRow event={event} />;
}

// ─── Main Document ────────────────────────────────────────────────────────────

interface SummaryPdfDocumentProps {
  data: SummaryPdfData;
}

export function SummaryPdfDocument({ data }: SummaryPdfDocumentProps) {
  const { stats } = data;

  return (
    <Document
      title={`Reporte de Salud — ${data.patientName}`}
      author="MITA App"
      subject="Reporte médico de adherencia, síntomas y estado de ánimo"
      creator="MITA"
    >
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.headerBrand}>MITA</Text>
          <View style={s.headerDivider} />
          <View style={s.headerMetaRow}>
            <View>
              <Text style={s.headerPatient}>{data.patientName}</Text>
              <Text style={s.headerSub}>
                Reporte de Salud — Generado el {data.generatedAt}
              </Text>
            </View>
            <View style={s.headerRight}>
              <Text style={s.headerPeriodLabel}>Periodo</Text>
              <Text style={s.headerPeriod}>{data.periodLabel}</Text>
            </View>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>
          {/* ── Summary Stats ── */}
          <Text style={s.sectionTitle}>Resumen ejecutivo</Text>
          <View style={s.statsGrid}>
            {data.selectedCategories.includes("dose") && (
              <>
                <View style={s.statBox}>
                  <Text style={s.statValue}>
                    {stats.adherencePercent !== null
                      ? `${stats.adherencePercent}%`
                      : "—"}
                  </Text>
                  <Text style={s.statLabel}>Adherencia</Text>
                  <Text style={s.statSub}>
                    {stats.takenDoses} tomadas / {stats.totalDoses} programadas
                  </Text>
                </View>
                <View style={s.statBox}>
                  <Text style={s.statValue}>{stats.skippedDoses}</Text>
                  <Text style={s.statLabel}>Dosis omitidas</Text>
                </View>
              </>
            )}
            {data.selectedCategories.includes("symptom") && (
              <View style={s.statBox}>
                <Text style={s.statValue}>{stats.totalSymptoms}</Text>
                <Text style={s.statLabel}>Síntomas registrados</Text>
              </View>
            )}
            {data.selectedCategories.includes("mood") && (
              <View style={s.statBox}>
                <Text style={s.statValue}>
                  {stats.avgMood !== null ? `${stats.avgMood}/5` : "—"}
                </Text>
                <Text style={s.statLabel}>Ánimo promedio</Text>
                <Text style={s.statSub}>{stats.totalMoods} registros</Text>
              </View>
            )}
          </View>

          {/* ── Chronological Log ── */}
          <Text style={s.sectionTitle}>Registro cronológico</Text>

          {data.days.length === 0 && (
            <Text style={{ color: C.textMuted, fontSize: 9, marginTop: 8 }}>
              No hay registros para el periodo y filtros seleccionados.
            </Text>
          )}

          {data.days.map((day, i) => (
            <View key={i} style={s.dayGroup} wrap={false}>
              <View style={s.dayHeader}>
                <Text style={s.dayHeaderText}>{day.dateLabel}</Text>
              </View>
              {day.events.map((event, j) => (
                <EventRow key={j} event={event} />
              ))}
            </View>
          ))}
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            MITA App — Documento confidencial de uso médico. Paciente:{" "}
            {data.patientName}
          </Text>
          <Text
            style={s.footerPage}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
