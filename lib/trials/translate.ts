import { isMostlyChinese } from "./display";

export interface TranslatedTrialContent {
  titleCn: string;
  summaryCn: string;
  eligibilityCn: string;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function isTranslationConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function translateTrialContent(input: {
  title: string;
  summary: string;
  eligibility: string;
  diseaseLabel: string;
}): Promise<TranslatedTrialContent | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const titleCn = isMostlyChinese(input.title) ? input.title : null;
  const summaryCn = isMostlyChinese(input.summary) ? input.summary : null;
  const eligibilityCn = isMostlyChinese(input.eligibility) ? input.eligibility : null;

  if (titleCn && summaryCn && eligibilityCn) {
    return { titleCn, summaryCn, eligibilityCn };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            '你是医疗导航平台的翻译助手。将临床试验英文内容翻译成简体中文，准确、通俗易懂，适合患者家属阅读。不要添加诊断结论、疗效承诺或绝对化表述。只输出 JSON：{"titleCn":"","summaryCn":"","eligibilityCn":""}',
        },
        {
          role: "user",
          content: JSON.stringify({
            diseaseLabel: input.diseaseLabel,
            title: input.title,
            summary: truncate(input.summary, 1800),
            eligibility: truncate(input.eligibility, 1800),
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    throw new Error(`OpenAI translation failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content) as Partial<TranslatedTrialContent>;

  return {
    titleCn: titleCn ?? parsed.titleCn?.trim() ?? input.title,
    summaryCn: summaryCn ?? parsed.summaryCn?.trim() ?? input.summary,
    eligibilityCn: eligibilityCn ?? parsed.eligibilityCn?.trim() ?? input.eligibility,
  };
}
