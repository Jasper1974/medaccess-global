import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm tracking-wide text-cream-dim transition hover:text-gold"
    >
      <span aria-hidden>←</span>
      {label}
    </Link>
  );
}
