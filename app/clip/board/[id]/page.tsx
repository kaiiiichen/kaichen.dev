import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSupabase } from "@/lib/supabase/server";
import type { ClipboardEntry, ClipboardRole } from "@/lib/clip/types";
import BoardRealtime from "./board-realtime";
import SignOutButton from "../../sign-out-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await getServerSupabase();
  const { data } = await supabase.from("clipboards").select("name").eq("id", id).maybeSingle();
  return {
    title: data?.name ? `${data.name} · Clipboard Sync` : "Clipboard Sync",
  };
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/clip?next=${encodeURIComponent(`/clip/board/${id}`)}`);

  // Pull current user's role; RLS already restricts to rooms they belong to.
  const { data: membership } = await supabase
    .from("clipboard_members")
    .select("role")
    .eq("clipboard_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return (
      <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16">
        <div className="mag-card max-w-md">
          <div className="mag-label">No access</div>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.8 }}
            className="text-zinc-600 dark:text-zinc-400"
          >
            You don&apos;t have permission to view this clipboard. Ask the admin to add you.
          </p>
          <Link
            href="/clip"
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
            className="text-[#C4894F] dark:text-[#D9A870] underline underline-offset-2 mt-4 inline-block"
          >
            ← Back to rooms
          </Link>
        </div>
      </div>
    );
  }

  const role = membership.role as ClipboardRole;

  const { data: clipboard } = await supabase
    .from("clipboards")
    .select("id, name, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!clipboard) notFound();

  const { data: entryRows } = await supabase
    .from("clipboard_entries")
    .select("id, clipboard_id, user_id, content, created_at")
    .eq("clipboard_id", id)
    .order("created_at", { ascending: false })
    .limit(200);

  const initialEntries = (entryRows ?? []) as ClipboardEntry[];

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-12 space-y-6">
      <div className="fade-up flex items-end justify-between gap-4 flex-wrap" style={{ animationDelay: "0ms" }}>
        <div>
          <Link
            href="/clip"
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12, letterSpacing: "0.04em" }}
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            ← All rooms
          </Link>
          <h1
            style={{ fontFamily: "'Nunito'", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}
            className="text-zinc-900 dark:text-zinc-100 text-[28px] md:text-[36px] mt-1"
          >
            {clipboard.name}
          </h1>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
            className="text-zinc-400 dark:text-zinc-600 mt-1"
          >
            Created {new Date(clipboard.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {" · "}
            <span className="uppercase tracking-wider">{role}</span>
          </p>
        </div>
        <div
          className="flex items-center gap-3"
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
        >
          <span className="text-zinc-500 dark:text-zinc-500">{user.email}</span>
          <SignOutButton />
        </div>
      </div>

      <BoardRealtime
        clipboardId={clipboard.id}
        initialEntries={initialEntries}
        canWrite={role === "write"}
        userId={user.id}
      />
    </div>
  );
}
