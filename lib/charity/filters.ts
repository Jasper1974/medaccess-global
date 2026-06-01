import type { CharityProgramRecord } from "@/types/charity";

export function getCharityFilterOptions(programs: CharityProgramRecord[]) {
  const companies = [...new Set(programs.map((p) => p.company))].sort();
  const diseaseLabels = [...new Set(programs.map((p) => p.diseaseLabel))].sort();
  const benefits = [...new Set(programs.map((p) => p.benefit))].sort();
  return { companies, diseaseLabels, benefits };
}
