import { ChannelIntro } from "@/components/home/ChannelIntro";

const PLATFORMS = [
  {
    name: "京东大药房",
    desc: "国内已上市药品，合规电商平台购药导流",
    tag: "国内有药",
  },
  {
    name: "阿里健康",
    desc: "国内已上市药品，在线问诊与购药服务",
    tag: "国内有药",
  },
  {
    name: "其他合规平台",
    desc: "经审核的国内合规医药电商平台与合作渠道",
    tag: "合作导流",
  },
];

export function DomesticPharmacySection() {
  return (
    <section id="domestic-pharmacy" className="scroll-mt-28 px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ChannelIntro
          number="通道 05 / 05"
          icon="💊"
          title="国内购药合作平台"
          description="国内已上市药品，平台提供合规购药导流服务。不参与药品交易，仅导航至京东大药房、阿里健康等合作平台。"
          meta="合规导流 · 不参与交易"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="border border-cream-faint bg-navy-mid p-6"
            >
              <span className="border border-gold/30 bg-gold-dim px-2 py-1 text-[10px] tracking-widest text-gold">
                {platform.tag}
              </span>
              <div className="mt-4 text-lg text-cream">{platform.name}</div>
              <p className="mt-2 text-sm text-cream-dim">{platform.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
