import hkmoCatalogSource from "@/data/sources/hkmo-catalog.json";
import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";
import { filterByDisease } from "@/lib/sources/filter";
import type { HkmoCatalogRecord } from "@/types/catalog";
import { mapHkmoCatalogItem, mapHkmoFromSource } from "./mapper";

const DISEASE_FILTER_OR = (diseaseSlug: string) => ({
  OR: [
    { diseaseSlugs: { has: diseaseSlug } },
    { diseaseSlugs: { has: "other-unspecified" } },
  ],
});

const FALLBACK_ITEMS: HkmoCatalogRecord[] = hkmoCatalogSource.map((item) =>
  mapHkmoFromSource(item as Omit<HkmoCatalogRecord, "id">),
);

export async function listHkmoByDisease(
  diseaseSlug: string,
): Promise<HkmoCatalogRecord[]> {
  if (!isDatabaseConfigured()) {
    return filterByDisease(FALLBACK_ITEMS, diseaseSlug);
  }

  try {
    const rows = await prisma.hkmoCatalogItem.findMany({
      where: DISEASE_FILTER_OR(diseaseSlug),
      orderBy: { crawledAt: "desc" },
    });
    return rows.map(mapHkmoCatalogItem);
  } catch (error) {
    console.error("[hkmo] listHkmoByDisease failed, using source JSON:", error);
    return filterByDisease(FALLBACK_ITEMS, diseaseSlug);
  }
}

export async function getHkmoById(
  id: string,
): Promise<HkmoCatalogRecord | undefined> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_ITEMS.find((item) => item.id === id || item.sourceId === id);
  }

  try {
    const row = await prisma.hkmoCatalogItem.findFirst({
      where: { OR: [{ id }, { sourceId: id }] },
    });
    return row ? mapHkmoCatalogItem(row) : undefined;
  } catch (error) {
    console.error("[hkmo] getHkmoById failed, using source JSON:", error);
    return FALLBACK_ITEMS.find((item) => item.id === id || item.sourceId === id);
  }
}

export async function countHkmoByDisease(diseaseSlug: string): Promise<number> {
  const items = await listHkmoByDisease(diseaseSlug);
  return items.length;
}

export async function listRecentHkmo(limit = 6): Promise<HkmoCatalogRecord[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_ITEMS.filter((item) => item.status === "active").slice(0, limit);
  }

  try {
    const rows = await prisma.hkmoCatalogItem.findMany({
      where: { status: "active" },
      orderBy: { crawledAt: "desc" },
      take: limit,
    });
    return rows.map(mapHkmoCatalogItem);
  } catch (error) {
    console.error("[hkmo] listRecentHkmo failed, using source JSON:", error);
    return FALLBACK_ITEMS.filter((item) => item.status === "active").slice(0, limit);
  }
}
