import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { TrialApplyPanel } from "@/components/trials/TrialApplyPanel";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { getBoaoById } from "@/lib/boao";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-cream-faint py-4 sm:grid-cols-[140px_1fr]">
      <div className="text-xs tracking-widest text-cream-dim">{label}</div>
      <div className="text-sm text-cream">{value}</div>
    </div>
  );
}

export default async function BoaoDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  const disease = getDiseaseBySlug(slug);
  const item = await getBoaoById(id);

  if (!disease || !item) notFound();
  const visible =
    item.diseaseSlugs.includes(slug) ||
    item.diseaseSlugs.includes("other-unspecified");
  if (!visible) notFound();

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-4xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}/boao`} label="返回博鳌乐城目录" />

        <div className="mt-6 border border-cream-faint bg-navy-mid p-6 md:p-8">
          <div className="text-xs tracking-widest text-gold">
            {item.productType === "drug" ? "特许药品" : "特许医疗器械"} · {item.source}
          </div>
          <h1 className="mt-4 font-serif text-2xl text-cream md:text-3xl">{item.name}</h1>
          {item.nameEn ? (
            <p className="mt-2 text-sm text-cream-dim">{item.nameEn}</p>
          ) : null}

          <InfoRow label="适应症" value={item.indication} />
          <InfoRow label="病种标签" value={item.diseaseLabel} />
          <InfoRow label="生产企业" value={item.manufacturer ?? "未公示"} />
          <InfoRow label="产地" value={item.originRegion ?? "未公示"} />
          <InfoRow label="信息更新" value={item.crawledAt.replace(/-/g, "/")} />

          <div className="border-b border-cream-faint py-4">
            <div className="text-xs tracking-widest text-cream-dim">产品简介</div>
            <p className="mt-2 text-sm leading-relaxed text-cream">{item.summary}</p>
          </div>

          <div className="py-4">
            <div className="text-xs tracking-widest text-cream-dim">使用说明</div>
            <p className="mt-2 text-sm leading-relaxed text-cream-dim">{item.usageNote}</p>
          </div>
        </div>

        <div className="mt-8">
          <TrialApplyPanel />
        </div>
      </main>
    </>
  );
}
