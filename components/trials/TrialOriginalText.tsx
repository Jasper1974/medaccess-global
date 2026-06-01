interface TrialOriginalTextProps {
  label?: string;
  original: string;
}

export function TrialOriginalText({
  label = "查看英文原文",
  original,
}: TrialOriginalTextProps) {
  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-xs text-cream-dim transition hover:text-gold">
        {label}
      </summary>
      <p className="mt-2 text-sm leading-relaxed text-cream-dim">{original}</p>
    </details>
  );
}
