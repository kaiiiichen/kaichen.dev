"use client";

import { useEffect, useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

const ALLOWED_EMAIL = "kaichen0728@gmail.com";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Photo = {
  id: string;
  url: string;
  description: string | null;
  taken_at: string | null;
};

function storagePathFromUrl(url: string): string {
  // Public URL format: .../storage/v1/object/public/gallery/{path}
  const marker = "/gallery/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : url;
}

export default function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [denied, setDenied] = useState(false);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState("");
  const [takenAt, setTakenAt] = useState(new Date().toISOString().slice(0, 10));
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Photos + delete state
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null); // inline confirm
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      if (u && u.email !== ALLOWED_EMAIL) {
        setDenied(true);
        setUser(null);
        supabase.auth.signOut();
        return;
      }
      if (!denied) setUser(u ?? null);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load photos once authed
  useEffect(() => {
    if (!user) return;
    supabase
      .from("gallery_photos")
      .select("id, url, description, taken_at")
      .order("taken_at", { ascending: false })
      .then(({ data }) => setPhotos(data ?? []));
  }, [user]);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/admin` },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);

      const { data: inserted, error: insertErr } = await supabase
        .from("gallery_photos")
        .insert({
          url: urlData.publicUrl,
          description: desc.trim() || null,
          taken_at: takenAt || null,
        })
        .select("id, url, description, taken_at")
        .single();

      if (insertErr) throw new Error(insertErr.message);

      setUploadSuccess(true);
      setFile(null);
      setDesc("");
      setTakenAt(new Date().toISOString().slice(0, 10));
      if (fileRef.current) fileRef.current.value = "";
      if (inserted) setPhotos((prev) => [inserted, ...(prev ?? [])]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photo: Photo) {
    setDeleting(photo.id);
    setDeleteError("");
    setConfirmId(null);

    try {
      const storagePath = storagePathFromUrl(photo.url);

      const { error: storageErr } = await supabase.storage
        .from("gallery")
        .remove([storagePath]);

      if (storageErr) throw new Error(`Storage: ${storageErr.message}`);

      const { error: dbErr } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", photo.id);

      if (dbErr) throw new Error(`DB: ${dbErr.message}`);

      setPhotos((prev) => (prev ?? []).filter((p) => p.id !== photo.id));
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  // ── Auth screens ────────────────────────────────────────────────

  if (user === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p style={{ fontFamily: "'Nunito'" }} className="text-zinc-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-4">
        <h1 style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 32 }} className="text-zinc-900 dark:text-zinc-100">Admin</h1>
        <p style={{ fontFamily: "'Bitter'", fontSize: 14 }} className="text-red-500">Access denied.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-6">
        <h1 style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 32 }} className="text-zinc-900 dark:text-zinc-100">Admin</h1>
        <p style={{ fontFamily: "'Bitter'", fontSize: 14 }} className="text-zinc-500">Sign in to manage the site.</p>
        <button
          onClick={signIn}
          style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 14 }}
          className="px-5 py-2.5 rounded-sm bg-[#C4894F] text-white hover:bg-[#b07843] transition-colors duration-150"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  // ── Authed ───────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-12">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 32 }} className="text-zinc-900 dark:text-zinc-100">
          Admin
        </h1>
        <button
          onClick={signOut}
          style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12 }}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* ── Upload ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mag-label">Gallery · Upload</div>

        <form onSubmit={handleUpload} className="mag-card space-y-5">
          <div>
            <label style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.1em" }} className="text-zinc-400 uppercase block mb-1.5">
              Photo
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ fontFamily: "'Nunito'", fontSize: 13 }}
              className="w-full text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-600 dark:file:text-zinc-400 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700 transition-colors"
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.1em" }} className="text-zinc-400 uppercase block mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              placeholder="A short caption…"
              style={{ fontFamily: "'Bitter'", fontSize: 14 }}
              className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-sm px-3 py-2 text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none focus:border-[#C4894F] transition-colors resize-none"
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.1em" }} className="text-zinc-400 uppercase block mb-1.5">
              Taken at (optional)
            </label>
            <input
              type="date"
              value={takenAt}
              onChange={(e) => setTakenAt(e.target.value)}
              style={{ fontFamily: "'Nunito'", fontSize: 13 }}
              className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-sm px-3 py-2 text-zinc-700 dark:text-zinc-300 outline-none focus:border-[#C4894F] transition-colors"
            />
          </div>

          {uploadError && (
            <p style={{ fontFamily: "'Nunito'", fontSize: 12 }} className="text-red-500">{uploadError}</p>
          )}
          {uploadSuccess && (
            <p style={{ fontFamily: "'Nunito'", fontSize: 12 }} className="text-emerald-600 dark:text-emerald-400">Photo uploaded.</p>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 14 }}
            className="px-5 py-2.5 rounded-sm bg-[#C4894F] text-white hover:bg-[#b07843] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </section>

      {/* ── Manage / Delete ─────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mag-label">Gallery · Manage</div>

        {deleteError && (
          <p style={{ fontFamily: "'Nunito'", fontSize: 12 }} className="text-red-500 mb-2">{deleteError}</p>
        )}

        {photos === null ? (
          <p style={{ fontFamily: "'Nunito'", fontSize: 13 }} className="text-zinc-400">Loading…</p>
        ) : photos.length === 0 ? (
          <p style={{ fontFamily: "'Bitter'", fontStyle: "italic", fontSize: 14 }} className="text-zinc-400 dark:text-zinc-600">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-sm overflow-hidden"
                style={{
                  aspectRatio: "4/3",
                  border: "1px solid var(--color-border-secondary)",
                  borderBottom: "2px solid var(--color-border-primary)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.description ?? "Gallery photo"}
                  className="w-full h-full object-cover block"
                  loading="lazy"
                />

                {/* Delete / Confirm controls — always visible */}
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                  {confirmId === photo.id ? (
                    <>
                      {/* Confirm */}
                      <button
                        onClick={() => handleDelete(photo)}
                        disabled={deleting === photo.id}
                        style={{ fontFamily: "'Nunito'", fontSize: 10 }}
                        className="px-1.5 py-0.5 rounded-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deleting === photo.id ? "…" : "delete"}
                      </button>
                      {/* Cancel */}
                      <button
                        onClick={() => setConfirmId(null)}
                        style={{ fontFamily: "'Nunito'", fontSize: 10 }}
                        className="px-1.5 py-0.5 rounded-sm bg-black/50 text-white/80 hover:bg-black/70 transition-colors"
                      >
                        cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmId(photo.id)}
                      aria-label="Delete photo"
                      className="w-6 h-6 rounded-sm flex items-center justify-center bg-black/50 text-white/70 hover:bg-black/80 hover:text-white transition-colors duration-150"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Caption */}
                {photo.description && (
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/40">
                    <p style={{ fontFamily: "'Bitter'", fontSize: 10 }} className="text-white/80 truncate">
                      {photo.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
