"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { resolveDiseaseFromQuery } from "@/lib/diseases/search";

const QUICK_TAGS = [
  { label: "肺癌靶向药", slug: "fei-ai-egfr" },
  { label: "免费临床试验", href: "#trials" },
  { label: "博鳌通道", href: "#boao" },
  { label: "罕见病", slug: "sma" },
  { label: "慈善赠药", href: "#charity" },
  { label: "港澳药械通", href: "#hkmo" },
] as const;

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(nextQuery?: string) {
    const value = (nextQuery ?? query).trim();
    if (!value) return;

    const disease = resolveDiseaseFromQuery(value);
    if (disease) {
      router.push(`/d/${disease.slug}`);
      return;
    }

    router.push(`/?q=${encodeURIComponent(value)}#trials`);
  }

  return (
    <div className="mt-10 max-w-3xl">
      <div className="text-xs tracking-[0.2em] text-cream-dim">
        // 输入病种或药物名称开始检索
      </div>

      <div className="mt-3 flex flex-col gap-0 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="例：肺癌 EGFR突变 / 司美格鲁肽 / 罕见病 庞贝病"
          className="flex-1 border border-cream-faint bg-navy-mid px-5 py-4 text-cream placeholder:text-cream-dim/50 outline-none focus:border-gold"
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          className="bg-gold px-8 py-4 text-sm font-medium tracking-[0.12em] text-navy transition hover:bg-gold-light"
        >
          开始检索 →
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_TAGS.map((tag) =>
          "slug" in tag ? (
            <button
              key={tag.label}
              type="button"
              onClick={() => {
                setQuery(tag.label);
                router.push(`/d/${tag.slug}`);
              }}
              className="border border-cream-faint px-3 py-1.5 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
            >
              {tag.label}
            </button>
          ) : (
            <a
              key={tag.label}
              href={tag.href}
              className="border border-cream-faint px-3 py-1.5 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
            >
              {tag.label}
            </a>
          ),
        )}
      </div>
    </div>
  );
}
