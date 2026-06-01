import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { SiteNav } from "@/components/layout/SiteNav";
import { getDiseaseBySlug } from "@/lib/diseases/catalog";
import { countBoaoByDisease } from "@/lib/boao";
import { countCharityByDisease } from "@/lib/charity";
import { countHkmoByDisease } from "@/lib/hkmo";
import { countTrialsByDisease } from "@/lib/trials";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CHANNELS = [
  {
    key: "trials",
    label: "免费临床试验",
    href: (slug: string) => `/d/${slug}/trials`,
    description: "ClinicalTrials.gov、ChiCTR 等公开招募信息",
  },
  {
    key: "charity",
    label: "慈善赠药",
    href: (slug: string) => `/d/${slug}/charity`,
    description: "药厂患者援助计划（PAP）公开收录",
  },
  {
    key: "boao",
    label: "博鳌乐城",
    href: (slug: string) => `/d/${slug}/boao`,
    description: "乐城特许引进药械目录",
  },
  {
    key: "hkmo",
    label: "港澳药械通",
    href: (slug: string) => `/d/${slug}/hkmo`,
    description: "广东省药监局港澳药械通各批次目录",
  },
] as const;

export default async function ChannelsPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  const counts = {
    trials: await countTrialsByDisease(slug),
    charity: await countCharityByDisease(slug),
    boao: await countBoaoByDisease(slug),
    hkmo: await countHkmoByDisease(slug),
  };

  return (
    <>
      <SiteNav diseaseSlug={disease.slug} diseaseName={disease.shortName} />

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-14 md:py-12">
        <BackLink href={`/d/${slug}`} label={`返回 ${disease.shortName} 导航`} />

        <h1 className="mt-6 font-serif text-3xl text-cream md:text-4xl">
          {disease.shortName} · 四大通道
        </h1>
        <p className="mt-2 text-sm text-cream-dim">
          临床试验、慈善赠药、博鳌乐城、港澳药械通——四条合规进药路径概览。
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CHANNELS.map((channel) => (
            <Link
              key={channel.key}
              href={channel.href(slug)}
              className="border border-cream-faint bg-navy-mid p-6 transition hover:border-gold"
            >
              <div className="text-xs tracking-[0.2em] text-gold">{channel.label}</div>
              <div className="mt-3 font-serif text-3xl text-cream">
                {counts[channel.key]}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                {channel.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
