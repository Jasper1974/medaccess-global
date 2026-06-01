const DEFAULT_BASE = "https://clinicaltrials.gov/api/v2";

export interface CtGovStudy {
  protocolSection?: {
    identificationModule?: {
      nctId?: string;
      briefTitle?: string;
      officialTitle?: string;
    };
    statusModule?: {
      overallStatus?: string;
      startDateStruct?: { date?: string };
      primaryCompletionDateStruct?: { date?: string };
      completionDateStruct?: { date?: string };
    };
    conditionsModule?: {
      conditions?: string[];
    };
    designModule?: {
      phases?: string[];
    };
    descriptionModule?: {
      briefSummary?: string;
      detailedDescription?: string;
    };
    eligibilityModule?: {
      eligibilityCriteria?: string;
    };
    armsInterventionsModule?: {
      interventions?: Array<{ name?: string; type?: string }>;
    };
    contactsLocationsModule?: {
      locations?: Array<{ city?: string; state?: string; country?: string }>;
      centralContacts?: Array<{ name?: string; phone?: string; email?: string }>;
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name?: string };
    };
  };
}

export interface CtGovStudiesResponse {
  studies?: CtGovStudy[];
  nextPageToken?: string;
}

export interface FetchStudiesOptions {
  conditionQuery: string;
  pageSize?: number;
  maxPages?: number;
  baseUrl?: string;
}

function getBaseUrl(): string {
  return process.env.CLINICALTRIALS_API_BASE?.replace(/\/$/, "") ?? DEFAULT_BASE;
}

async function fetchStudiesPage(
  params: URLSearchParams,
  baseUrl: string,
): Promise<CtGovStudiesResponse> {
  const url = `${baseUrl}/studies?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`ClinicalTrials.gov API ${response.status}: ${url}`);
  }

  return (await response.json()) as CtGovStudiesResponse;
}

export async function fetchRecruitingStudiesInChina(
  options: FetchStudiesOptions,
): Promise<CtGovStudy[]> {
  const baseUrl = options.baseUrl ?? getBaseUrl();
  const pageSize = options.pageSize ?? 50;
  const maxPages = options.maxPages ?? 3;
  const studies: CtGovStudy[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < maxPages; page += 1) {
    const params = new URLSearchParams({
      format: "json",
      pageSize: String(pageSize),
      "filter.overallStatus": "RECRUITING",
      "query.locn": "China",
      "query.cond": options.conditionQuery,
    });

    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const data = await fetchStudiesPage(params, baseUrl);
    studies.push(...(data.studies ?? []));
    pageToken = data.nextPageToken;

    if (!pageToken) break;

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return studies;
}

export function getStudyNctId(study: CtGovStudy): string | null {
  return study.protocolSection?.identificationModule?.nctId ?? null;
}
