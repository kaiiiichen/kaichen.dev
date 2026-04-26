"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/client";
import type { ClipboardEntry } from "@/lib/clip/types";

interface BoardRealtimeProps {
  clipboardId: string;
  initialEntries: ClipboardEntry[];
  canWrite: boolean;
  userId: string;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 30) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function BoardRealtime({
  clipboardId,
  initialEntries,
  canWrite,
  userId,
}: BoardRealtimeProps) {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [entries, setEntries] = useState<ClipboardEntry[]>(initialEntries);
  const [selectedId, setSelectedId] = useState<string | null>(initialEntries[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);

  const channelRef = useRef<RealtimeChannel | null>(null);

  // Refresh "x ago" labels every 30s without re-fetching.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`clipboard:${clipboardId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "clipboard_entries",
          filter: `clipboard_id=eq.${clipboardId}`,
        },
        (payload) => {
          const row = payload.new as ClipboardEntry;
          setEntries((prev) => {
            if (prev.some((e) => e.id === row.id)) return prev;
            return [row, ...prev];
          });
          setSelectedId((cur) => cur ?? row.id);
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [supabase, clipboardId]);

  const selected = useMemo(
    () => entries.find((e) => e.id === selectedId) ?? entries[0] ?? null,
    [entries, selectedId]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!canWrite) return;
      const content = draft;
      if (!content.trim()) return;
      setSubmitting(true);
      setError(null);
      try {
        const { error: insertError } = await supabase
          .from("clipboard_entries")
          .insert({ clipboard_id: clipboardId, user_id: userId, content });
        if (insertError) {
          setError(insertError.message);
        } else {
          setDraft("");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit");
      } finally {
        setSubmitting(false);
      }
    },
    [canWrite, draft, supabase, clipboardId, userId]
  );

  const onCopy = useCallback(async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be blocked; ignore silently.
    }
  }, [selected]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 fade-up" style={{ animationDelay: "60ms" }}>
      {/* Left — history list */}
      <aside className="mag-card md:max-h-[70vh] md:overflow-y-auto" style={{ padding: 0 }}>
        <div className="p-4 sticky top-0 bg-inherit z-10 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="mag-label" style={{ marginBottom: 0 }}>
            History · {entries.length}
          </div>
        </div>
        {entries.length === 0 ? (
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
            className="text-zinc-400 dark:text-zinc-600 px-4 py-3"
          >
            Nothing here yet.
          </p>
        ) : (
          <ul>
            {entries.map((entry) => {
              const isSelected = entry.id === (selected?.id ?? null);
              const preview = entry.content.replace(/\s+/g, " ").trim().slice(0, 80);
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(entry.id)}
                    className={`w-full text-left px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60 transition-colors duration-150 ${
                      isSelected
                        ? "bg-zinc-50 dark:bg-zinc-800/60"
                        : "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <div
                      style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.5 }}
                      className="text-zinc-700 dark:text-zinc-300 line-clamp-2"
                    >
                      {preview || "(empty)"}
                    </div>
                    <div
                      style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                      className="text-zinc-400 dark:text-zinc-600 mt-1"
                    >
                      {relativeTime(entry.created_at)}
                      {entry.user_id === userId ? " · you" : ""}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* Right — current editor + selected detail */}
      <section className="flex flex-col gap-4">
        <div className="mag-card">
          <div className="flex items-center justify-between">
            <div className="mag-label" style={{ marginBottom: 0 }}>
              {canWrite ? "New entry" : "Read-only"}
            </div>
            {!canWrite ? (
              <span
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.05em" }}
                className="text-zinc-400 dark:text-zinc-600 uppercase"
              >
                You can view but not write.
              </span>
            ) : null}
          </div>
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!canWrite || submitting}
              rows={6}
              placeholder={canWrite ? "Paste or type, then submit. Everyone in the room sees it instantly." : "Read-only — editing disabled"}
              style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, lineHeight: 1.6 }}
              className="w-full resize-y px-3 py-2 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#C4894F] dark:focus:border-[#D9A870] disabled:opacity-60"
            />
            <div className="flex items-center justify-between gap-2">
              <span
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                className="text-zinc-400 dark:text-zinc-600"
              >
                {error ?? `${draft.length} character${draft.length === 1 ? "" : "s"}`}
              </span>
              <button
                type="submit"
                disabled={!canWrite || submitting || !draft.trim()}
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 13, letterSpacing: "0.02em" }}
                className="px-4 py-1.5 rounded-sm border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-[#C4894F] dark:hover:border-[#D9A870] disabled:opacity-50 transition-colors duration-150"
              >
                {submitting ? "Sending…" : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <div className="mag-card">
          <div className="flex items-center justify-between">
            <div className="mag-label" style={{ marginBottom: 0 }}>
              {selected ? "Selected entry" : "No entry selected"}
            </div>
            {selected ? (
              <button
                type="button"
                onClick={onCopy}
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12 }}
                className="text-zinc-500 dark:text-zinc-500 hover:text-[#C4894F] dark:hover:text-[#D9A870] transition-colors"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            ) : null}
          </div>
          {selected ? (
            <>
              <div
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                className="text-zinc-400 dark:text-zinc-600 mt-2"
              >
                {new Date(selected.created_at).toLocaleString()} · {relativeTime(selected.created_at)}
                {selected.user_id === userId ? " · you" : ""}
              </div>
              <pre
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, lineHeight: 1.7 }}
                className="mt-3 whitespace-pre-wrap break-words text-zinc-800 dark:text-zinc-200"
              >
                {selected.content}
              </pre>
            </>
          ) : (
            <p
              style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13 }}
              className="text-zinc-400 dark:text-zinc-600 mt-2"
            >
              Submit something or pick an entry from the history.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
