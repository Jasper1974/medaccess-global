import boaoCatalogSource from "@/data/sources/boao-catalog.json";
import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";
import { filterByDisease } from "@/lib/sources/filter";
import type { BoaoCatalogRecord } from "@/types/catalog";
import { mapBoaoCatalogItem, mapBoaoFromSource } from "./mapper";

const DISEASE_FILTER_OR = (diseaseSlug: string) => ({
  OR: [
    { diseaseSlugs: { has: diseaseSlug } },
    { diseaseSlugs: { has: "other-unspecified" } },
  ],
});

const FALLBACK_ITEMS: BoaoCatalogRecord[] = boaoCatalogSource.map((item) =>
  mapBoaoFromSource(item as Omit<BoaoCatalogRecord, "id">),
);

export async function listBoaoByDisease(
  diseaseSlug: string,
): Promise<BoaoCatalogRecord[]> {
  if (!isDatabaseConfigured()) {
    return filterByDisease(FALLBACK_ITEMS, diseaseSlug);
  }

  try {
    const rows = await prisma.boaoCatalogItem.findMany({
      where: DISEASE_FILTER_OR(diseaseSlug),
      orderBy: { crawledAt: "desc" },
    });
    return rows.map(mapBoaoCatalogItem);
  } catch (error) {
    console.error("[boao] listBoaoByDisease failed, using source JSON:", error);
    return filterByDisease(FALLBACK_ITEMS, diseaseSlug);
  }
}

export async function getBoaoById(
  id: string,
): Promise<BoaoCatalogRecord | undefined> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_ITEMS.find((item) => item.id === id || item.sourceId === id);
  }

  try {
    const row = await prisma.boaoCatalogItem.findFirst({
      where: { OR: [{ id }, { sourceId: id }] },
    });
    return row ? mapBoaoCatalogItem(row) : undefined;
  } catch (error) {
    console.error("[boao] getBoaoById failed, using source JSON:", error);
    return FALLBACK_ITEMS.find((item) => item.id === id || item.sourceId === id);
  }
}

export async function countBoaoByDisease(diseaseSlug: string): Promise<number> {
  const items = await listBoaoByDisease(diseaseSlug);
  return items.length;
}

export async function listRecentBoao(limit = 6): Promise<BoaoCatalogRecord[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_ITEMS.filter((item) => item.status === "active").slice(0, limit);
  }

  try {
    const rows = await prisma.boaoCatalogItem.findMany({
      where: { status: "active" },
      orderBy: { crawledAt: "desc" },
      take: limit,
    });
    return rows.map(mapBoaoCatalogItem);
  } catch (error) {
    console.error("[boao] listRecentBoao failed, using source JSON:", error);
    return FALLBACK_ITEMS.filter((item) => item.status === "active").slice(0, limit);
  }
}
