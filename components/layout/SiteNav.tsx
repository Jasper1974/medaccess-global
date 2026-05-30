import Link from "next/link";
import { buildWechatUrl } from "@/lib/diseases/catalog";
import { MAIN_NAV, WECHAT_CTA, WECHAT_URL } from "@/lib/nav-links";

interface SiteNavProps {
  diseaseSlug?: string;
  diseaseName?: string;
}

export function SiteNav({ diseaseSlug, diseaseName }: SiteNavProps) {
  const wechatHref = diseaseSlug ? buildWechatUrl(diseaseSlug) : WECHAT_URL;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-cream-faint bg-[rgba(10,22,40,0.9)] px-4 py-4 backdrop-blur-xl md:px-8 lg:px-10">
      <Link href="/" className="shrink-0 group">
        <div className="font-serif text-lg tracking-[0.08em] text-cream lg:text-xl">
          Med<span className="text-gold">Access</span> Global
        </div>
        <div className="hidden text-[10px] tracking-[0.2em] text-cream-dim md:block">
          全球药品及免费临床试验检索数据库
        </div>
      </Link>

      <ul className="hidden flex-1 items-center justify-center gap-3 xl:flex xl:gap-5">
        {MAIN_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="whitespace-nowrap text-[11px] tracking-wide text-cream-dim transition hover:text-gold xl:text-xs"
            >
              {item.label}
            </Link>
          </li>
        ))}
        {diseaseSlug && diseaseName ? (
          <li>
            <Link
              href={`/d/${diseaseSlug}`}
              className="whitespace-nowrap text-xs tracking-wide text-gold transition hover:text-gold-light"
            >
              {diseaseName}
            </Link>
          </li>
        ) : null}
      </ul>

      <a
        href={wechatHref}
        className="shrink-0 border border-gold px-3 py-2 text-[10px] tracking-[0.08em] text-gold transition hover:bg-gold hover:text-navy md:px-4 md:text-xs"
      >
        {WECHAT_CTA}
      </a>
    </nav>
  );
}
