import { ChannelIntro } from "@/components/home/ChannelIntro";

const HKMO_HIGHLIGHTS = [
  "港澳已上市、内地未上市的药品与器械",
  "粤港澳大湾区「药械通」指定医疗机构",
  "在大湾区指定医院开方取药",
  "最快3-7天到药",
];

export function HkmoSection() {
  return (
    <section id="hkmo" className="scroll-mt-28 bg-navy-mid px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ChannelIntro
          number="通道 04 / 05"
          icon="🇭🇰"
          title="港澳药械通大湾区通道"
          description="港澳已上市、内地未上市的药品，通过粤港澳大湾区「药械通」政策，可在指定医疗机构合法获取。"
          meta="大湾区指定医院可用"
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
      </div>
    </section>
  );
}
