import Link from "next/link";
import { ChannelIntro } from "@/components/home/ChannelIntro";
import { listRecentHkmo } from "@/lib/hkmo";

const HKMO_HIGHLIGHTS = [
  "港澳已上市、内地未上市的药品与器械",
  "粤港澳大湾区「药械通」指定医疗机构",
  "在大湾区指定医院开方取药",
  "最快3-7天到药",
];

export async function HkmoSection() {
  const items = await listRecentHkmo(6);

  return (
    <section id="hkmo" className="scroll-mt-28 bg-navy-mid px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ChannelIntro
          number="通道 04 / 05"
          icon="🇭🇰"
          title="港澳药械通大湾区通道"
          description="港澳已上市、内地未上市的药品，通过粤港澳大湾区「药械通」政策，可在指定医疗机构合法获取。"
          meta="广东省药监局目录"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {HKMO_HIGHLIGHTS.map((item) => (
            <div
              key={item}
              className="border border-cream-faint bg-navy px-6 py-4 text-sm text-cream-dim"
            >
              · {item}
            </div>
          ))}
        </div>

        <div className="mt-10 divide-y divide-cream-faint border border-cream-faint">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/d/${item.diseaseSlugs[0]}/hkmo/${item.id}`}
              className="block bg-navy/40 p-5 transition hover:bg-navy-light"
            >
              <div className="text-xs text-gold">{item.hkmoBatch ?? "港澳药械通"}</div>
              <div className="mt-2 text-cream">{item.name}</div>
              <div className="mt-1 text-sm text-cream-dim">
                {item.diseaseLabel} · {item.approvedHospitals[0]}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/d/fei-ai-egfr/hkmo"
            className="inline-block border border-cream-faint px-8 py-4 text-sm tracking-widest text-cream transition hover:border-gold hover:text-gold"
          >
            查看港澳药械通目录 →
          </Link>
        </div>
      </div>
    </section>
  );
}
