interface ChannelIntroProps {
  number: string;
  icon: string;
  title: string;
  description: string;
  meta: string;
}

export function ChannelIntro({
  number,
  icon,
  title,
  description,
  meta,
}: ChannelIntroProps) {
  return (
    <div className="border border-cream-faint bg-navy-mid p-8 md:p-10">
      <div className="text-xs tracking-widest text-cream-dim">{number}</div>
      <div className="mt-4 text-3xl">{icon}</div>
      <h2 className="mt-4 whitespace-pre-line font-serif text-2xl text-cream md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cream-dim md:text-base">
        {description}
      </p>
      <div className="mt-6 text-xs tracking-widest text-gold">{meta}</div>
    </div>
  );
}
