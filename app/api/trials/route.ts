import { NextResponse } from "next/server";
import { getTrialById, listTrialsByDisease } from "@/lib/trials";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const diseaseSlug = searchParams.get("diseaseSlug")?.trim();

  if (id) {
    const trial = await getTrialById(id);
    if (!trial) {
      return NextResponse.json({ error: "Trial not found" }, { status: 404 });
    }
    return NextResponse.json({ trial });
  }

  if (!diseaseSlug) {
    return NextResponse.json(
      { error: "Provide diseaseSlug or id query parameter" },
      { status: 400 },
    );
  }

  const trials = await listTrialsByDisease(diseaseSlug);
  return NextResponse.json({ trials, count: trials.length });
}
