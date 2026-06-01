import Link from "next/link";
import type { CharityProgramRecord } from "@/types/charity";

interface CharityListProps {
  programs: CharityProgramRecord[];
  diseaseSlug: string;
}

export function CharityList({ programs, diseaseSlug }: CharityListProps) {
  if (programs.length === 0) {
    return (
      <div className="border border-cream-faint bg-navy-mid p-8 text-center text-cream-dim">
        该病种下暂无收录的慈善赠药项目。
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {programs.map((program) => (
        <Link
          key={program.id}
          href={`/d/${diseaseSlug}/charity/${program.id}`}
          className="border border-cream-faint bg-navy-mid p-6 transition hover:border-gold"
        >
          <div className="text-xs tracking-widest text-gold">{program.company}</div>
          <div className="mt-2 text-lg text-cream">{program.drugName}</div>
          {program.indication ? (
            <div className="mt-2 text-sm text-cream-dim">{program.indication}</div>
          ) : null}
          <div className="mt-3 text-sm text-cream-dim">援助方案：{program.benefit}</div>
        </Link>
      ))}
    </div>
  );
}
