import { NextResponse } from "next/server";
import { getUCBLibraryHours } from "@/lib/ucb-library-hours";

export async function GET() {
  const data = await getUCBLibraryHours();
  return NextResponse.json(data);
}
