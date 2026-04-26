"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";

export async function postClipboardEntry(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const clipboardId = String(formData.get("clipboard_id") ?? "").trim();
  const content = String(formData.get("content") ?? "");

  if (!clipboardId) return { ok: false, error: "Missing clipboard id." };
  if (!content.trim()) return { ok: false, error: "Content cannot be empty." };

  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  // RLS enforces that user must have role='write' on this clipboard.
  const { error } = await supabase.from("clipboard_entries").insert({
    clipboard_id: clipboardId,
    user_id: user.id,
    content,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/clip/board/${clipboardId}`);
  return { ok: true };
}
