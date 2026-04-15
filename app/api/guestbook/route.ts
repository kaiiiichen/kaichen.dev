import { NextResponse } from "next/server";
import { getSupabaseAnon } from "@/lib/supabase";

export async function POST(req: Request) {
  const { email, message } = await req.json();

  if (!email || !message) {
    return NextResponse.json({ error: "email and message required" }, { status: 400 });
  }

  const { error } = await getSupabaseAnon().from("guestbook").insert({
    email: email.trim(),
    message: message.trim(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
