import { PrismaClient } from "@prisma/client";
import { MOCK_TRIALS } from "../lib/mock/hub-data";

const prisma = new PrismaClient();

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  return new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  for (const trial of MOCK_TRIALS) {
    await prisma.clinicalTrial.upsert({
      where: { sourceId: trial.sourceId },
      create: {
        id: trial.id,
        source: trial.source,
        sourceId: trial.sourceId,
        title: trial.title,
        diseaseSlugs: trial.diseaseSlugs,
        diseaseLabel: trial.diseaseLabel,
        phase: trial.phase,
        status: trial.status,
        locations: trial.locations,
        eligibility: trial.eligibility,
        summary: trial.summary,
        intervention: trial.intervention,
        sponsor: trial.sponsor,
        contactInfo: trial.contactInfo,
        isFree: trial.isFree,
        freeLabel: trial.freeLabel ?? null,
        crawledAt: parseDate(trial.crawledAt) ?? new Date(),
        recruitmentEndDate: parseDate(trial.recruitmentEndDate),
        startDate: parseDate(trial.startDate),
      },
      update: {
        title: trial.title,
        diseaseSlugs: trial.diseaseSlugs,
        diseaseLabel: trial.diseaseLabel,
        phase: trial.phase,
        status: trial.status,
        locations: trial.locations,
        eligibility: trial.eligibility,
        summary: trial.summary,
        intervention: trial.intervention,
        sponsor: trial.sponsor,
        contactInfo: trial.contactInfo,
        isFree: trial.isFree,
        freeLabel: trial.freeLabel ?? null,
        crawledAt: parseDate(trial.crawledAt) ?? new Date(),
        recruitmentEndDate: parseDate(trial.recruitmentEndDate),
        startDate: parseDate(trial.startDate),
      },
    });
  }

  console.log(`Seeded ${MOCK_TRIALS.length} clinical trials.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
