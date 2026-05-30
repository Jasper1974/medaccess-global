/** browse = 公开资料浏览；verified = 上传资料且审核通过后的方案模式 */
export type AccessMode = "browse" | "verified";

export type ContentCapability =
  | "public_trial_list"
  | "public_charity_list"
  | "public_channel_info"
  | "generic_wechat_cta"
  | "personalized_match_score"
  | "personalized_recommendation"
  | "purchase_or_channel_cta"
  | "paid_service_checkout";

export interface AccessContext {
  mode: AccessMode;
  diseaseSlug?: string;
  reportId?: string;
}
