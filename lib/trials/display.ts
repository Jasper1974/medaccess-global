import type { ClinicalTrialRecord } from "@/types/trial";

export function isMostlyChinese(text: string): boolean {
  if (!text.trim()) return false;
  const chineseChars = text.match(/[\u4e00-\u9fff]/g);
  return (chineseChars?.length ?? 0) >= text.length * 0.25;
}

export function getTrialDisplayTitle(trial: ClinicalTrialRecord): string {
  return trial.titleCn?.trim() || trial.title;
}

export function getTrialDisplaySummary(trial: ClinicalTrialRecord): string {
  return trial.summaryCn?.trim() || trial.summary;
}

export function getTrialDisplayEligibility(trial: ClinicalTrialRecord): string {
  return trial.eligibilityCn?.trim() || trial.eligibility;
}

export function hasOriginalEnglish(trial: ClinicalTrialRecord): boolean {
  return Boolean(
    (trial.titleCn && trial.titleCn !== trial.title) ||
      (trial.summaryCn && trial.summaryCn !== trial.summary) ||
      (trial.eligibilityCn && trial.eligibilityCn !== trial.eligibility),
  );
}

export function getTrialSearchText(trial: ClinicalTrialRecord): string {
  return [
    trial.sourceId,
    trial.title,
    trial.titleCn,
    trial.diseaseLabel,
    trial.summaryCn,
    trial.intervention,
  ]
    .filter(Boolean)
    .join(" ");
}
