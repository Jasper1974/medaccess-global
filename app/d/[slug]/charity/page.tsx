import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { CharityTable } from "@/components/charity/CharityTable";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { listCharityByDisease } from "@/lib/charity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) return { title: "病种未找到" };
  return {
    title: `${disease.shortName} 慈善赠药项目 | MedAccess Global`,
    description: `${disease.name}相关药厂患者援助与慈善赠药项目列表。`,
  };
}

export default async function CharityPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  const programs = await listCharityByDisease(slug);

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}`} label={`返回 ${disease.shortName} 导航`} />

        <h1 className="mt-6 font-serif text-3xl text-cream md:text-4xl">
          {disease.shortName} · 慈善赠药
        </h1>
        <p className="mt-2 text-sm text-cream-dim">
          以下为{disease.name}相关药厂患者援助项目公开收录，具体申请条件以药厂官方为准。
        </p>

        <CharityTable programs={programs} diseaseSlug={slug} />
      </main>
    </>
  );
}
