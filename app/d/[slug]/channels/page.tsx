import { notFound } from "next/navigation";
import { BrowseModeBar } from "@/components/disease/BrowseModeBar";
import { ChannelCards } from "@/components/hub/ChannelCards";
import { HubTabs } from "@/components/hub/HubTabs";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { filterByDisease, MOCK_CHANNELS } from "@/lib/mock/hub-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChannelsPage({ params }: PageProps) {
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
            {disease.shortName} · 四大通道
          </h1>
          <p className="mt-3 text-cream-dim">
            博鳌乐城、临床试验、港澳药械通、慈善赠药——四条合规进药路径概览。
          </p>

          <div className="mt-8">
            <BrowseModeBar disease={disease} />
          </div>

          <div className="mt-10">
            <HubTabs slug={slug} active="channels" />
          </div>

          <div className="mt-8">
            <ChannelCards channels={filterByDisease(MOCK_CHANNELS, slug)} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
