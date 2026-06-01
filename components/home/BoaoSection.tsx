import Link from "next/link";
import { ChannelIntro } from "@/components/home/ChannelIntro";
import { listRecentBoao } from "@/lib/boao";

const BOAO_HIGHLIGHTS = [
  "国内尚未上市、全球已获批的创新药械",
  "海南博鳌乐城先行区特许政策合法使用",
  "审批周期已压缩至10个工作日",
  "须本人前往海南指定医疗机构就诊",
];

export async function BoaoSection() {
  const items = await listRecentBoao(6);

  return (
    <section id="boao" className="scroll-mt-28 px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ChannelIntro
          number="通道 03 / 05"
          icon="🏥"
          title="海南博鳌乐城治疗项目"
          description="国内尚未上市、全球已获批的创新药械，可通过博鳌乐城先行区特许政策合法使用。患者须本人前往海南就诊，药在医院内使用。"
          meta="乐城特许药械目录"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {BOAO_HIGHLIGHTS.map((item) => (
            <div
              key={item}
              className="border border-cream-faint bg-navy-mid px-6 py-4 text-sm text-cream-dim"
            >
              · {item}
            </div>
          ))}
        </div>

        <div className="mt-10 divide-y divide-cream-faint border border-cream-faint">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/d/${item.diseaseSlugs[0]}/boao/${item.id}`}
              className="block bg-navy-mid/40 p-5 transition hover:bg-navy-light"
            >
              <div className="text-xs text-gold">
                {item.productType === "drug" ? "特许药品" : "特许器械"}
              </div>
              <div className="mt-2 text-cream">{item.name}</div>
              <div className="mt-1 text-sm text-cream-dim">
                {item.diseaseLabel} · {item.originRegion ?? "乐城特许"}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/d/fei-ai-egfr/boao"
            className="inline-block border border-cream-faint px-8 py-4 text-sm tracking-widest text-cream transition hover:border-gold hover:text-gold"
          >
            查看博鳌乐城目录 →
          </Link>
        </div>
      </div>
    </section>
  );
}
