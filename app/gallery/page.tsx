"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

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

function formatDate(d: string | null): string {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    supabase
      .from("gallery_photos")
      .select("id, url, description, taken_at")
      .order("taken_at", { ascending: false })
      .then(({ data }) => setPhotos(data ?? []));
  }, []);

  function openLightbox(photo: Photo) {
    setClosing(false);
    setSelected(photo);
  }

  function closeLightbox() {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 200);
  }

  // ESC key + scroll lock
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selected]);

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16">

      {/* Header */}
      <div className="mb-12 fade-up" style={{ animationDelay: "0ms" }}>
        <h1
          style={{ fontFamily: "'Nunito'", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          className="text-zinc-900 dark:text-zinc-100 text-[36px] md:text-[48px]"
        >
          Gallery
        </h1>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.8 }}
          className="text-zinc-400 dark:text-zinc-600 mt-3"
        >
          Photos and moments.
        </p>
      </div>

      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-10" />

      {/* Grid */}
      {photos === null ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 fade-up" style={{ animationDelay: "60ms" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-sm bg-zinc-100 dark:bg-zinc-800/50" style={{ aspectRatio: "4/3" }} />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="fade-up" style={{ animationDelay: "60ms" }}>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontStyle: "italic", fontSize: 15 }}
            className="text-zinc-400 dark:text-zinc-600"
          >
            Photos and moments. More arriving soon.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 fade-up"
          style={{ animationDelay: "60ms" }}
        >
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => openLightbox(photo)}
              className="group relative overflow-hidden rounded-sm cursor-pointer p-0 border-0 bg-transparent"
              style={{
                aspectRatio: "4/3",
                boxShadow: "3px 3px 0px 0px var(--color-border-tertiary)",
                border: "1px solid var(--color-border-secondary)",
                borderBottom: "2px solid var(--color-border-primary)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "5px 5px 0px 0px var(--color-border-tertiary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px 0px var(--color-border-tertiary)";
              }}
              aria-label={photo.description ?? "Open photo"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.description ?? "Gallery photo"}
                className="w-full h-full object-cover block"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox — rendered via portal to escape stacking contexts */}
      {selected && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 99999,
            backgroundColor: "rgba(0,0,0,0.85)",
            opacity: closing ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
          onClick={closeLightbox}
        >
          {/* Modal */}
          <div
            className="relative flex flex-col items-center max-w-[95vw] md:max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors text-2xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.url}
              alt={selected.description ?? "Gallery photo"}
              className="max-w-[95vw] md:max-w-[80vw] max-h-[80vh] md:max-h-[70vh] object-contain block rounded-sm"
            />

            {/* Caption */}
            {(selected.description || selected.taken_at) && (
              <div className="mt-4 text-center space-y-1">
                {selected.description && (
                  <p
                    style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.6 }}
                    className="text-white/90"
                  >
                    {selected.description}
                  </p>
                )}
                {selected.taken_at && (
                  <p
                    style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11 }}
                    className="text-white/40"
                  >
                    {formatDate(selected.taken_at)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Admin entry — bottom, minimal icon */}
      <div className="flex justify-center mt-16">
        <Link
          href="/admin?next=/admin"
          aria-label="Admin"
          className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
          </svg>
        </Link>
      </div>

    </div>
  );
}
