import type { MockChannelItem } from "@/lib/mock/hub-data";

const CHANNEL_LABELS: Record<MockChannelItem["channel"], string> = {
  boao: "博鳌乐城",
  trials: "临床试验",
  hkmo: "港澳药械通",
  charity: "慈善赠药",
};

interface ChannelCardsProps {
  channels: MockChannelItem[];
}

export function ChannelCards({ channels }: ChannelCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="border border-cream-faint bg-navy-mid p-6 transition hover:border-gold"
        >
          <div className="text-xs tracking-[0.2em] text-gold">
            {CHANNEL_LABELS[channel.channel]}
          </div>
          <div className="mt-2 font-serif text-xl text-cream">{channel.title}</div>
          <p className="mt-3 text-sm leading-relaxed text-cream-dim">
            {channel.description}
          </p>
        </div>
      ))}
    </div>
  );
}
