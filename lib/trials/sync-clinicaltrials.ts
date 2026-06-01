import type { Prisma } from "@prisma/client";
import { ALL_DISEASES } from "@/lib/diseases/catalog";
import { prisma } from "@/lib/db/prisma";
import {
  fetchRecruitingStudiesInChina,
  getStudyNctId,
  type CtGovStudy,
} from "./clinicaltrials-api";
import {
  buildConditionQueryForDisease,
  matchDiseasesFromText,
} from "./disease-mapper";
import { isTranslationConfigured, translateTrialContent } from "./translate";

export interface SyncClinicalTrialsOptions {
  diseaseSlug?: string;
  dryRun?: boolean;
  skipTranslate?: boolean;
  pageSize?: number;
  maxPages?: number;
}

export interface SyncClinicalTrialsResult {
  fetched: number;
  upserted: number;
  skipped: number;
  errors: string[];
  diseaseSlugs: string[];
}

function parsePartialDate(value?: string): Date | null {
  if (!value) return null;
  const normalized = value.length === 7 ? `${value}-01` : value;
  const date = new Date(`${normalized}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapPhase(phases?: string[]): string {
  if (!phases?.length) return "未分期";
  const labels = phases.map((phase) => {
    switch (phase) {
      case "PHASE1":
        return "I期";
      case "PHASE2":
        return "II期";
      case "PHASE3":
        return "III期";
      case "PHASE4":
        return "IV期";
      case "EARLY_PHASE1":
        return "I期";
      default:
        return null;
    }
  }).filter(Boolean);

  if (labels.length === 0) return "未分期";
  if (labels.length === 1) return labels[0] as string;
  return labels.join("/");
}

function mapStatus(value?: string): string {
  switch (value) {
    case "RECRUITING":
    case "NOT_YET_RECRUITING":
    case "ENROLLING_BY_INVITATION":
    case "AVAILABLE":
      return "recruiting";
    case "SUSPENDED":
    case "WITHDRAWN":
    case "TERMINATED":
      return "suspended";
    case "COMPLETED":
      return "completed";
    default:
      return "recruiting";
  }
}

function extractLocations(study: CtGovStudy): string[] {
  const locations =
    study.protocolSection?.contactsLocationsModule?.locations ?? [];
  const chinaLocations = locations
    .filter((loc) => loc.country?.toLowerCase() === "china")
    .map((loc) => [loc.city, loc.state].filter(Boolean).join(" "))
    .filter(Boolean);

  if (chinaLocations.length > 0) {
    return [...new Set(chinaLocations)];
  }

  const countries = [
    ...new Set(
      locations
        .map((loc) => loc.country)
        .filter((country): country is string => Boolean(country)),
    ),
  ];
  return countries.length > 0 ? countries : ["中国"];
}

function extractContactInfo(study: CtGovStudy): string {
  const contacts =
    study.protocolSection?.contactsLocationsModule?.centralContacts ?? [];
  const formatted = contacts
    .map((contact) =>
      [contact.name, contact.phone, contact.email].filter(Boolean).join(" · "),
    )
    .filter(Boolean);

  return formatted.length > 0
    ? formatted.join("；")
    : "见 ClinicalTrials.gov 公示联系方式";
}

function extractIntervention(study: CtGovStudy): string {
  const interventions =
    study.protocolSection?.armsInterventionsModule?.interventions ?? [];
  return interventions
    .map((item) => item.name)
    .filter(Boolean)
    .join("；");
}

function mapStudyToUpsertInput(
  study: CtGovStudy,
  fallbackDiseaseSlug?: string,
): Prisma.ClinicalTrialCreateInput | null {
  const section = study.protocolSection;
  const nctId = getStudyNctId(study);
  if (!nctId || !section) return null;

  const title =
    section.identificationModule?.briefTitle ??
    section.identificationModule?.officialTitle ??
    nctId;

  const conditions = section.conditionsModule?.conditions ?? [];
  const matched = matchDiseasesFromText([
    title,
    ...conditions,
    extractIntervention(study),
  ]);

  const diseaseSlugs =
    fallbackDiseaseSlug && !matched.diseaseSlugs.includes(fallbackDiseaseSlug)
      ? [...new Set([fallbackDiseaseSlug, ...matched.diseaseSlugs])]
      : matched.diseaseSlugs;

  const summary =
    section.descriptionModule?.briefSummary?.trim() ||
    section.descriptionModule?.detailedDescription?.trim() ||
    "暂无试验简介。";

  const eligibility =
    section.eligibilityModule?.eligibilityCriteria?.trim() ||
    "详见 ClinicalTrials.gov 入组条件。";

  const now = new Date();

  return {
    source: "clinicaltrials",
    sourceId: nctId,
    title,
    diseaseSlugs,
    diseaseLabel: matched.diseaseLabel,
    phase: mapPhase(section.designModule?.phases),
    status: mapStatus(section.statusModule?.overallStatus),
    locations: extractLocations(study),
    eligibility: eligibility.slice(0, 4000),
    summary: summary.slice(0, 4000),
    intervention: extractIntervention(study) || "未公示",
    sponsor:
      section.sponsorCollaboratorsModule?.leadSponsor?.name?.trim() || "未公示",
    contactInfo: extractContactInfo(study),
    isFree: true,
    freeLabel: "免费用药",
    crawledAt: now,
    recruitmentEndDate:
      parsePartialDate(section.statusModule?.primaryCompletionDateStruct?.date) ??
      parsePartialDate(section.statusModule?.completionDateStruct?.date),
    startDate: parsePartialDate(section.statusModule?.startDateStruct?.date),
  };
}

async function upsertStudy(
  study: CtGovStudy,
  fallbackDiseaseSlug: string | undefined,
  options: { dryRun: boolean; skipTranslate: boolean },
): Promise<"upserted" | "skipped"> {
  const input = mapStudyToUpsertInput(study, fallbackDiseaseSlug);
  if (!input) return "skipped";

  if (options.dryRun) return "upserted";

  const existing = await prisma.clinicalTrial.findUnique({
    where: { sourceId: input.sourceId },
    select: {
      title: true,
      titleCn: true,
      summaryCn: true,
      eligibilityCn: true,
    },
  });

  let titleCn = existing?.titleCn ?? null;
  let summaryCn = existing?.summaryCn ?? null;
  let eligibilityCn = existing?.eligibilityCn ?? null;

  const needsTranslation =
    !options.skipTranslate &&
    isTranslationConfigured() &&
    (!existing || !titleCn || existing.title !== input.title);

  if (needsTranslation) {
    try {
      const translated = await translateTrialContent({
        title: input.title,
        summary: input.summary ?? "",
        eligibility: input.eligibility ?? "",
        diseaseLabel: input.diseaseLabel,
      });
      if (translated) {
        titleCn = translated.titleCn;
        summaryCn = translated.summaryCn;
        eligibilityCn = translated.eligibilityCn;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    } catch (error) {
      console.warn(
        `[sync] translation skipped for ${input.sourceId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  await prisma.clinicalTrial.upsert({
    where: { sourceId: input.sourceId },
    create: {
      ...input,
      titleCn,
      summaryCn,
      eligibilityCn,
    },
    update: {
      title: input.title,
      diseaseSlugs: input.diseaseSlugs,
      diseaseLabel: input.diseaseLabel,
      phase: input.phase,
      status: input.status,
      locations: input.locations,
      eligibility: input.eligibility,
      summary: input.summary,
      intervention: input.intervention,
      sponsor: input.sponsor,
      contactInfo: input.contactInfo,
      isFree: input.isFree,
      freeLabel: input.freeLabel,
      crawledAt: input.crawledAt,
      recruitmentEndDate: input.recruitmentEndDate,
      startDate: input.startDate,
      titleCn,
      summaryCn,
      eligibilityCn,
    },
  });

  return "upserted";
}

function getTargetDiseases(diseaseSlug?: string) {
  if (diseaseSlug) {
    const disease = ALL_DISEASES.find((item) => item.slug === diseaseSlug);
    if (!disease) {
      throw new Error(`Unknown disease slug: ${diseaseSlug}`);
    }
    return [disease];
  }

  return ALL_DISEASES.filter((item) => item.slug !== "other-unspecified");
}

export async function syncClinicalTrials(
  options: SyncClinicalTrialsOptions = {},
): Promise<SyncClinicalTrialsResult> {
  const diseases = getTargetDiseases(options.diseaseSlug);
  const seen = new Set<string>();
  const errors: string[] = [];
  let fetched = 0;
  let upserted = 0;
  let skipped = 0;

  for (const disease of diseases) {
    const conditionQuery = buildConditionQueryForDisease(disease);

    try {
      const studies = await fetchRecruitingStudiesInChina({
        conditionQuery,
        pageSize: options.pageSize,
        maxPages: options.maxPages,
      });

      for (const study of studies) {
        const nctId = getStudyNctId(study);
        if (!nctId || seen.has(nctId)) continue;

        seen.add(nctId);
        fetched += 1;

        try {
          const result = await upsertStudy(study, disease.slug, {
            dryRun: Boolean(options.dryRun),
            skipTranslate: Boolean(options.skipTranslate),
          });
          if (result === "upserted") upserted += 1;
          else skipped += 1;
        } catch (error) {
          skipped += 1;
          errors.push(
            `${nctId}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    } catch (error) {
      errors.push(
        `${disease.slug}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return {
    fetched,
    upserted,
    skipped,
    errors,
    diseaseSlugs: diseases.map((disease) => disease.slug),
  };
}
