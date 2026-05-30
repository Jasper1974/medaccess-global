import Link from "next/link";
import { MAIN_NAV } from "@/lib/nav-links";

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-6 border-t border-cream-faint px-6 py-10 text-center text-sm text-cream-dim md:flex-row md:px-14 md:text-left">
      <div>
        <div className="font-serif text-lg text-cream">MedAccess Global</div>
        <div className="mt-1 text-xs tracking-widest">
          重症患者全球用药导航平台
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 text-xs tracking-wide">
        {MAIN_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="transition hover:text-gold">
            {item.label}
          </Link>
        ))}
      </div>
      <div className="text-xs text-cream-dim/70">
        © {new Date().getFullYear()} MedAccess Global
      </div>
    </footer>
  );
}
