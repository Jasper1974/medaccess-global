export interface DiseaseCategory {
  id: string;
  name: string;
  slug: string;
  children: Disease[];
}

export interface Disease {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  parentId: string;
  parentName: string;
  aliases: string[];
  searchKeywords: string[];
  seoTitle: string;
  seoDescription: string;
  heroTagline: string;
}

export type HubTab = "overview" | "trials" | "charity" | "channels";
