import type { BoaoCatalogItem } from "@prisma/client";
import type { BoaoCatalogRecord } from "@/types/catalog";

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function asStatus(value: string): BoaoCatalogRecord["status"] {
  return value === "discontinued" ? "discontinued" : "active";
}

function asProductType(value: string): BoaoCatalogRecord["productType"] {
  return value === "device" ? "device" : "drug";
}

export function mapBoaoCatalogItem(row: BoaoCatalogItem): BoaoCatalogRecord {
  return {
    id: row.id,
    source: row.source,
    sourceId: row.sourceId,
    name: row.name,
    nameEn: row.nameEn,
    productType: asProductType(row.productType),
    indication: row.indication,
    diseaseLabel: row.diseaseLabel,
    diseaseSlugs: row.diseaseSlugs,
    manufacturer: row.manufacturer,
    originRegion: row.originRegion,
    status: asStatus(row.status),
    summary: row.summary,
    usageNote: row.usageNote,
    officialUrl: row.officialUrl,
    crawledAt: formatDate(row.crawledAt),
  };
}

export function mapBoaoFromSource(
  item: Omit<BoaoCatalogRecord, "id"> & { id?: string },
): BoaoCatalogRecord {
  return {
    id: item.id ?? item.sourceId,
    source: item.source,
    sourceId: item.sourceId,
    name: item.name,
    nameEn: item.nameEn,
    productType: item.productType,
    indication: item.indication,
    diseaseLabel: item.diseaseLabel,
    diseaseSlugs: item.diseaseSlugs,
    manufacturer: item.manufacturer,
    originRegion: item.originRegion,
    status: item.status,
    summary: item.summary,
    usageNote: item.usageNote,
    officialUrl: item.officialUrl,
    crawledAt: item.crawledAt,
  };
}
