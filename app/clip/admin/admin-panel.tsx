"use client";

import Link from "next/link";
import { useState, useTransition, useMemo } from "react";
import {
  addMemberAction,
  createClipboardAction,
  deleteClipboardAction,
  removeMemberAction,
} from "./admin-actions";

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface AdminClipboard {
  id: string;
  name: string;
  created_at: string;
  created_by: string | null;
  members: { user_id: string; role: "read" | "write"; created_at: string }[];
  entry_count: number;
}

interface Props {
  users: AdminUser[];
  clipboards: AdminClipboard[];
}

export default function AdminPanel({ users, clipboards }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(clipboards[0]?.id ?? null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = useMemo(
    () => clipboards.find((c) => c.id === selectedId) ?? clipboards[0] ?? null,
    [clipboards, selectedId]
  );

  const usersById = useMemo(() => {
    const m = new Map<string, AdminUser>();
    for (const u of users) m.set(u.id, u);
    return m;
  }, [users]);

  const memberIds = useMemo(
    () => new Set(selected?.members.map((m) => m.user_id) ?? []),
    [selected]
  );

  const nonMembers = useMemo(
    () => users.filter((u) => !memberIds.has(u.id)),
    [users, memberIds]
  );

  function runAction(
    action: (formData: FormData) => Promise<{ ok: true } | { ok: false; error: string }>,
    formData: FormData,
    onSuccess?: () => void
  ) {
    startTransition(async () => {
      const result = await action(formData);
      if (result.ok) {
        setFeedback({ kind: "ok", msg: "Saved." });
        onSuccess?.();
      } else {
        setFeedback({ kind: "err", msg: result.error });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 fade-up" style={{ animationDelay: "60ms" }}>
      {/* Left — clipboards list + create */}
      <aside className="flex flex-col gap-4">
        <div className="mag-card">
          <div className="mag-label">Create room</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const form = e.currentTarget;
              runAction(createClipboardAction, fd, () => form.reset());
            }}
            className="flex flex-col gap-2"
          >
            <input
              type="text"
              name="name"
              required
              placeholder="Room name"
              style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
              className="px-3 py-2 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#C4894F] dark:focus:border-[#D9A870]"
            />
            <button
              type="submit"
              disabled={pending}
              style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 13 }}
              className="self-end px-3 py-1.5 rounded-sm border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-[#C4894F] dark:hover:border-[#D9A870] disabled:opacity-50 transition-colors"
            >
              Create
            </button>
          </form>
        </div>

        <div className="mag-card" style={{ padding: 0 }}>
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="mag-label" style={{ marginBottom: 0 }}>
              Rooms · {clipboards.length}
            </div>
          </div>
          {clipboards.length === 0 ? (
            <p
              style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
              className="text-zinc-400 dark:text-zinc-600 px-4 py-3"
            >
              None yet — create one above.
            </p>
          ) : (
            <ul>
              {clipboards.map((c) => {
                const isSelected = c.id === (selected?.id ?? null);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full text-left px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60 transition-colors ${
                        isSelected
                          ? "bg-zinc-50 dark:bg-zinc-800/60"
                          : "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      <div
                        style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 16 }}
                        className="text-zinc-800 dark:text-zinc-200"
                      >
                        {c.name}
                      </div>
                      <div
                        style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                        className="text-zinc-400 dark:text-zinc-600 mt-0.5"
                      >
                        {c.members.length} member{c.members.length === 1 ? "" : "s"} · {c.entry_count} entr
                        {c.entry_count === 1 ? "y" : "ies"}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mag-card">
          <div className="mag-label">All users · {users.length}</div>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
                className="text-zinc-600 dark:text-zinc-400 break-all"
              >
                {u.email ?? "(no email)"}
                {u.name ? (
                  <span
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                    className="text-zinc-400 dark:text-zinc-600 ml-1"
                  >
                    · {u.name}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right — selected room detail */}
      <section className="flex flex-col gap-4">
        {feedback ? (
          <div
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
            className={
              feedback.kind === "ok"
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }
          >
            {feedback.msg}
          </div>
        ) : null}

        {!selected ? (
          <div className="mag-card">
            <p
              style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
              className="text-zinc-500 dark:text-zinc-500"
            >
              Pick a room from the left, or create one.
            </p>
          </div>
        ) : (
          <>
            <div className="mag-card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="mag-label" style={{ marginBottom: 0 }}>
                    Room
                  </div>
                  <h2
                    style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 22 }}
                    className="text-zinc-800 dark:text-zinc-200 mt-1"
                  >
                    {selected.name}
                  </h2>
                  <p
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                    className="text-zinc-400 dark:text-zinc-600 mt-1"
                  >
                    Created {new Date(selected.created_at).toLocaleString()} · {selected.entry_count} entr
                    {selected.entry_count === 1 ? "y" : "ies"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/clip/board/${selected.id}`}
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12 }}
                    className="text-[#C4894F] dark:text-[#D9A870] underline underline-offset-2"
                  >
                    Open room →
                  </Link>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!confirm(`Delete "${selected.name}" and all its history?`)) return;
                      const fd = new FormData(e.currentTarget);
                      runAction(deleteClipboardAction, fd);
                    }}
                  >
                    <input type="hidden" name="clipboard_id" value={selected.id} />
                    <button
                      type="submit"
                      disabled={pending}
                      style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12 }}
                      className="text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="mag-card">
              <div className="mag-label">Add member</div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const form = e.currentTarget;
                  runAction(addMemberAction, fd, () => form.reset());
                }}
                className="flex flex-col md:flex-row gap-2"
              >
                <input type="hidden" name="clipboard_id" value={selected.id} />
                <select
                  name="user_id"
                  required
                  defaultValue=""
                  style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
                  className="flex-1 px-3 py-2 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#C4894F] dark:focus:border-[#D9A870]"
                >
                  <option value="" disabled>
                    Select a user
                  </option>
                  {nonMembers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email ?? u.id}
                      {u.name ? ` (${u.name})` : ""}
                    </option>
                  ))}
                </select>
                <select
                  name="role"
                  defaultValue="read"
                  style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
                  className="px-3 py-2 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#C4894F] dark:focus:border-[#D9A870]"
                >
                  <option value="read">read</option>
                  <option value="write">write</option>
                </select>
                <button
                  type="submit"
                  disabled={pending || nonMembers.length === 0}
                  style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 13 }}
                  className="px-3 py-1.5 rounded-sm border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-[#C4894F] dark:hover:border-[#D9A870] disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </form>
              {nonMembers.length === 0 ? (
                <p
                  style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                  className="text-zinc-400 dark:text-zinc-600 mt-2"
                >
                  Every signed-up user is already in this room.
                </p>
              ) : null}
            </div>

            <div className="mag-card" style={{ padding: 0 }}>
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="mag-label" style={{ marginBottom: 0 }}>
                  Members · {selected.members.length}
                </div>
              </div>
              {selected.members.length === 0 ? (
                <p
                  style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
                  className="text-zinc-400 dark:text-zinc-600 px-4 py-3"
                >
                  No members yet.
                </p>
              ) : (
                <ul>
                  {selected.members.map((member) => {
                    const u = usersById.get(member.user_id);
                    return (
                      <li
                        key={member.user_id}
                        className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 flex items-center justify-between gap-3 flex-wrap"
                      >
                        <div className="min-w-0">
                          <div
                            style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 14 }}
                            className="text-zinc-800 dark:text-zinc-200 break-all"
                          >
                            {u?.email ?? member.user_id}
                          </div>
                          <div
                            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                            className="text-zinc-400 dark:text-zinc-600 mt-0.5"
                          >
                            {u?.name ? `${u.name} · ` : ""}
                            added {new Date(member.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const fd = new FormData(e.currentTarget);
                              runAction(addMemberAction, fd);
                            }}
                          >
                            <input type="hidden" name="clipboard_id" value={selected.id} />
                            <input type="hidden" name="user_id" value={member.user_id} />
                            <select
                              name="role"
                              defaultValue={member.role}
                              onChange={(e) => e.currentTarget.form?.requestSubmit()}
                              disabled={pending}
                              style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12 }}
                              className="px-2 py-1 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                            >
                              <option value="read">read</option>
                              <option value="write">write</option>
                            </select>
                          </form>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!confirm("Remove this member?")) return;
                              const fd = new FormData(e.currentTarget);
                              runAction(removeMemberAction, fd);
                            }}
                          >
                            <input type="hidden" name="clipboard_id" value={selected.id} />
                            <input type="hidden" name="user_id" value={member.user_id} />
                            <button
                              type="submit"
                              disabled={pending}
                              style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12 }}
                              className="text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              Remove
                            </button>
                          </form>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
