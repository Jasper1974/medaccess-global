import { NextResponse } from "next/server";
import { getHkmoById, listHkmoByDisease } from "@/lib/hkmo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const diseaseSlug = searchParams.get("diseaseSlug")?.trim();

  if (id) {
    const item = await getHkmoById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
  }

  if (!diseaseSlug) {
    return NextResponse.json(
      { error: "Provide diseaseSlug or id query parameter" },
      { status: 400 },
    );
  }

  const items = await listHkmoByDisease(diseaseSlug);
  return NextResponse.json({ items, count: items.length });
}
