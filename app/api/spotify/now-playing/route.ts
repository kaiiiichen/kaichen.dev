import { getNowPlaying } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getNowPlaying();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5",
    },
  });
}
