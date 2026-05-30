import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { buildWechatUrl, getDiseaseBySlug } from "@/lib/diseases/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlanRequestPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />
      <Disclaimer />

      <main className="px-6 py-16 md:px-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs tracking-[0.25em] text-gold">// 获取专属方案</div>
          <h1 className="mt-4 font-serif text-3xl text-cream md:text-4xl">
            上传资料，获取{disease.shortName}专属方案
          </h1>
          <p className="mt-4 text-cream-dim">
            建议通过企业微信上传检查报告或影像，顾问协助整理后进入审核流程。
            审核通过后将收到专属方案链接。
          </p>

          <div className="mt-10 space-y-4 text-left">
            {[
              "添加企业微信专属顾问",
              "发送病理、影像或出院小结（可分批发送）",
              "AI 整理要点 + 人工审核",
              "收到《病情导航摘要》与通道建议",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 border border-cream-faint bg-navy-mid p-4"
              >
                <span className="font-serif text-xl text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-cream-dim">{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={buildWechatUrl(disease.slug)}
              className="bg-gold px-8 py-3 text-sm tracking-widest text-navy transition hover:bg-gold-light"
            >
              加企业微信，开始上传资料
            </a>
            <Link
              href={`/d/${disease.slug}`}
              className="border border-cream-faint px-8 py-3 text-sm tracking-widest text-cream transition hover:border-gold hover:text-gold"
            >
              返回浏览公开资料
            </Link>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-cream-dim">
            本流程提供资料整理与通道导航建议，不构成诊断或治疗意见。
            具体用药与入组须以医疗机构及官方项目要求为准。
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
