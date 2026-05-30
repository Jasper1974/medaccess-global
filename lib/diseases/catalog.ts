import type { Disease, DiseaseCategory } from "@/types/disease";

function disease(
  parent: Pick<DiseaseCategory, "id" | "name" | "slug">,
  item: Omit<
    Disease,
    "parentId" | "parentName" | "seoTitle" | "seoDescription" | "heroTagline"
  > & {
    seoTitle?: string;
    seoDescription?: string;
    heroTagline?: string;
  },
): Disease {
  return {
    ...item,
    parentId: parent.id,
    parentName: parent.name,
    seoTitle:
      item.seoTitle ??
      `${item.name} · 全球用药与免费临床试验导航 | MedAccess Global`,
    seoDescription:
      item.seoDescription ??
      `为${item.name}患者家属整理临床试验招募、慈善赠药、博鳌与港澳药械通等合规通道信息。`,
    heroTagline:
      item.heroTagline ?? `${item.shortName} · 全球用药与临床试验导航`,
  };
}

const lungCancer: DiseaseCategory = {
  id: "lung-cancer",
  name: "肺癌",
  slug: "lung-cancer",
  children: [
    disease(
      { id: "lung-cancer", name: "肺癌", slug: "lung-cancer" },
      {
        id: "fei-ai-egfr",
        slug: "fei-ai-egfr",
        name: "非小细胞肺癌（EGFR突变）",
        shortName: "肺癌 EGFR",
        aliases: ["非小细胞肺癌", "NSCLC", "EGFR突变", "肺腺癌"],
        searchKeywords: ["EGFR", "奥希替尼", "靶向药", "临床试验"],
      },
    ),
    disease(
      { id: "lung-cancer", name: "肺癌", slug: "lung-cancer" },
      {
        id: "fei-ai-alk",
        slug: "fei-ai-alk",
        name: "非小细胞肺癌（ALK突变）",
        shortName: "肺癌 ALK",
        aliases: ["ALK融合", "ALK阳性", "非小细胞肺癌"],
        searchKeywords: ["ALK", "克唑替尼", "劳拉替尼"],
      },
    ),
    disease(
      { id: "lung-cancer", name: "肺癌", slug: "lung-cancer" },
      {
        id: "fei-ai-wt",
        slug: "fei-ai-wt",
        name: "非小细胞肺癌（无驱动基因）",
        shortName: "肺癌 无驱动基因",
        aliases: ["野生型", "无靶点", "非小细胞肺癌"],
        searchKeywords: ["免疫治疗", "PD-1", "化疗"],
      },
    ),
    disease(
      { id: "lung-cancer", name: "肺癌", slug: "lung-cancer" },
      {
        id: "xiao-xi-bao",
        slug: "xiao-xi-bao",
        name: "小细胞肺癌",
        shortName: "小细胞肺癌",
        aliases: ["SCLC", "小细胞"],
        searchKeywords: ["小细胞肺癌", "化疗", "免疫"],
      },
    ),
  ],
};

const breastCancer: DiseaseCategory = {
  id: "breast-cancer",
  name: "乳腺癌",
  slug: "breast-cancer",
  children: [
    disease(
      { id: "breast-cancer", name: "乳腺癌", slug: "breast-cancer" },
      {
        id: "ru-xian-her2",
        slug: "ru-xian-her2",
        name: "乳腺癌（HER2阳性）",
        shortName: "乳腺癌 HER2+",
        aliases: ["HER2阳性", "HER2扩增"],
        searchKeywords: ["曲妥珠单抗", "HER2", "靶向"],
      },
    ),
    disease(
      { id: "breast-cancer", name: "乳腺癌", slug: "breast-cancer" },
      {
        id: "ru-xian-tnbc",
        slug: "ru-xian-tnbc",
        name: "三阴性乳腺癌",
        shortName: "三阴性乳腺癌",
        aliases: ["TNBC", "三阴"],
        searchKeywords: ["免疫治疗", "PARP抑制剂"],
      },
    ),
  ],
};

const rareDisease: DiseaseCategory = {
  id: "rare-disease",
  name: "罕见病",
  slug: "rare-disease",
  children: [
    disease(
      { id: "rare-disease", name: "罕见病", slug: "rare-disease" },
      {
        id: "sma",
        slug: "sma",
        name: "脊髓性肌萎缩症（SMA）",
        shortName: "SMA",
        aliases: ["脊髓性肌萎缩", "SMA"],
        searchKeywords: ["诺西那生", "基因治疗", "Zolgensma"],
      },
    ),
    disease(
      { id: "rare-disease", name: "罕见病", slug: "rare-disease" },
      {
        id: "pompe",
        slug: "pompe",
        name: "庞贝病",
        shortName: "庞贝病",
        aliases: ["糖原贮积病II型"],
        searchKeywords: ["酶替代", "美而赞"],
      },
    ),
    disease(
      { id: "rare-disease", name: "罕见病", slug: "rare-disease" },
      {
        id: "fabry",
        slug: "fabry",
        name: "法布雷病",
        shortName: "法布雷病",
        aliases: ["Fabry病"],
        searchKeywords: ["酶替代", "阿加糖酶"],
      },
    ),
  ],
};

const liverCancer: DiseaseCategory = {
  id: "liver-cancer",
  name: "肝癌",
  slug: "liver-cancer",
  children: [
    disease(
      { id: "liver-cancer", name: "肝癌", slug: "liver-cancer" },
      {
        id: "gan-ai-hcc",
        slug: "gan-ai-hcc",
        name: "肝细胞癌",
        shortName: "肝细胞癌",
        aliases: ["HCC", "原发性肝癌"],
        searchKeywords: ["索拉非尼", "免疫联合", "TACE"],
      },
    ),
  ],
};

const gastricCancer: DiseaseCategory = {
  id: "gastric-cancer",
  name: "胃癌",
  slug: "gastric-cancer",
  children: [
    disease(
      { id: "gastric-cancer", name: "胃癌", slug: "gastric-cancer" },
      {
        id: "wei-ai-advanced",
        slug: "wei-ai-advanced",
        name: "晚期胃癌",
        shortName: "晚期胃癌",
        aliases: ["胃腺癌", "转移性胃癌"],
        searchKeywords: ["PD-1", "CLDN18.2", "临床试验"],
      },
    ),
  ],
};

const colorectalCancer: DiseaseCategory = {
  id: "colorectal-cancer",
  name: "结直肠癌",
  slug: "colorectal-cancer",
  children: [
    disease(
      { id: "colorectal-cancer", name: "结直肠癌", slug: "colorectal-cancer" },
      {
        id: "jie-zhi-ai-msi",
        slug: "jie-zhi-ai-msi",
        name: "结直肠癌（MSI-H/dMMR）",
        shortName: "结直肠癌 MSI-H",
        aliases: ["MSI-H", "dMMR", "免疫治疗"],
        searchKeywords: ["帕博利珠单抗", "MSI"],
      },
    ),
  ],
};

const leukemia: DiseaseCategory = {
  id: "leukemia",
  name: "白血病",
  slug: "leukemia",
  children: [
    disease(
      { id: "leukemia", name: "白血病", slug: "leukemia" },
      {
        id: "aml",
        slug: "aml",
        name: "急性髓系白血病（AML）",
        shortName: "AML",
        aliases: ["急性髓细胞白血病"],
        searchKeywords: ["维奈克拉", "CAR-T", "临床试验"],
      },
    ),
  ],
};

const lymphoma: DiseaseCategory = {
  id: "lymphoma",
  name: "淋巴瘤",
  slug: "lymphoma",
  children: [
    disease(
      { id: "lymphoma", name: "淋巴瘤", slug: "lymphoma" },
      {
        id: "dlbcl",
        slug: "dlbcl",
        name: "弥漫大B细胞淋巴瘤",
        shortName: "DLBCL",
        aliases: ["大B细胞淋巴瘤"],
        searchKeywords: ["CAR-T", "R-CHOP", "临床试验"],
      },
    ),
  ],
};

const autoimmune: DiseaseCategory = {
  id: "autoimmune",
  name: "自免疾病",
  slug: "autoimmune",
  children: [
    disease(
      { id: "autoimmune", name: "自免疾病", slug: "autoimmune" },
      {
        id: "sle",
        slug: "sle",
        name: "系统性红斑狼疮",
        shortName: "红斑狼疮",
        aliases: ["SLE", "狼疮"],
        searchKeywords: ["生物制剂", "贝利尤单抗"],
      },
    ),
  ],
};

const other: DiseaseCategory = {
  id: "other",
  name: "其他",
  slug: "other",
  children: [
    disease(
      { id: "other", name: "其他", slug: "other" },
      {
        id: "other-unspecified",
        slug: "other-unspecified",
        name: "其他疾病（待梳理）",
        shortName: "其他",
        aliases: [],
        searchKeywords: [],
        heroTagline: "其他疾病 · 资料梳理与通道导航",
        seoDescription:
          "若暂未找到对应病种，可先浏览通用通道信息，或联系顾问协助梳理资料。",
      },
    ),
  ],
};

export const DISEASE_CATEGORIES: DiseaseCategory[] = [
  lungCancer,
  breastCancer,
  liverCancer,
  gastricCancer,
  colorectalCancer,
  leukemia,
  lymphoma,
  rareDisease,
  autoimmune,
  other,
];

export const ALL_DISEASES: Disease[] = DISEASE_CATEGORIES.flatMap(
  (category) => category.children,
);

export function getDiseaseBySlug(slug: string): Disease | undefined {
  return ALL_DISEASES.find((d) => d.slug === slug);
}

export function getCategoryBySlug(slug: string): DiseaseCategory | undefined {
  return DISEASE_CATEGORIES.find((c) => c.slug === slug);
}

export function getDiseaseSlugs(): string[] {
  return ALL_DISEASES.map((d) => d.slug);
}

export function buildWechatUrl(
  diseaseSlug: string,
  extra?: { trialId?: string; intent?: string },
): string {
  const params = new URLSearchParams({
    from: "web",
    disease: diseaseSlug,
  });
  if (extra?.trialId) params.set("trial", extra.trialId);
  if (extra?.intent) params.set("intent", extra.intent);
  return `https://work.weixin.qq.com/contact?${params.toString()}`;
}
