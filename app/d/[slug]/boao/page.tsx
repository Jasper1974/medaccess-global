import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { BoaoTable } from "@/components/boao/BoaoTable";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { listBoaoByDisease } from "@/lib/boao";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) return { title: "病种未找到" };
  return {
    title: `${disease.shortName} 博鳌乐城特许药械 | MedAccess Global`,
    description: `${disease.name}相关博鳌乐城特许引进药械目录。`,
  };
}

export default async function BoaoPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  const items = await listBoaoByDisease(slug);

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}`} label={`返回 ${disease.shortName} 导航`} />

        <h1 className="mt-6 font-serif text-3xl text-cream md:text-4xl">
          {disease.shortName} · 博鳌乐城特许药械
        </h1>
        <p className="mt-2 text-sm text-cream-dim">
          数据来源：博鳌乐城国际药械公开目录、海南医药网特许清单。须本人前往海南指定医疗机构使用。
        </p>

        <BoaoTable items={items} diseaseSlug={slug} />
      </main>
    </>
  );
}
