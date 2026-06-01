import { NextResponse } from "next/server";
import { getBoaoById, listBoaoByDisease } from "@/lib/boao";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const diseaseSlug = searchParams.get("diseaseSlug")?.trim();

  if (id) {
    const item = await getBoaoById(id);
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

  const items = await listBoaoByDisease(diseaseSlug);
  return NextResponse.json({ items, count: items.length });
}
