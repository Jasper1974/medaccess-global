import type { ClinicalTrialRecord } from "@/types/trial";

export function getTrialFilterOptions(trials: ClinicalTrialRecord[]) {
  const locations = [...new Set(trials.flatMap((t) => t.locations))].sort();
  const phases = [...new Set(trials.map((t) => t.phase))].sort();
  const diseaseLabels = [...new Set(trials.map((t) => t.diseaseLabel))].sort();
  const sources = [...new Set(trials.map((t) => t.source))].sort();
  return { locations, phases, diseaseLabels, sources };
}
