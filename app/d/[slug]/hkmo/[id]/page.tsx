import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { TrialApplyPanel } from "@/components/trials/TrialApplyPanel";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { getHkmoById } from "@/lib/hkmo";

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

export default async function HkmoDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  const disease = getDiseaseBySlug(slug);
  const item = await getHkmoById(id);

  if (!disease || !item) notFound();
  const visible =
    item.diseaseSlugs.includes(slug) ||
    item.diseaseSlugs.includes("other-unspecified");
  if (!visible) notFound();

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-4xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}/hkmo`} label="返回港澳药械通目录" />

        <div className="mt-6 border border-cream-faint bg-navy-mid p-6 md:p-8">
          <div className="text-xs tracking-widest text-gold">
            {item.productType === "drug" ? "进口药品" : "进口医疗器械"} · {item.source}
          </div>
          <h1 className="mt-4 font-serif text-2xl text-cream md:text-3xl">{item.name}</h1>
          {item.nameEn ? (
            <p className="mt-2 text-sm text-cream-dim">{item.nameEn}</p>
          ) : null}

          <InfoRow label="适应症" value={item.indication} />
          <InfoRow label="病种标签" value={item.diseaseLabel} />
          <InfoRow label="剂型" value={item.dosageForm ?? "未公示"} />
          <InfoRow label="目录批次" value={item.hkmoBatch ?? "未公示"} />
          <InfoRow label="信息更新" value={item.crawledAt.replace(/-/g, "/")} />

          <div className="border-b border-cream-faint py-4">
            <div className="text-xs tracking-widest text-cream-dim">指定医疗机构</div>
            <p className="mt-2 text-sm leading-relaxed text-cream-dim">
              {item.approvedHospitals.join("、")}
            </p>
          </div>

          <div className="py-4">
            <div className="text-xs tracking-widest text-cream-dim">产品简介</div>
            <p className="mt-2 text-sm leading-relaxed text-cream">{item.summary}</p>
          </div>
        </div>

        <div className="mt-8">
          <TrialApplyPanel />
        </div>
      </main>
    </>
  );
}
