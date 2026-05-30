import { HeroSearch } from "@/components/home/HeroSearch";
import { BoaoSection } from "@/components/home/BoaoSection";
import { CharityProgramsSection } from "@/components/home/CharityProgramsSection";
import { DomesticPharmacySection } from "@/components/home/DomesticPharmacySection";
import { HkmoSection } from "@/components/home/HkmoSection";
import { LiveTrialsSection } from "@/components/home/LiveTrialsSection";
import { MatchFlowSection } from "@/components/home/MatchFlowSection";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-14 md:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(45,212,191,0.06),transparent_70%),radial-gradient(ellipse_40%_60%_at_10%_80%,rgba(201,168,76,0.08),transparent_60%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(244,241,235,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,235,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 border border-cream-faint px-3 py-1 text-xs tracking-[0.2em] text-cream-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            实时更新 · 全球覆盖 · 专业匹配
          </div>

          <h1 className="mt-8 max-w-3xl font-serif text-4xl leading-tight text-cream md:text-6xl">
            当国内无药可用，
            <br />
            <span className="text-gold">全球还有选择</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-cream-dim">
            整合全球 <strong className="font-normal text-cream">50万+临床试验</strong>
            、四大合规进药通道、慈善赠药项目，帮助重症患者找到国内找不到的药物与治疗机会。
          </p>

          <HeroSearch />

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "50万+", label: "全球临床试验\n实时收录" },
              { value: "355种", label: "博鳌特许药械\n国内合规可用" },
              { value: "200+", label: "药厂慈善援助\n项目收录" },
              { value: "48h", label: "专属顾问\n响应时效" },
            ].map((stat) => (
              <div key={stat.label} className="border-l border-cream-faint pl-4">
                <div className="font-serif text-3xl text-gold md:text-4xl">{stat.value}</div>
                <div className="mt-2 whitespace-pre-line text-sm text-cream-dim">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Disclaimer />
      <LiveTrialsSection />
      <CharityProgramsSection />
      <BoaoSection />
      <HkmoSection />
      <DomesticPharmacySection />
      <MatchFlowSection />

      <section id="about" className="scroll-mt-28 px-6 py-24 text-center md:px-14">
        <div className="mx-auto max-w-2xl">
          <div className="text-xs tracking-[0.25em] text-gold">// 关于我们</div>
          <h2 className="mt-4 font-serif text-3xl text-cream">MedAccess Global</h2>
          <p className="mt-6 leading-relaxed text-cream-dim">
            重症患者的全球用药导航平台。不卖药，做导航。帮助患者找到国内找不到的药物、
            免费临床试验与四大合规通道。导航免费，深度服务按需收费。
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
