import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { TrialTable } from "@/components/trials/TrialTable";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { listTrialsByDisease } from "@/lib/trials";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) return { title: "病种未找到" };
  return {
    title: `${disease.shortName} 临床试验招募 | MedAccess Global`,
    description: `${disease.name}正在招募的临床试验列表，支持筛选与详情查看。`,
  };
}

export default async function TrialsPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  const trials = await listTrialsByDisease(slug);

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}`} label={`返回 ${disease.shortName} 导航`} />

        <h1 className="mt-6 font-serif text-3xl text-cream md:text-4xl">
          {disease.shortName} · 临床试验招募
        </h1>
        <p className="mt-2 text-sm text-cream-dim">
          以下为{disease.name}相关公开招募信息，不代表个体匹配结论。点击「详情」查看完整信息并申请协助。
        </p>

        <TrialTable trials={trials} diseaseSlug={slug} />
      </main>
    </>
  );
}
