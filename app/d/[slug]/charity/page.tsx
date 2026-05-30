import { notFound } from "next/navigation";
import { BrowseModeBar } from "@/components/disease/BrowseModeBar";
import { CharityList } from "@/components/hub/CharityList";
import { HubTabs } from "@/components/hub/HubTabs";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { filterByDisease, MOCK_CHARITY } from "@/lib/mock/hub-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CharityPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />
      <Disclaimer />

      <main className="px-6 py-12 md:px-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-serif text-3xl text-cream md:text-4xl">
            {disease.shortName} · 慈善赠药
          </h1>
          <p className="mt-3 text-cream-dim">
            药厂患者援助项目公开收录，具体申请条件以药厂官方为准。
          </p>

          <div className="mt-8">
            <BrowseModeBar disease={disease} />
          </div>

          <div className="mt-10">
            <HubTabs slug={slug} active="charity" />
          </div>

          <div className="mt-8">
            <CharityList programs={filterByDisease(MOCK_CHARITY, slug)} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
