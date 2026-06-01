export type CharityProgramStatus = "active" | "closed";

export interface CharityProgramRecord {
  id: string;
  source: string;
  sourceId: string;
  drugName: string;
  company: string;
  indication: string;
  diseaseLabel: string;
  diseaseSlugs: string[];
  benefit: string;
  status: CharityProgramStatus;
  summary: string;
  eligibility: string;
  applicationProcess: string;
  officialUrl: string | null;
  contactInfo: string;
  crawledAt: string;
}
