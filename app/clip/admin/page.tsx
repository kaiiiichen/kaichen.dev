import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSupabase } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/clip/admin";
import AdminPanel, { type AdminClipboard, type AdminUser } from "./admin-panel";
import SignOutButton from "../sign-out-button";

export const metadata: Metadata = {
  title: "Clipboard admin · Kai Chen",
};

export const dynamic = "force-dynamic";

export default async function ClipAdminPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/clip?next=/clip/admin");
  if (!isAdminEmail(user.email)) {
    return (
      <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16">
        <div className="mag-card max-w-md">
          <div className="mag-label">Forbidden</div>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.8 }}
            className="text-zinc-600 dark:text-zinc-400"
          >
            Signed in as <span className="font-mono">{user.email}</span>, which isn&apos;t on the admin list.
          </p>
          <Link
            href="/clip"
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
            className="text-[#C4894F] dark:text-[#D9A870] underline underline-offset-2 mt-4 inline-block"
          >
            ← Back to Clipboard Sync
          </Link>
        </div>
      </div>
    );
  }

  const admin = getAdminSupabase();

  // Fetch users (auth.admin is privileged; service-role required).
  const usersResult = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const users: AdminUser[] = (usersResult.data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? null,
    name:
      (u.user_metadata?.full_name as string | undefined) ??
      (u.user_metadata?.name as string | undefined) ??
      null,
    avatar_url: (u.user_metadata?.avatar_url as string | undefined) ?? null,
    created_at: u.created_at,
  }));

  const { data: clipboardRows } = await admin
    .from("clipboards")
    .select("id, name, created_at, created_by")
    .order("created_at", { ascending: false });

  const { data: memberRows } = await admin
    .from("clipboard_members")
    .select("clipboard_id, user_id, role, created_at");

  const { data: countRows } = await admin
    .from("clipboard_entries")
    .select("clipboard_id");

  const entryCounts = new Map<string, number>();
  for (const row of countRows ?? []) {
    const id = (row as { clipboard_id: string }).clipboard_id;
    entryCounts.set(id, (entryCounts.get(id) ?? 0) + 1);
  }

  const membersByClipboard = new Map<
    string,
    { user_id: string; role: "read" | "write"; created_at: string }[]
  >();
  for (const m of memberRows ?? []) {
    const row = m as {
      clipboard_id: string;
      user_id: string;
      role: "read" | "write";
      created_at: string;
    };
    const arr = membersByClipboard.get(row.clipboard_id) ?? [];
    arr.push({ user_id: row.user_id, role: row.role, created_at: row.created_at });
    membersByClipboard.set(row.clipboard_id, arr);
  }

  const clipboards: AdminClipboard[] = (clipboardRows ?? []).map((c) => {
    const row = c as {
      id: string;
      name: string;
      created_at: string;
      created_by: string | null;
    };
    return {
      id: row.id,
      name: row.name,
      created_at: row.created_at,
      created_by: row.created_by,
      members: membersByClipboard.get(row.id) ?? [],
      entry_count: entryCounts.get(row.id) ?? 0,
    };
  });

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-12 space-y-6">
      <div className="fade-up flex items-end justify-between gap-4 flex-wrap" style={{ animationDelay: "0ms" }}>
        <div>
          <Link
            href="/clip"
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12, letterSpacing: "0.04em" }}
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            ← Clipboard Sync
          </Link>
          <h1
            style={{ fontFamily: "'Nunito'", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}
            className="text-zinc-900 dark:text-zinc-100 text-[28px] md:text-[36px] mt-1"
          >
            Admin
          </h1>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
            className="text-zinc-500 dark:text-zinc-500 mt-1"
          >
            Manage rooms and members. {users.length} signed-up user{users.length === 1 ? "" : "s"}.
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

      <AdminPanel users={users} clipboards={clipboards} />
    </div>
  );
}
