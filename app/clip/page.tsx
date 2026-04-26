import Link from "next/link";
import type { Metadata } from "next";
import { getServerSupabase } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/clip/admin";
import type { ClipboardWithRole } from "@/lib/clip/types";
import SignInButton from "./sign-in-button";
import SignOutButton from "./sign-out-button";

export const metadata: Metadata = {
  title: "Clipboard Sync · Kai Chen",
  description: "Shared clipboard rooms, synced in real time.",
};

export const dynamic = "force-dynamic";

export default async function ClipHome() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16 space-y-8">
      <div className="fade-up flex items-end justify-between gap-4 flex-wrap" style={{ animationDelay: "0ms" }}>
        <div>
          <h1
            style={{ fontFamily: "'Nunito'", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}
            className="text-zinc-900 dark:text-zinc-100 text-[36px] md:text-[48px]"
          >
            Clipboard Sync
          </h1>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 15, lineHeight: 1.9 }}
            className="text-zinc-500 dark:text-zinc-500 mt-2"
          >
            A small place to ferry text between machines. Sign in with Google to see the rooms you can read or write.
          </p>
        </div>
        {user ? (
          <div
            className="flex items-center gap-3"
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
          >
            <span className="text-zinc-500 dark:text-zinc-500">{user.email}</span>
            <SignOutButton />
          </div>
        ) : null}
      </div>

      {!user ? (
        <div className="mag-card fade-up max-w-md" style={{ animationDelay: "60ms" }}>
          <div className="mag-label">Sign in</div>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.8 }}
            className="text-zinc-600 dark:text-zinc-400 mb-4"
          >
            Access is invite-only. After signing in, ask the admin to add you to a room.
          </p>
          <SignInButton next="/clip" />
        </div>
      ) : (
        <SignedInView userId={user.id} userEmail={user.email ?? null} />
      )}
    </div>
  );
}

async function SignedInView({ userId, userEmail }: { userId: string; userEmail: string | null }) {
  const supabase = await getServerSupabase();

  // RLS limits the visible rows to clipboards the user is a member of.
  const { data: memberships, error } = await supabase
    .from("clipboard_members")
    .select("role, clipboards(id, name, created_by, created_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mag-card max-w-md fade-up" style={{ animationDelay: "60ms" }}>
        <div className="mag-label">Error</div>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
          className="text-red-500 dark:text-red-400"
        >
          Couldn&apos;t load your rooms: {error.message}
        </p>
      </div>
    );
  }

  type MembershipRow = {
    role: "read" | "write";
    clipboards: {
      id: string;
      name: string;
      created_by: string | null;
      created_at: string;
    } | null;
  };

  const rooms: ClipboardWithRole[] = (memberships ?? [])
    .map((m) => {
      const row = m as unknown as MembershipRow;
      if (!row.clipboards) return null;
      return { ...row.clipboards, role: row.role };
    })
    .filter((r): r is ClipboardWithRole => r !== null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const isAdmin = isAdminEmail(userEmail);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up" style={{ animationDelay: "60ms" }}>
      <div className="mag-card md:col-span-2">
        <div className="mag-label">Your rooms</div>
        {rooms.length === 0 ? (
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.8 }}
            className="text-zinc-400 dark:text-zinc-600 py-2"
          >
            No rooms yet. Once an admin adds you to a clipboard, it will appear here.
          </p>
        ) : (
          <div>
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/clip/board/${room.id}`}
                className="group flex items-baseline justify-between gap-3 py-3 -mx-2 px-2 rounded-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all duration-150 no-underline"
                style={{ textDecoration: "none" }}
              >
                <span className="flex items-baseline gap-2 min-w-0 flex-1">
                  <span className="opacity-0 group-hover:opacity-100 text-[#C4894F] -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-xs shrink-0">
                    ↗
                  </span>
                  <span
                    style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 18, fontStyle: "italic" }}
                    className="text-zinc-800 dark:text-zinc-200 group-hover:text-[#C4894F] dark:group-hover:text-[#D9A870] transition-colors duration-150 line-clamp-1"
                  >
                    {room.name}
                  </span>
                  <span
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 10, letterSpacing: "0.05em" }}
                    className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 uppercase shrink-0"
                  >
                    {room.role}
                  </span>
                </span>
                <span
                  style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                  className="text-zinc-400 dark:text-zinc-600 shrink-0"
                >
                  {new Date(room.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {isAdmin ? (
        <div className="mag-card md:col-span-2">
          <div className="mag-label">Admin</div>
          <Link
            href="/clip/admin"
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
            className="text-[#C4894F] dark:text-[#D9A870] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Open admin panel →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
