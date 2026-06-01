import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { HkmoTable } from "@/components/hkmo/HkmoTable";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { listHkmoByDisease } from "@/lib/hkmo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) return { title: "病种未找到" };
  return {
    title: `${disease.shortName} 港澳药械通目录 | MedAccess Global`,
    description: `${disease.name}相关粤港澳大湾区港澳药械通进口目录。`,
  };
}

export default async function HkmoPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  const items = await listHkmoByDisease(slug);

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}`} label={`返回 ${disease.shortName} 导航`} />

        <h1 className="mt-6 font-serif text-3xl text-cream md:text-4xl">
          {disease.shortName} · 港澳药械通
        </h1>
        <p className="mt-2 text-sm text-cream-dim">
          数据来源：广东省药监局「港澳药械通」各批次目录。在大湾区指定医疗机构进口使用。
        </p>

        <HkmoTable items={items} diseaseSlug={slug} />
      </main>
    </>
  );
}
