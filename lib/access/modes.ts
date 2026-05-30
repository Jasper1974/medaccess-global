import type { AccessContext, AccessMode, ContentCapability } from "@/types/access";

const BROWSE_CAPABILITIES: ContentCapability[] = [
  "public_trial_list",
  "public_charity_list",
  "public_channel_info",
  "generic_wechat_cta",
];

const VERIFIED_CAPABILITIES: ContentCapability[] = [
  ...BROWSE_CAPABILITIES,
  "personalized_match_score",
  "personalized_recommendation",
  "purchase_or_channel_cta",
  "paid_service_checkout",
];

export function getCapabilities(mode: AccessMode): Set<ContentCapability> {
  return new Set(
    mode === "verified" ? VERIFIED_CAPABILITIES : BROWSE_CAPABILITIES,
  );
}

export function canShow(
  capability: ContentCapability,
  context: AccessContext,
): boolean {
  return getCapabilities(context.mode).has(capability);
}

export const ACCESS_RULES = {
  browse: {
    label: "浏览模式",
    description: "基于所选病种的公开资料浏览，未经资料核对。",
    banner:
      "当前为浏览模式：展示该病种下的公开信息。获取结合您资料的专属方案，请上传检查报告。",
    ctaPrimary: "上传资料，获取专属方案",
    ctaSecondary: "加平台企业微信匹配方案",
    searchPlaceholder: (diseaseName: string) =>
      `搜索${diseaseName}相关临床试验、赠药项目…`,
    wechatCopy: (diseaseName: string) =>
      `加顾问，了解${diseaseName}的试验与通道信息`,
    heroTitle: (diseaseName: string) => `${diseaseName} · 全球用药导航`,
    allowPersonalizedLanguage: false,
  },
  verified: {
    label: "方案模式",
    description: "基于已上传且审核通过的资料生成。",
    banner: "以下方案根据您提交的资料整理，仅供参考，请遵医嘱。",
    ctaPrimary: "查看完整方案",
    ctaSecondary: "联系顾问执行方案",
    searchPlaceholder: (diseaseName: string) =>
      `在${diseaseName}方案内搜索…`,
    wechatCopy: (diseaseName: string) =>
      `联系顾问，跟进${diseaseName}方案执行`,
    heroTitle: (diseaseName: string) => `${diseaseName} · 您的用药导航方案`,
    allowPersonalizedLanguage: true,
  },
} as const;

export function getAccessRules(mode: AccessMode) {
  return ACCESS_RULES[mode];
}

export function resolveAccessContext(input: {
  mode?: AccessMode;
  diseaseSlug?: string;
  reportId?: string;
}): AccessContext {
  return {
    mode: input.reportId ? "verified" : (input.mode ?? "browse"),
    diseaseSlug: input.diseaseSlug,
    reportId: input.reportId,
  };
}
