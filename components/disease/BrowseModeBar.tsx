import Link from "next/link";
import { getAccessRules } from "@/lib/access/modes";
import type { AccessMode } from "@/types/access";
import type { Disease } from "@/types/disease";

interface BrowseModeBarProps {
  disease: Disease;
  mode?: AccessMode;
}

export function BrowseModeBar({ disease, mode = "browse" }: BrowseModeBarProps) {
  const rules = getAccessRules(mode);

  return (
    <div className="border border-gold/30 bg-gold-dim px-6 py-4 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs tracking-[0.2em] text-gold">{rules.label}</div>
          <p className="mt-1 text-sm text-cream-dim">{rules.banner}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href={`/d/${disease.slug}/plan-request`}
            className="bg-gold px-4 py-2 text-xs tracking-widest text-navy transition hover:bg-gold-light"
          >
            {rules.ctaPrimary}
          </Link>
          <a
            href={`https://work.weixin.qq.com/contact?from=web&disease=${disease.slug}`}
            className="border border-cream-faint px-4 py-2 text-xs tracking-widest text-cream transition hover:border-gold hover:text-gold"
          >
            {rules.ctaSecondary}
          </a>
        </div>
      </div>
    </div>
  );
}
