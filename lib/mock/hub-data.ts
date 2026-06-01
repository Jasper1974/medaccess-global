import type { ClinicalTrialRecord } from "@/types/trial";

export interface MockChannelItem {
  id: string;
  channel: "boao" | "trials" | "hkmo" | "charity";
  title: string;
  description: string;
  diseaseSlugs: string[];
}

export const MOCK_TRIALS: ClinicalTrialRecord[] = [
  {
    id: "trial-1",
    sourceId: "NCT06234521",
    source: "clinicaltrials",
    title: "第三代EGFR抑制剂 vs 标准化疗",
    diseaseSlugs: ["fei-ai-egfr"],
    diseaseLabel: "非小细胞肺癌 EGFR",
    phase: "III期",
    locations: ["上海", "北京", "广州"],
    status: "recruiting",
    isFree: true,
    crawledAt: "2026-05-28",
    recruitmentEndDate: "2026-12-31",
    startDate: "2025-03-01",
    summary:
      "评估第三代EGFR-TKI对比含铂双药化疗在EGFR敏感突变晚期非小细胞肺癌患者中的疗效与安全性。",
    eligibility: "18-75岁；EGFR敏感突变；既往未接受三代EGFR-TKI治疗。",
    intervention: "第三代EGFR抑制剂 口服",
    sponsor: "某制药公司",
    contactInfo: "上海某三甲医院肿瘤内科",
  },
  {
    id: "trial-1b",
    sourceId: "ChiCTR2400018921",
    source: "chictr",
    title: "EGFR突变肺癌联合免疫治疗研究",
    diseaseSlugs: ["fei-ai-egfr"],
    diseaseLabel: "非小细胞肺癌 EGFR",
    phase: "II期",
    locations: ["杭州", "南京"],
    status: "recruiting",
    isFree: true,
    crawledAt: "2026-05-27",
    recruitmentEndDate: "2026-09-30",
    startDate: "2025-06-15",
    summary: "探索EGFR-TKI联合PD-1抑制剂在EGFR突变非小细胞肺癌中的疗效。",
    eligibility: "EGFR突变阳性；ECOG 0-1；有可测量病灶。",
    intervention: "EGFR-TKI + PD-1抑制剂",
    sponsor: "国内某研究中心",
    contactInfo: "浙江大学医学院附属某医院",
  },
  {
    id: "trial-1c",
    sourceId: "NCT06401234",
    source: "clinicaltrials",
    title: "EGFR ex20ins 专用靶向药研究",
    diseaseSlugs: ["fei-ai-egfr"],
    diseaseLabel: "非小细胞肺癌 EGFR ex20ins",
    phase: "I/II期",
    locations: ["北京", "上海"],
    status: "recruiting",
    isFree: true,
    freeLabel: "免费用药",
    crawledAt: "2026-05-26",
    recruitmentEndDate: "2027-03-31",
    startDate: "2025-09-01",
    summary: "针对EGFR 20号外显子插入突变的在研靶向药物早期研究。",
    eligibility: "经确认EGFR ex20ins突变；至少一线系统治疗后进展。",
    intervention: "新型EGFR ex20ins 抑制剂",
    sponsor: "国际多中心研究",
    contactInfo: "北京某肿瘤专科医院",
  },
  {
    id: "trial-2",
    sourceId: "ChiCTR2300078421",
    source: "chictr",
    title: "新型PD-1/PD-L1双抗联合化疗",
    diseaseSlugs: ["wei-ai-advanced"],
    diseaseLabel: "晚期胃癌",
    phase: "II/III期",
    locations: ["全国22个中心"],
    status: "recruiting",
    isFree: true,
    crawledAt: "2026-05-28",
    recruitmentEndDate: "2026-11-15",
    startDate: "2024-08-01",
    summary: "评估PD-1/PD-L1双特异性抗体联合化疗一线治疗晚期胃癌的疗效。",
    eligibility: "未经系统治疗的晚期胃腺癌；HER2阴性。",
    intervention: "双抗 + 化疗",
    sponsor: "国内药企",
    contactInfo: "ChiCTR公示联系方式",
  },
  {
    id: "trial-3",
    sourceId: "NCT06198765",
    source: "clinicaltrials",
    title: "脊髓性肌萎缩症基因治疗长期随访",
    diseaseSlugs: ["sma"],
    diseaseLabel: "SMA",
    phase: "I/II期",
    locations: ["北京"],
    status: "recruiting",
    isFree: true,
    freeLabel: "全程免费",
    crawledAt: "2026-05-25",
    recruitmentEndDate: "2026-08-30",
    startDate: "2024-01-10",
    summary: "SMA基因治疗产品上市前/上市后的长期安全性和有效性随访研究。",
    eligibility: "确诊SMA；符合基因治疗入组标准；监护人知情同意。",
    intervention: "基因治疗",
    sponsor: "罕见病研究中心",
    contactInfo: "北京协和医院",
  },
  {
    id: "trial-4",
    sourceId: "ChiCTR2300081234",
    source: "chictr",
    title: "ALK阳性非小细胞肺癌新型靶向药",
    diseaseSlugs: ["fei-ai-alk"],
    diseaseLabel: "非小细胞肺癌 ALK",
    phase: "III期",
    locations: ["广州", "江苏", "浙江"],
    status: "recruiting",
    isFree: true,
    crawledAt: "2026-05-28",
    recruitmentEndDate: "2027-01-20",
    startDate: "2025-01-20",
    summary: "新型ALK抑制剂在ALK阳性晚期非小细胞肺癌中的注册临床研究。",
    eligibility: "ALK融合阳性；既往克唑替尼治疗后进展或不耐受。",
    intervention: "新型ALK抑制剂",
    sponsor: "肿瘤药物研发企业",
    contactInfo: "广东省肿瘤防治中心",
  },
  {
    id: "trial-5",
    sourceId: "NCT06301456",
    source: "clinicaltrials",
    title: "HER2阳性乳腺癌新型ADC药物研究",
    diseaseSlugs: ["ru-xian-her2"],
    diseaseLabel: "HER2阳性乳腺癌",
    phase: "II期",
    locations: ["全国15个中心"],
    status: "recruiting",
    isFree: true,
    crawledAt: "2026-05-24",
    recruitmentEndDate: "2026-10-31",
    startDate: "2025-04-01",
    summary: "抗HER2 ADC药物在HER2阳性晚期乳腺癌中的II期临床研究。",
    eligibility: "HER2阳性；既往至少一种抗HER2治疗失败。",
    intervention: "ADC药物 静脉输注",
    sponsor: "国际制药公司",
    contactInfo: "全国多中心联系人见ClinicalTrials.gov",
  },
];

export const MOCK_CHANNELS: MockChannelItem[] = [
  {
    id: "ch-1",
    channel: "boao",
    title: "博鳌乐城特许药械",
    description: "国内未上市、海外已获批的创新药，可在海南博鳌先行区合规使用。",
    diseaseSlugs: ["fei-ai-egfr", "fei-ai-alk", "sma"],
  },
  {
    id: "ch-2",
    channel: "trials",
    title: "免费临床试验",
    description: "符合条件患者可免费用药，并参与在研新疗法。",
    diseaseSlugs: ["fei-ai-egfr", "fei-ai-alk", "wei-ai-advanced", "sma"],
  },
  {
    id: "ch-3",
    channel: "hkmo",
    title: "港澳药械通",
    description: "港澳已上市、内地未上市药品，在大湾区指定医院可合法获取。",
    diseaseSlugs: ["fei-ai-egfr", "ru-xian-her2"],
  },
  {
    id: "ch-4",
    channel: "charity",
    title: "慈善赠药项目",
    description: "药厂患者援助计划，符合条件的患者可申请赠药或减免。",
    diseaseSlugs: ["fei-ai-egfr", "sma", "ru-xian-her2"],
  },
];

export function filterByDisease<T extends { diseaseSlugs: string[] }>(
  items: T[],
  diseaseSlug: string,
): T[] {
  return items.filter(
    (item) =>
      item.diseaseSlugs.includes(diseaseSlug) ||
      item.diseaseSlugs.includes("other-unspecified"),
  );
}

export function getTrialsForDisease(diseaseSlug: string): ClinicalTrialRecord[] {
  return filterByDisease(MOCK_TRIALS, diseaseSlug);
}

export function getTrialById(id: string): ClinicalTrialRecord | undefined {
  return MOCK_TRIALS.find((t) => t.id === id);
}

/** 兼容旧组件 */
export function trialDisplaySubtitle(trial: ClinicalTrialRecord): string {
  return `${trial.diseaseLabel} · ${trial.phase} · ${trial.locations.join("、")}`;
}
