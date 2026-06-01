export type CatalogItemStatus = "active" | "discontinued";
export type CatalogProductType = "drug" | "device";

export interface BoaoCatalogRecord {
  id: string;
  source: string;
  sourceId: string;
  name: string;
  nameEn: string | null;
  productType: CatalogProductType;
  indication: string;
  diseaseLabel: string;
  diseaseSlugs: string[];
  manufacturer: string | null;
  originRegion: string | null;
  status: CatalogItemStatus;
  summary: string;
  usageNote: string;
  officialUrl: string | null;
  crawledAt: string;
}

export interface HkmoCatalogRecord {
  id: string;
  source: string;
  sourceId: string;
  name: string;
  nameEn: string | null;
  productType: CatalogProductType;
  dosageForm: string | null;
  indication: string;
  diseaseLabel: string;
  diseaseSlugs: string[];
  hkmoBatch: string | null;
  approvedHospitals: string[];
  status: CatalogItemStatus;
  summary: string;
  officialUrl: string | null;
  crawledAt: string;
}
