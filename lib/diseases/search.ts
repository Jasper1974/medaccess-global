import type { Disease } from "@/types/disease";
import { ALL_DISEASES } from "./catalog";

export function searchDiseases(query: string): Disease[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return ALL_DISEASES.filter((disease) => {
    const haystack = [
      disease.name,
      disease.shortName,
      ...disease.aliases,
      ...disease.searchKeywords,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q) || q.split(/\s+/).some((part) => haystack.includes(part));
  });
}

export function resolveDiseaseFromQuery(query: string): Disease | undefined {
  const exact = ALL_DISEASES.find(
    (d) =>
      d.slug === query.trim().toLowerCase() ||
      d.name === query.trim() ||
      d.shortName === query.trim(),
  );
  if (exact) return exact;

  const results = searchDiseases(query);
  return results[0];
}
