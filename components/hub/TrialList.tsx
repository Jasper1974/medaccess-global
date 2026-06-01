import Link from "next/link";
import type { ClinicalTrialRecord } from "@/types/trial";
import { getTrialDisplayTitle } from "@/lib/trials/display";
import { trialDisplaySubtitle } from "@/lib/mock/hub-data";

interface TrialListProps {
  trials: ClinicalTrialRecord[];
  diseaseSlug: string;
}

export function TrialList({ trials, diseaseSlug }: TrialListProps) {
  if (trials.length === 0) {
    return (
      <div className="border border-cream-faint bg-navy-mid p-8 text-center text-cream-dim">
        该病种下暂无收录的招募试验，请联系顾问协助检索。
      </div>
    );
  }

  return (
    <div className="divide-y divide-cream-faint border border-cream-faint">
      {trials.map((trial) => (
        <Link
          key={trial.id}
          href={`/d/${diseaseSlug}/trials/${trial.id}`}
          className="grid gap-4 bg-navy-mid/50 p-5 transition hover:bg-navy-light md:grid-cols-[120px_1fr_auto_auto]"
        >
          <div className="font-mono text-xs text-cream-dim">{trial.sourceId}</div>
          <div>
            <div className="text-cream">{getTrialDisplayTitle(trial)}</div>
            <div className="mt-1 text-sm text-cream-dim">
              {trialDisplaySubtitle(trial)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {trial.isFree ? (
              <span className="border border-teal/40 bg-teal-dim px-2 py-1 text-xs text-teal">
                免费用药
              </span>
            ) : null}
            <span className="border border-gold/40 bg-gold-dim px-2 py-1 text-xs text-gold">
              招募中
            </span>
          </div>
          <span className="self-center text-gold">→</span>
        </Link>
      ))}
    </div>
  );
}
