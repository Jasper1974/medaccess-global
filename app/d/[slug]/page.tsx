import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowseModeBar } from "@/components/disease/BrowseModeBar";
import { ChannelCards } from "@/components/hub/ChannelCards";
import { CharityList } from "@/components/hub/CharityList";
import { HubTabs } from "@/components/hub/HubTabs";
import { TrialList } from "@/components/hub/TrialList";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { getAccessRules } from "@/lib/access/modes";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import {
  filterByDisease,
  MOCK_CHANNELS,
  MOCK_CHARITY,
} from "@/lib/mock/hub-data";
import { countTrialsByDisease, listTrialsByDisease } from "@/lib/trials";
import type { HubTab } from "@/types/disease";

interface HubPageProps {
  params: Promise<{ slug: string }>;
}

async function getHubStats(slug: string) {
  return {
    trials: await countTrialsByDisease(slug),
    charity: filterByDisease(MOCK_CHARITY, slug).length,
    channels: filterByDisease(MOCK_CHANNELS, slug).length,
  };
}

export async function generateStaticParams() {
  const { getDiseaseSlugs } = await import("@/lib/diseases/catalog");
  return getDiseaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: HubPageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) return { title: "病种未找到" };
  return {
    title: disease.seoTitle,
    description: disease.seoDescription,
  };
}

export default async function DiseaseHubPage({ params }: HubPageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  const rules = getAccessRules("browse");
  const stats = await getHubStats(slug);
  const previewTrials = (await listTrialsByDisease(slug)).slice(0, 3);
  const activeTab: HubTab = "overview";

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />
      <Disclaimer />

      <main className="px-6 py-12 md:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-xs tracking-[0.25em] text-gold">
            // {disease.parentName} · 专属导航
          </div>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-cream md:text-5xl">
            {rules.heroTitle(disease.shortName)}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-cream-dim">
            为您整理{disease.name}相关的临床试验、慈善赠药与四大合规进药通道公开信息。
          </p>

          <div className="mt-8">
            <BrowseModeBar disease={disease} />
          </div>

          <div className="mt-10">
            <HubTabs slug={slug} active={activeTab} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              href={`/d/${slug}/trials`}
              className="border border-cream-faint bg-navy-mid p-6 transition hover:border-gold"
            >
              <div className="font-serif text-3xl text-gold">{stats.trials}</div>
              <div className="mt-2 text-cream">在招临床试验</div>
            </Link>
            <Link
              href={`/d/${slug}/charity`}
              className="border border-cream-faint bg-navy-mid p-6 transition hover:border-gold"
            >
              <div className="font-serif text-3xl text-gold">{stats.charity}</div>
              <div className="mt-2 text-cream">慈善赠药项目</div>
            </Link>
            <Link
              href={`/d/${slug}/channels`}
              className="border border-cream-faint bg-navy-mid p-6 transition hover:border-gold"
            >
              <div className="font-serif text-3xl text-gold">{stats.channels}</div>
              <div className="mt-2 text-cream">可用通道类型</div>
            </Link>
          </div>

          <section className="mt-12">
            <h2 className="font-serif text-2xl text-cream">招募中的临床试验</h2>
            <div className="mt-6">
              <TrialList trials={previewTrials} diseaseSlug={slug} />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-2xl text-cream">慈善赠药项目</h2>
            <div className="mt-6">
              <CharityList programs={filterByDisease(MOCK_CHARITY, slug)} />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-2xl text-cream">可用进药通道</h2>
            <div className="mt-6">
              <ChannelCards channels={filterByDisease(MOCK_CHANNELS, slug)} />
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
