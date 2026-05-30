import { ChannelIntro } from "@/components/home/ChannelIntro";

const BOAO_HIGHLIGHTS = [
  "国内尚未上市、全球已获批的创新药械",
  "海南博鳌乐城先行区特许政策合法使用",
  "审批周期已压缩至10个工作日",
  "须本人前往海南指定医疗机构就诊",
];

export function BoaoSection() {
  return (
    <section id="boao" className="scroll-mt-28 px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ChannelIntro
          number="通道 03 / 05"
          icon="🏥"
          title="海南博鳌乐城治疗项目"
          description="国内尚未上市、全球已获批的创新药械，可通过博鳌乐城先行区特许政策合法使用。患者须本人前往海南就诊，药在医院内使用。"
          meta="收录355种特许药械"
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
      </div>
    </section>
  );
}
