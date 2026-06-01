import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { CharityApplyPanel } from "@/components/charity/CharityApplyPanel";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { getCharityById } from "@/lib/charity";
import type { CharityProgramRecord } from "@/types/charity";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

const STATUS_LABEL: Record<CharityProgramRecord["status"], string> = {
  active: "进行中",
  closed: "已结束",
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
  const program = await getCharityById(id);
  const disease = getDiseaseBySlug(slug);
  if (!program || !disease) return { title: "项目未找到" };
  return {
    title: `${program.drugName} | ${disease.shortName} | MedAccess Global`,
    description: program.summary,
  };
}

export default async function CharityDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  const disease = getDiseaseBySlug(slug);
  const program = await getCharityById(id);

  if (!disease || !program || !program.diseaseSlugs.includes(slug)) {
    notFound();
  }

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-4xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}/charity`} label="返回慈善赠药列表" />

        <div className="mt-6 border border-cream-faint bg-navy-mid p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs tracking-widest text-gold">{program.company}</span>
            <span
              className={`border px-2 py-0.5 text-[11px] ${
                program.status === "active"
                  ? "border-teal/40 bg-teal-dim text-teal"
                  : "border-cream-faint text-cream-dim"
              }`}
            >
              {STATUS_LABEL[program.status]}
            </span>
            <span className="border border-gold/40 bg-gold-dim px-2 py-0.5 text-[11px] text-gold">
              {program.benefit}
            </span>
          </div>

          <h1 className="mt-4 font-serif text-2xl leading-snug text-cream md:text-3xl">
            {program.drugName}
          </h1>

          <InfoRow label="适应症" value={program.indication} />
          <InfoRow label="病种标签" value={program.diseaseLabel} />
          <InfoRow label="援助方案" value={program.benefit} />
          <InfoRow label="信息更新" value={program.crawledAt.replace(/-/g, "/")} />
          <InfoRow label="联系方式" value={program.contactInfo} />

          {program.officialUrl ? (
            <div className="grid gap-1 border-b border-cream-faint py-4 sm:grid-cols-[140px_1fr]">
              <div className="text-xs tracking-widest text-cream-dim">官方链接</div>
              <a
                href={program.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold transition hover:text-gold-light"
              >
                {program.officialUrl}
              </a>
            </div>
          ) : null}

          <div className="border-b border-cream-faint py-4">
            <div className="text-xs tracking-widest text-cream-dim">项目简介</div>
            <p className="mt-2 text-sm leading-relaxed text-cream">{program.summary}</p>
          </div>

          <div className="border-b border-cream-faint py-4">
            <div className="text-xs tracking-widest text-cream-dim">申请条件（摘要）</div>
            <p className="mt-2 text-sm leading-relaxed text-cream-dim">{program.eligibility}</p>
          </div>

          <div className="py-4">
            <div className="text-xs tracking-widest text-cream-dim">申请流程</div>
            <p className="mt-2 text-sm leading-relaxed text-cream-dim">
              {program.applicationProcess}
            </p>
          </div>
        </div>

        {program.status === "active" ? (
          <div className="mt-8">
            <CharityApplyPanel />
          </div>
        ) : (
          <p className="mt-8 border border-cream-faint bg-navy-mid p-6 text-sm text-cream-dim">
            该项目已结束，不再接受新申请。如需了解替代方案，请联系平台顾问。
          </p>
        )}
      </main>
    </>
  );
}
