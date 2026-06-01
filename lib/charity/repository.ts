import charityProgramsSource from "@/data/sources/charity-programs.json";
import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";
import { filterByDisease } from "@/lib/sources/filter";
import type { CharityProgramRecord } from "@/types/charity";
import { mapCharityFromSource, mapCharityProgram } from "./mapper";

const DISEASE_FILTER_OR = (diseaseSlug: string) => ({
  OR: [
    { diseaseSlugs: { has: diseaseSlug } },
    { diseaseSlugs: { has: "other-unspecified" } },
  ],
});

const FALLBACK_PROGRAMS: CharityProgramRecord[] = charityProgramsSource.map(
  (item) => mapCharityFromSource(item as Omit<CharityProgramRecord, "id">),
);

function mockProgramsForDisease(diseaseSlug: string): CharityProgramRecord[] {
  return filterByDisease(FALLBACK_PROGRAMS, diseaseSlug);
}

function mockProgramById(id: string): CharityProgramRecord | undefined {
  return FALLBACK_PROGRAMS.find(
    (program) => program.id === id || program.sourceId === id,
  );
}

export async function listCharityByDisease(
  diseaseSlug: string,
): Promise<CharityProgramRecord[]> {
  if (!isDatabaseConfigured()) {
    return mockProgramsForDisease(diseaseSlug);
  }

  try {
    const rows = await prisma.charityProgram.findMany({
      where: DISEASE_FILTER_OR(diseaseSlug),
      orderBy: { crawledAt: "desc" },
    });
    return rows.map(mapCharityProgram);
  } catch (error) {
    console.error("[charity] listCharityByDisease failed, using source JSON:", error);
    return mockProgramsForDisease(diseaseSlug);
  }
}

export async function getCharityById(
  id: string,
): Promise<CharityProgramRecord | undefined> {
  if (!isDatabaseConfigured()) {
    return mockProgramById(id);
  }

  try {
    const row = await prisma.charityProgram.findFirst({
      where: { OR: [{ id }, { sourceId: id }] },
    });
    return row ? mapCharityProgram(row) : undefined;
  } catch (error) {
    console.error("[charity] getCharityById failed, using source JSON:", error);
    return mockProgramById(id);
  }
}

export async function countCharityByDisease(diseaseSlug: string): Promise<number> {
  const programs = await listCharityByDisease(diseaseSlug);
  return programs.length;
}

export async function listRecentCharity(
  limit = 6,
): Promise<CharityProgramRecord[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_PROGRAMS.filter((program) => program.status === "active").slice(
      0,
      limit,
    );
  }

  try {
    const rows = await prisma.charityProgram.findMany({
      where: { status: "active" },
      orderBy: { crawledAt: "desc" },
      take: limit,
    });
    return rows.map(mapCharityProgram);
  } catch (error) {
    console.error("[charity] listRecentCharity failed, using source JSON:", error);
    return FALLBACK_PROGRAMS.filter((program) => program.status === "active").slice(
      0,
      limit,
    );
  }
}

export async function listAllCharityPrograms(): Promise<CharityProgramRecord[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_PROGRAMS;
  }

  try {
    const rows = await prisma.charityProgram.findMany({
      orderBy: { crawledAt: "desc" },
    });
    return rows.map(mapCharityProgram);
  } catch (error) {
    console.error("[charity] listAllCharityPrograms failed, using source JSON:", error);
    return FALLBACK_PROGRAMS;
  }
}
