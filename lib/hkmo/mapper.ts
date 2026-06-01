import type { HkmoCatalogItem } from "@prisma/client";
import type { HkmoCatalogRecord } from "@/types/catalog";

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function asStatus(value: string): HkmoCatalogRecord["status"] {
  return value === "discontinued" ? "discontinued" : "active";
}

function asProductType(value: string): HkmoCatalogRecord["productType"] {
  return value === "device" ? "device" : "drug";
}

export function mapHkmoCatalogItem(row: HkmoCatalogItem): HkmoCatalogRecord {
  return {
    id: row.id,
    source: row.source,
    sourceId: row.sourceId,
    name: row.name,
    nameEn: row.nameEn,
    productType: asProductType(row.productType),
    dosageForm: row.dosageForm,
    indication: row.indication,
    diseaseLabel: row.diseaseLabel,
    diseaseSlugs: row.diseaseSlugs,
    hkmoBatch: row.hkmoBatch,
    approvedHospitals: row.approvedHospitals,
    status: asStatus(row.status),
    summary: row.summary,
    officialUrl: row.officialUrl,
    crawledAt: formatDate(row.crawledAt),
  };
}

export function mapHkmoFromSource(
  item: Omit<HkmoCatalogRecord, "id"> & { id?: string },
): HkmoCatalogRecord {
  return {
    id: item.id ?? item.sourceId,
    source: item.source,
    sourceId: item.sourceId,
    name: item.name,
    nameEn: item.nameEn,
    productType: item.productType,
    dosageForm: item.dosageForm,
    indication: item.indication,
    diseaseLabel: item.diseaseLabel,
    diseaseSlugs: item.diseaseSlugs,
    hkmoBatch: item.hkmoBatch,
    approvedHospitals: item.approvedHospitals,
    status: item.status,
    summary: item.summary,
    officialUrl: item.officialUrl,
    crawledAt: item.crawledAt,
  };
}
