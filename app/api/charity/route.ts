import { NextResponse } from "next/server";
import { getCharityById, listCharityByDisease } from "@/lib/charity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const diseaseSlug = searchParams.get("diseaseSlug")?.trim();

  if (id) {
    const program = await getCharityById(id);
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }
    return NextResponse.json({ program });
  }

  if (!diseaseSlug) {
    return NextResponse.json(
      { error: "Provide diseaseSlug or id query parameter" },
      { status: 400 },
    );
  }

  const programs = await listCharityByDisease(diseaseSlug);
  return NextResponse.json({ programs, count: programs.length });
}
