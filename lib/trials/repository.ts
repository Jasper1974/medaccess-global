import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";
import {
  MOCK_TRIALS,
  filterByDisease,
} from "@/lib/mock/hub-data";
import type { ClinicalTrialRecord } from "@/types/trial";
import { mapClinicalTrial } from "./mapper";

const DISEASE_FILTER_OR = (diseaseSlug: string) => ({
  OR: [
    { diseaseSlugs: { has: diseaseSlug } },
    { diseaseSlugs: { has: "other-unspecified" } },
  ],
});

function mockTrialsForDisease(diseaseSlug: string): ClinicalTrialRecord[] {
  return filterByDisease(MOCK_TRIALS, diseaseSlug);
}

function mockTrialById(id: string): ClinicalTrialRecord | undefined {
  return MOCK_TRIALS.find((trial) => trial.id === id);
}

export async function listTrialsByDisease(
  diseaseSlug: string,
): Promise<ClinicalTrialRecord[]> {
  if (!isDatabaseConfigured()) {
    return mockTrialsForDisease(diseaseSlug);
  }

  try {
    const rows = await prisma.clinicalTrial.findMany({
      where: DISEASE_FILTER_OR(diseaseSlug),
      orderBy: { crawledAt: "desc" },
    });
    return rows.map(mapClinicalTrial);
  } catch (error) {
    console.error("[trials] listTrialsByDisease failed, using mock:", error);
    return mockTrialsForDisease(diseaseSlug);
  }
}

export async function getTrialById(
  id: string,
): Promise<ClinicalTrialRecord | undefined> {
  if (!isDatabaseConfigured()) {
    return mockTrialById(id);
  }

  try {
    const row = await prisma.clinicalTrial.findUnique({ where: { id } });
    return row ? mapClinicalTrial(row) : undefined;
  } catch (error) {
    console.error("[trials] getTrialById failed, using mock:", error);
    return mockTrialById(id);
  }
}

export async function countTrialsByDisease(diseaseSlug: string): Promise<number> {
  const trials = await listTrialsByDisease(diseaseSlug);
  return trials.length;
}

export async function listRecentTrials(
  limit = 5,
): Promise<ClinicalTrialRecord[]> {
  if (!isDatabaseConfigured()) {
    return MOCK_TRIALS.slice(0, limit);
  }

  try {
    const rows = await prisma.clinicalTrial.findMany({
      where: { status: "recruiting" },
      orderBy: { crawledAt: "desc" },
      take: limit,
    });
    return rows.map(mapClinicalTrial);
  } catch (error) {
    console.error("[trials] listRecentTrials failed, using mock:", error);
    return MOCK_TRIALS.slice(0, limit);
  }
}
