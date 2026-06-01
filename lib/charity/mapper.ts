import type { CharityProgram } from "@prisma/client";
import type { CharityProgramRecord } from "@/types/charity";

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function asStatus(value: string): CharityProgramRecord["status"] {
  return value === "closed" ? "closed" : "active";
}

export function mapCharityProgram(row: CharityProgram): CharityProgramRecord {
  return {
    id: row.id,
    source: row.source,
    sourceId: row.sourceId,
    drugName: row.drugName,
    company: row.company,
    indication: row.indication,
    diseaseLabel: row.diseaseLabel,
    diseaseSlugs: row.diseaseSlugs,
    benefit: row.benefit,
    status: asStatus(row.status),
    summary: row.summary,
    eligibility: row.eligibility,
    applicationProcess: row.applicationProcess,
    officialUrl: row.officialUrl,
    contactInfo: row.contactInfo,
    crawledAt: formatDate(row.crawledAt),
  };
}

export function mapCharityFromSource(
  item: Omit<CharityProgramRecord, "id"> & { id?: string },
): CharityProgramRecord {
  return {
    id: item.id ?? item.sourceId,
    source: item.source,
    sourceId: item.sourceId,
    drugName: item.drugName,
    company: item.company,
    indication: item.indication,
    diseaseLabel: item.diseaseLabel,
    diseaseSlugs: item.diseaseSlugs,
    benefit: item.benefit,
    status: item.status,
    summary: item.summary,
    eligibility: item.eligibility,
    applicationProcess: item.applicationProcess,
    officialUrl: item.officialUrl,
    contactInfo: item.contactInfo,
    crawledAt: item.crawledAt,
  };
}
