import type { ClinicalTrial } from "@prisma/client";
import type { ClinicalTrialRecord, TrialSource, TrialStatus } from "@/types/trial";

function formatDate(value: Date | null): string | null {
  if (!value) return null;
  return value.toISOString().slice(0, 10);
}

function asTrialSource(value: string): TrialSource {
  return value === "chictr" ? "chictr" : "clinicaltrials";
}

function asTrialStatus(value: string): TrialStatus {
  if (value === "suspended" || value === "completed") return value;
  return "recruiting";
}

export function mapClinicalTrial(row: ClinicalTrial): ClinicalTrialRecord {
  return {
    id: row.id,
    sourceId: row.sourceId,
    source: asTrialSource(row.source),
    title: row.title,
    diseaseSlugs: row.diseaseSlugs,
    diseaseLabel: row.diseaseLabel,
    phase: row.phase,
    locations: row.locations,
    status: asTrialStatus(row.status),
    isFree: row.isFree,
    freeLabel: row.freeLabel ?? undefined,
    crawledAt: formatDate(row.crawledAt) ?? "",
    recruitmentEndDate: formatDate(row.recruitmentEndDate),
    startDate: formatDate(row.startDate),
    summary: row.summary,
    eligibility: row.eligibility,
    intervention: row.intervention,
    sponsor: row.sponsor,
    contactInfo: row.contactInfo,
  };
}
