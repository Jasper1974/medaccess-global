import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { TrialApplyPanel } from "@/components/trials/TrialApplyPanel";
import { TrialOriginalText } from "@/components/trials/TrialOriginalText";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import {
  getTrialDisplayEligibility,
  getTrialDisplaySummary,
  getTrialDisplayTitle,
} from "@/lib/trials/display";
import { getTrialById } from "@/lib/trials";
import type { ClinicalTrialRecord } from "@/types/trial";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

const STATUS_LABEL: Record<ClinicalTrialRecord["status"], string> = {
  recruiting: "招募中",
  suspended: "已暂停",
  completed: "已结束",
};

const SOURCE_LABEL: Record<ClinicalTrialRecord["source"], string> = {
  clinicaltrials: "ClinicalTrials.gov",
  chictr: "ChiCTR",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-cream-faint py-4 sm:grid-cols-[140px_1fr]">
      <div className="text-xs tracking-widest text-cream-dim">{label}</div>
      <div className="text-sm text-cream">{value}</div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, id } = await params;
  const trial = await getTrialById(id);
  const disease = getDiseaseBySlug(slug);
  if (!trial || !disease) return { title: "试验未找到" };
  return {
    title: `${getTrialDisplayTitle(trial)} | ${disease.shortName} | MedAccess Global`,
    description: getTrialDisplaySummary(trial),
  };
}

export default async function TrialDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  const disease = getDiseaseBySlug(slug);
  const trial = await getTrialById(id);

  if (!disease || !trial || !trial.diseaseSlugs.includes(slug)) {
    notFound();
  }

  const displayTitle = getTrialDisplayTitle(trial);
  const displaySummary = getTrialDisplaySummary(trial);
  const displayEligibility = getTrialDisplayEligibility(trial);

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-4xl px-6 py-10 md:px-14 md:py-12">
        <BackLink
          href={`/d/${slug}/trials`}
          label="返回临床试验列表"
        />

        <div className="mt-6 border border-cream-faint bg-navy-mid p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-cream-dim">{trial.sourceId}</span>
            <span className="border border-teal/40 bg-teal-dim px-2 py-0.5 text-[11px] text-teal">
              {STATUS_LABEL[trial.status]}
            </span>
            {trial.isFree ? (
              <span className="border border-gold/40 bg-gold-dim px-2 py-0.5 text-[11px] text-gold">
                {trial.freeLabel ?? "免费用药"}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 font-serif text-2xl leading-snug text-cream md:text-3xl">
            {displayTitle}
          </h1>
          {trial.titleCn && trial.titleCn !== trial.title ? (
            <TrialOriginalText original={trial.title} />
          ) : null}

          <InfoRow label="病种" value={trial.diseaseLabel} />
          <InfoRow label="分期" value={trial.phase} />
          <InfoRow label="研究中心" value={trial.locations.join("、")} />
          <InfoRow label="数据来源" value={SOURCE_LABEL[trial.source]} />
          <InfoRow
            label="招募截止"
            value={trial.recruitmentEndDate?.replace(/-/g, "/") ?? "未公示"}
          />
          <InfoRow label="开始日期" value={trial.startDate?.replace(/-/g, "/") ?? "未公示"} />
          <InfoRow label="爬取日期" value={trial.crawledAt.replace(/-/g, "/")} />
          <InfoRow label="申办方" value={trial.sponsor} />
          <InfoRow label="干预措施" value={trial.intervention} />

          <div className="border-b border-cream-faint py-4">
            <div className="text-xs tracking-widest text-cream-dim">试验简介</div>
            <p className="mt-2 text-sm leading-relaxed text-cream">{displaySummary}</p>
            {trial.summaryCn && trial.summaryCn !== trial.summary ? (
              <TrialOriginalText original={trial.summary} />
            ) : null}
          </div>

          <div className="border-b border-cream-faint py-4">
            <div className="text-xs tracking-widest text-cream-dim">入组条件（摘要）</div>
            <p className="mt-2 text-sm leading-relaxed text-cream-dim">
              {displayEligibility}
            </p>
            {trial.eligibilityCn && trial.eligibilityCn !== trial.eligibility ? (
              <TrialOriginalText original={trial.eligibility} />
            ) : null}
          </div>

          <div className="py-4">
            <div className="text-xs tracking-widest text-cream-dim">联系方式</div>
            <p className="mt-2 text-sm text-cream-dim">{trial.contactInfo}</p>
          </div>
        </div>

        <div className="mt-8">
          <TrialApplyPanel />
        </div>
      </main>
    </>
  );
}
