import Link from "next/link";
import { ChannelIntro } from "@/components/home/ChannelIntro";
import { getTrialDisplayTitle } from "@/lib/trials/display";
import { listRecentTrials } from "@/lib/trials";

export async function LiveTrialsSection() {
  const trials = await listRecentTrials();
  return (
    <section id="trials" className="scroll-mt-28 px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ChannelIntro
          number="通道 01 / 05"
          icon="🔬"
          title="免费临床试验招募"
          description="整合ClinicalTrials.gov、ChiCTR等全球数据库，实时匹配正在招募中的临床试验。符合条件患者可免费使用在研新药。"
          meta="实时更新 · 今日招募中"
        />

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs tracking-[0.25em] text-gold">// 实时临床试验数据库</div>
            <h3 className="mt-4 font-serif text-2xl leading-tight text-cream md:text-4xl">
              今日正在招募的临床试验
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 border border-teal/30 bg-teal-dim px-4 py-2 text-xs tracking-widest text-teal">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal" />
            LIVE DATA
          </div>
        </div>

        <div className="mt-8 divide-y divide-cream-faint border border-cream-faint">
          {trials.map((trial) => (
            <Link
              key={trial.id}
              href={`/d/${trial.diseaseSlugs[0]}/trials/${trial.id}`}
              className="grid gap-4 bg-navy-mid/40 p-5 transition hover:bg-navy-light md:grid-cols-[140px_1fr_auto_auto_auto]"
            >
              <div className="font-mono text-xs text-cream-dim">{trial.sourceId}</div>
              <div>
                <div className="text-sm text-cream">{getTrialDisplayTitle(trial)}</div>
                <div className="mt-1 text-xs text-cream-dim">
                  {trial.diseaseLabel} · {trial.phase} · {trial.locations.join("、")}
                </div>
              </div>
              <span className="self-center border border-gold/30 bg-gold-dim px-3 py-1 text-[11px] tracking-wider text-gold">
                {trial.freeLabel ?? "免费用药"}
              </span>
              <span className="self-center border border-teal/30 bg-teal-dim px-3 py-1 text-[11px] tracking-wider text-teal">
                招募中
              </span>
              <span className="self-center text-cream-faint">→</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/d/fei-ai-egfr/trials"
            className="inline-block border border-cream-faint px-8 py-4 text-sm tracking-widest text-cream transition hover:border-gold hover:text-gold"
          >
            查看全部临床试验 →
          </Link>
        </div>
      </div>
    </section>
  );
}
