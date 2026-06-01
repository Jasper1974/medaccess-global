import { ALL_DISEASES } from "@/lib/diseases/catalog";
import type { Disease } from "@/types/disease";

interface DiseaseMatchRule {
  disease: Disease;
  terms: string[];
}

const DISEASE_RULES: DiseaseMatchRule[] = ALL_DISEASES.filter(
  (d) => d.slug !== "other-unspecified",
).map((disease) => ({
  disease,
  terms: [
    disease.name,
    disease.shortName,
    ...disease.aliases,
    ...disease.searchKeywords,
  ]
    .map((term) => term.toLowerCase())
    .filter(Boolean),
}));

function scoreDisease(haystack: string, rule: DiseaseMatchRule): number {
  let score = 0;
  for (const term of rule.terms) {
    if (term.length < 2) continue;
    if (haystack.includes(term.toLowerCase())) {
      score += term.length >= 6 ? 3 : term.length >= 4 ? 2 : 1;
    }
  }
  return score;
}

export interface DiseaseMatchResult {
  diseaseSlugs: string[];
  diseaseLabel: string;
}

export function matchDiseasesFromText(parts: string[]): DiseaseMatchResult {
  const haystack = parts.filter(Boolean).join(" ").toLowerCase();

  const ranked = DISEASE_RULES.map((rule) => ({
    rule,
    score: scoreDisease(haystack, rule),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return {
      diseaseSlugs: ["other-unspecified"],
      diseaseLabel: "其他",
    };
  }

  const topScore = ranked[0].score;
  const topMatches = ranked.filter((item) => item.score >= topScore - 1);

  return {
    diseaseSlugs: topMatches.map((item) => item.rule.disease.slug),
    diseaseLabel: topMatches.map((item) => item.rule.disease.shortName).join(" / "),
  };
}

const ENGLISH_QUERY_BY_SLUG: Record<string, string> = {
  "fei-ai-egfr": "non-small cell lung cancer EGFR",
  "fei-ai-alk": "non-small cell lung cancer ALK",
  "fei-ai-wt": "non-small cell lung cancer",
  "xiao-xi-bao": "small cell lung cancer",
  "ru-xian-her2": "breast cancer HER2",
  "ru-xian-tnbc": "triple negative breast cancer",
  "gan-ai-hcc": "hepatocellular carcinoma",
  "wei-ai-advanced": "gastric cancer",
  "jie-zhi-ai-msi": "colorectal cancer MSI",
  aml: "acute myeloid leukemia",
  dlbcl: "diffuse large B cell lymphoma",
  sma: "spinal muscular atrophy",
  pompe: "Pompe disease",
  fabry: "Fabry disease",
  sle: "systemic lupus erythematosus",
};

export function buildConditionQueryForDisease(disease: Disease): string {
  const englishOverride = ENGLISH_QUERY_BY_SLUG[disease.slug];
  if (englishOverride) return englishOverride;

  const asciiTerms = [
    ...disease.aliases,
    ...disease.searchKeywords,
    disease.shortName,
  ].filter((term) => /^[\x00-\x7F]+$/.test(term));

  if (asciiTerms.length > 0) {
    return asciiTerms.slice(0, 3).join(" ");
  }

  return disease.slug.replace(/-/g, " ");
}
