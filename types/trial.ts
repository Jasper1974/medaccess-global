export type TrialSource = "clinicaltrials" | "chictr";
export type TrialStatus = "recruiting" | "suspended" | "completed";

export interface ClinicalTrialRecord {
  id: string;
  sourceId: string;
  source: TrialSource;
  title: string;
  diseaseSlugs: string[];
  diseaseLabel: string;
  phase: string;
  locations: string[];
  status: TrialStatus;
  isFree: boolean;
  freeLabel?: string;
  crawledAt: string;
  recruitmentEndDate: string | null;
  startDate: string | null;
  summary: string;
  eligibility: string;
  intervention: string;
  sponsor: string;
  contactInfo: string;
}

/** @deprecated use subtitle builder or diseaseLabel */
export function trialSubtitle(trial: ClinicalTrialRecord): string {
  return `${trial.diseaseLabel} · ${trial.phase} · ${trial.locations.join("、")}`;
}
