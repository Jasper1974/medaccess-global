import Link from "next/link";
import type { HubTab } from "@/types/disease";

const TABS: { id: HubTab; label: string; href: (slug: string) => string }[] = [
  { id: "overview", label: "概览", href: (slug) => `/d/${slug}` },
  { id: "trials", label: "临床试验", href: (slug) => `/d/${slug}/trials` },
  { id: "charity", label: "慈善赠药", href: (slug) => `/d/${slug}/charity` },
  {
    id: "channels",
    label: "四大通道",
    href: (slug) => `/d/${slug}/channels`,
  },
];

interface HubTabsProps {
  slug: string;
  active: HubTab;
}

export function HubTabs({ slug, active }: HubTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-cream-faint pb-4">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href(slug)}
          className={`px-4 py-2 text-sm tracking-wide transition ${
            active === tab.id
              ? "bg-gold text-navy"
              : "text-cream-dim hover:bg-navy-light hover:text-cream"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
