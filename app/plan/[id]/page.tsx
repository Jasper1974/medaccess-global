import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowseModeBar } from "@/components/disease/BrowseModeBar";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { getAccessRules } from "@/lib/access/modes";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** P0 placeholder：后续接入 Report 表与审核状态 */
const MOCK_REPORTS: Record<
  string,
  {
    diseaseSlug: string;
    conditionSummary: string;
    documentedDiagnosis: string;
    channels: string[];
  }
> = {
  demo: {
    diseaseSlug: "fei-ai-egfr",
    conditionSummary:
      "资料提示非小细胞肺癌，EGFR 敏感突变，既往接受一代 TKI 治疗后进展。",
    documentedDiagnosis: "出院小结记载：肺腺癌，EGFR L858R 突变。",
    channels: [
      "第三代 EGFR 抑制剂临床试验（招募中）",
      "博鳌乐城特许用药通道",
      "奥希替尼患者援助项目",
    ],
  },
};

export default async function PlanPage({ params }: PageProps) {
  const { id } = await params;
  const report = MOCK_REPORTS[id];
  if (!report) notFound();

  const disease = getDiseaseBySlug(report.diseaseSlug);
  if (!disease) notFound();

  const rules = getAccessRules("verified");

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />
      <Disclaimer />

      <main className="px-6 py-12 md:px-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-xs tracking-[0.25em] text-gold">// 专属方案</div>
          <h1 className="mt-3 font-serif text-4xl text-cream">
            {rules.heroTitle(disease.shortName)}
          </h1>
          <p className="mt-4 text-sm text-cream-dim">{rules.banner}</p>

          <div className="mt-8">
            <BrowseModeBar disease={disease} mode="verified" />
          </div>

          <section className="mt-10 space-y-6">
            <div className="border border-cream-faint bg-navy-mid p-6">
              <h2 className="text-sm tracking-widest text-gold">病情导航摘要</h2>
              <p className="mt-3 leading-relaxed text-cream">
                {report.conditionSummary}
              </p>
            </div>

            <div className="border border-cream-faint bg-navy-mid p-6">
              <h2 className="text-sm tracking-widest text-gold">资料中的诊断表述</h2>
              <p className="mt-3 leading-relaxed text-cream-dim">
                {report.documentedDiagnosis}
              </p>
            </div>

            <div className="border border-cream-faint bg-navy-mid p-6">
              <h2 className="text-sm tracking-widest text-gold">建议优先了解的方向</h2>
              <ul className="mt-3 space-y-2">
                {report.channels.map((channel) => (
                  <li key={channel} className="text-cream-dim">
                    · {channel}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/d/${disease.slug}`}
              className="border border-cream-faint px-6 py-3 text-sm tracking-widest text-cream transition hover:border-gold hover:text-gold"
            >
              浏览{disease.shortName}公开资料
            </Link>
            <a
              href={`https://work.weixin.qq.com/contact?from=web&disease=${disease.slug}&report=${id}`}
              className="bg-gold px-6 py-3 text-sm tracking-widest text-navy transition hover:bg-gold-light"
            >
              联系顾问执行方案
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
