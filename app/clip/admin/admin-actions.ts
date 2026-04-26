"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/clip/admin";
import type { ClipboardRole } from "@/lib/clip/types";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin(): Promise<{ id: string; email: string } | { error: string }> {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  if (!isAdminEmail(user.email)) return { error: "Forbidden." };
  return { id: user.id, email: user.email ?? "" };
}

export async function createClipboardAction(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { ok: false, error: auth.error };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Name is required." };

  const admin = getAdminSupabase();
  const { data, error } = await admin
    .from("clipboards")
    .insert({ name, created_by: auth.id })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Failed to create." };

  // Creator gets write access by default.
  await admin.from("clipboard_members").insert({
    clipboard_id: data.id,
    user_id: auth.id,
    role: "write",
  });

  revalidatePath("/clip/admin");
  revalidatePath("/clip");
  return { ok: true };
}

export async function deleteClipboardAction(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { ok: false, error: auth.error };

  const clipboardId = String(formData.get("clipboard_id") ?? "");
  if (!clipboardId) return { ok: false, error: "Missing clipboard id." };

  const admin = getAdminSupabase();
  const { error } = await admin.from("clipboards").delete().eq("id", clipboardId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/clip/admin");
  revalidatePath("/clip");
  return { ok: true };
}

export async function addMemberAction(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { ok: false, error: auth.error };

  const clipboardId = String(formData.get("clipboard_id") ?? "");
  const userId = String(formData.get("user_id") ?? "");
  const roleRaw = String(formData.get("role") ?? "read");
  const role: ClipboardRole = roleRaw === "write" ? "write" : "read";

  if (!clipboardId || !userId) return { ok: false, error: "Missing clipboard or user id." };

  const admin = getAdminSupabase();
  const { error } = await admin.from("clipboard_members").upsert(
    { clipboard_id: clipboardId, user_id: userId, role },
    { onConflict: "clipboard_id,user_id" }
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath("/clip/admin");
  revalidatePath("/clip");
  revalidatePath(`/clip/board/${clipboardId}`);
  return { ok: true };
}

export async function removeMemberAction(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { ok: false, error: auth.error };

  const clipboardId = String(formData.get("clipboard_id") ?? "");
  const userId = String(formData.get("user_id") ?? "");
  if (!clipboardId || !userId) return { ok: false, error: "Missing clipboard or user id." };

  const admin = getAdminSupabase();
  const { error } = await admin
    .from("clipboard_members")
    .delete()
    .eq("clipboard_id", clipboardId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/clip/admin");
  revalidatePath(`/clip/board/${clipboardId}`);
  return { ok: true };
}
