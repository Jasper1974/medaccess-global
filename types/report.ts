export type ReportStatus =
  | "uploaded"
  | "ai_extracted"
  | "pending_review"
  | "reviewed"
  | "rejected"
  | "sent";

export interface ReportSummary {
  id: string;
  status: ReportStatus;
  navigationDiseaseSlug: string;
  conditionSummary: string;
  documentedDiagnosis: string;
  confidence: "high" | "medium" | "low";
  disclaimer: string;
  reviewedAt?: string;
  sentToUserAt?: string;
}
