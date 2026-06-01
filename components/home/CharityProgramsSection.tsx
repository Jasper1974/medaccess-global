import Link from "next/link";
import { ChannelIntro } from "@/components/home/ChannelIntro";
import { listRecentCharity } from "@/lib/charity";

export async function CharityProgramsSection() {
  const programs = await listRecentCharity(6);

  return (
    <section id="charity" className="scroll-mt-28 bg-navy-mid px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ChannelIntro
          number="通道 02 / 05"
          icon="🤝"
          title="慈善赠药患者援助项目"
          description="收录罗氏、阿斯利康、辉瑞、诺华等200+药厂慈善援助项目。大量患者不知道这些免费资源的存在，我们帮你匹配申请。"
          meta="药厂 PAP 项目收录"
        />

        <div className="mt-10">
          <div className="text-xs tracking-[0.25em] text-gold">// 慈善赠药项目数据库</div>
          <h3 className="mt-4 font-serif text-2xl text-cream md:text-4xl">正在申请的援助项目</h3>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/d/${program.diseaseSlugs[0]}/charity/${program.id}`}
              className="border border-cream-faint bg-navy p-6 transition hover:border-gold"
            >
              <div className="text-xs tracking-widest text-gold">{program.company}</div>
              <div className="mt-2 text-lg text-cream">{program.drugName}</div>
              <div className="mt-2 text-sm text-cream-dim">{program.indication}</div>
              <div className="mt-4 inline-block border border-gold/30 bg-gold-dim px-3 py-1 text-xs text-gold">
                {program.benefit}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/d/fei-ai-egfr/charity"
            className="inline-block border border-cream-faint px-8 py-4 text-sm tracking-widest text-cream transition hover:border-gold hover:text-gold"
          >
            查看全部慈善项目 →
          </Link>
        </div>
      </div>
    </section>
  );
}
