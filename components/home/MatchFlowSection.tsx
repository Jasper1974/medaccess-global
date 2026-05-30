import Link from "next/link";

const MAIN_STEPS = [
  {
    step: "01",
    title: "添加平台企业微信",
    desc: "扫码添加专属顾问，建立一对一沟通渠道",
  },
  {
    step: "02",
    title: "上传医疗检查资料",
    desc: "发送病理、影像、出院小结等资料，可分批次发送",
  },
  {
    step: "03",
    title: "生成匹配报告",
    desc: "AI 整理病情要点，从数据库匹配试验、通道与援助项目",
  },
  {
    step: "04",
    title: "医生审核确认",
    desc: "专科顾问审核报告，形成可执行的导航方案",
  },
];

const OUTCOMES = [
  {
    id: "outcome-trials",
    step: "通路 01",
    title: "医学实验招募进组",
    desc: "匹配正在招募的临床试验，协助核实入组资格与申请流程",
    href: "/#trials",
    accent: "border-teal/40 bg-teal-dim",
  },
  {
    id: "outcome-charity",
    step: "通路 02",
    title: "慈善赠药",
    desc: "匹配药厂患者援助项目，协助准备申请材料",
    href: "/#charity",
    accent: "border-gold/40 bg-gold-dim",
  },
  {
    id: "outcome-drug-domestic",
    step: "通路 03",
    title: "国内有药 · 平台购药",
    desc: "国内已上市药品，导流至合规电商平台",
    href: "/#domestic-pharmacy",
    accent: "border-cream-faint bg-navy-light",
    items: ["京东大药房", "阿里健康等国内平台"],
  },
  {
    id: "outcome-drug-abroad",
    step: "通路 04",
    title: "国内无药 · 合规通道",
    desc: "国内尚未上市时，通过特许政策或大湾区通道获取",
    href: "/#boao",
    accent: "border-cream-faint bg-navy-light",
    items: ["海南博鳌乐城线下治疗", "港澳药械通指定医院"],
  },
];

function FlowArrow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-2 text-gold ${className}`}>
      <span className="text-xl leading-none">↓</span>
    </div>
  );
}

export function MatchFlowSection() {
  return (
    <section id="match-flow" className="scroll-mt-28 bg-navy-mid px-6 py-24 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs tracking-[0.25em] text-gold">// 匹配全流程</div>
        <h2 className="mt-4 font-serif text-3xl text-cream md:text-5xl">
          匹配四条通路全流程
        </h2>

        <div className="mx-auto mt-12 max-w-2xl">
          {MAIN_STEPS.map((item, index) => (
            <div key={item.step}>
              <div className="border border-cream-faint bg-navy p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-gold">{item.step}</span>
                  <div>
                    <div className="text-lg text-cream">{item.title}</div>
                    <p className="mt-1 text-sm text-cream-dim">{item.desc}</p>
                  </div>
                </div>
              </div>
              {index < MAIN_STEPS.length - 1 ? <FlowArrow /> : null}
            </div>
          ))}
        </div>

        <FlowArrow className="py-4" />

        <div className="text-center">
          <div className="inline-block border border-gold/40 bg-gold-dim px-6 py-2 text-sm tracking-widest text-gold">
            审核通过后 · 四个通路
          </div>
        </div>

        <FlowArrow className="py-4" />

        <div className="grid gap-4 sm:grid-cols-2">
          {OUTCOMES.map((outcome) => (
            <div
              key={outcome.id}
              id={outcome.id}
              className={`scroll-mt-28 border p-6 ${outcome.accent}`}
            >
              <div className="text-xs tracking-widest text-gold">{outcome.step}</div>
              <h3 className="mt-2 font-serif text-xl text-cream">{outcome.title}</h3>
              <p className="mt-2 text-sm text-cream-dim">{outcome.desc}</p>

              {"items" in outcome && outcome.items ? (
                <ul className="mt-4 space-y-2">
                  {outcome.items.map((item) => (
                    <li key={item} className="text-sm text-cream">
                      · {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link
                href={outcome.href}
                className="mt-4 inline-block text-sm text-gold transition hover:text-gold-light"
              >
                查看相关资源 →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
