"use client";

import { useEffect, useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

const ALLOWED_EMAIL = "kaichen0728@gmail.com";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminGallery() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [denied, setDenied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState("");
  const [takenAt, setTakenAt] = useState(new Date().toISOString().slice(0, 10));
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      if (u && u.email !== ALLOWED_EMAIL) {
        setDenied(true);
        setUser(null);
        supabase.auth.signOut(); // fire-and-forget, UI updates immediately
        return;
      }
      if (!denied) setUser(u ?? null);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/admin/gallery` },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);

      const { error: insertErr } = await supabase.from("gallery_photos").insert({
        url: urlData.publicUrl,
        description: desc.trim() || null,
        taken_at: takenAt || null,
      });

      if (insertErr) throw new Error(insertErr.message);

      setSuccess(true);
      setFile(null);
      setDesc("");
      setTakenAt(new Date().toISOString().slice(0, 10));
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (user === undefined) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <p style={{ fontFamily: "'Nunito'" }} className="text-zinc-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 space-y-4">
        <h1 style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 32 }} className="text-zinc-900 dark:text-zinc-100">
          Admin · Gallery
        </h1>
        <p style={{ fontFamily: "'Bitter'", fontSize: 14 }} className="text-red-500">
          Access denied.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 space-y-6">
        <h1 style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 32 }} className="text-zinc-900 dark:text-zinc-100">
          Admin · Gallery
        </h1>
        <p style={{ fontFamily: "'Bitter'", fontSize: 14 }} className="text-zinc-500">
          Sign in to upload photos.
        </p>
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

  return (
    <div className="max-w-lg mx-auto px-6 py-16 space-y-8">
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 32 }} className="text-zinc-900 dark:text-zinc-100">
          Admin · Gallery
        </h1>
        <button
          onClick={signOut}
          style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 12 }}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mag-card space-y-5">
        {/* File input */}
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

        {/* Description */}
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

        {/* Date */}
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

        {error && (
          <p style={{ fontFamily: "'Nunito'", fontSize: 12 }} className="text-red-500">{error}</p>
        )}
        {success && (
          <p style={{ fontFamily: "'Nunito'", fontSize: 12 }} className="text-emerald-600 dark:text-emerald-400">Photo uploaded successfully.</p>
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
    </div>
  );
}
