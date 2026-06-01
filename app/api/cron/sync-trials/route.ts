import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db/prisma";
import { syncClinicalTrials } from "@/lib/trials/sync-clinicaltrials";

export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 },
    );
  }

  let diseaseSlug: string | undefined;
  try {
    const body = (await request.json().catch(() => ({}))) as {
      diseaseSlug?: string;
    };
    diseaseSlug = body.diseaseSlug;
  } catch {
    diseaseSlug = undefined;
  }

  const result = await syncClinicalTrials({
    diseaseSlug,
    pageSize: 25,
    maxPages: 2,
  });

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
