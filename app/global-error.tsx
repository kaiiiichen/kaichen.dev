"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col items-center justify-center gap-4 px-6 bg-zinc-50 text-zinc-900">
        <p className="text-sm text-zinc-500">Something went wrong</p>
        {error.digest ? (
          <p className="text-xs text-zinc-400 font-mono">digest: {error.digest}</p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-100 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-transparent px-4 py-2 text-sm text-[#C4894F] underline-offset-2 hover:opacity-80"
          >
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
