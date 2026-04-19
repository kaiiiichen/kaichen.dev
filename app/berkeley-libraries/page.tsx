import type { Metadata } from "next";
import Link from "next/link";
import { getUCBLibraryHours } from "@/lib/ucb-library-hours";
import type { UCBLibrary } from "@/lib/ucb-library-hours";

export const metadata: Metadata = {
  title: "UC Berkeley Library Hours",
  description:
    "Live open/closed status for UC Berkeley libraries, from lib.berkeley.edu (refreshed at most every 15 minutes).",
  openGraph: {
    title: "UC Berkeley Library Hours · Kai Chen",
    description: "Library availability scraped from the official Berkeley hours page.",
    url: "https://kaichen.dev/berkeley-libraries",
  },
};

function groupByStatus(libraries: UCBLibrary[]) {
  const open = libraries.filter((l) => l.status === "Open");
  const closed = libraries.filter((l) => l.status === "Closed");
  const unknown = libraries.filter((l) => l.status === "Unknown");
  return { open, closed, unknown };
}

function LibraryList({
  items,
  emptyLabel,
  tone,
}: {
  items: UCBLibrary[];
  emptyLabel: string;
  tone: "open" | "closed" | "unknown";
}) {
  const dot =
    tone === "open"
      ? "🟢"
      : tone === "closed"
        ? "🔴"
        : "⚪";

  if (items.length === 0) {
    return (
      <p
        style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 15 }}
        className="text-zinc-400 dark:text-zinc-600"
      >
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((lib) => (
        <li key={lib.name} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-0.5">
          <span className="shrink-0" aria-hidden>
            {dot}
          </span>
          <div className="min-w-0 flex-1">
            <a
              href={lib.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 16 }}
              className="text-zinc-800 dark:text-zinc-200 underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-600 hover:text-[#C4894F] dark:hover:text-[#D9A870] transition-colors"
            >
              {lib.name}
            </a>
            {lib.hours ? (
              <span
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 14 }}
                className="text-zinc-500 dark:text-zinc-500 sm:ml-2 block sm:inline"
              >
                {lib.hours}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function BerkeleyLibrariesPage() {
  const result = await getUCBLibraryHours();

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16 space-y-10">
      <div className="fade-up" style={{ animationDelay: "0ms" }}>
        <div className="mb-5">
          <Link
            href="/"
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: "0.8rem" }}
            className="inline-flex items-center gap-1.5 border border-[#C4894F] dark:border-[#D9A870] text-[#C4894F] dark:text-[#D9A870] hover:bg-[#C4894F] dark:hover:bg-[#D9A870] hover:text-white dark:hover:text-zinc-900 rounded-full px-3 py-1 transition-colors duration-150"
          >
            <span>←</span>
            <span>Home</span>
          </Link>
        </div>
        <h1
          style={{ fontFamily: "'Nunito'", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          className="text-zinc-900 dark:text-zinc-100 text-[32px] md:text-[42px]"
        >
          UC Berkeley Library Hours
        </h1>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 16, lineHeight: 1.75 }}
          className="text-zinc-600 dark:text-zinc-400 mt-4 max-w-2xl"
        >
          Parsed from the official{" "}
          <a
            href="https://www.lib.berkeley.edu/hours"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-600 hover:text-[#C4894F] dark:hover:text-[#D9A870]"
          >
            library hours
          </a>{" "}
          page. Data is cached for up to 15 minutes to avoid hammering their servers. Overnight and
          special hours may only appear on each library&apos;s detail page — check the official site
          when in doubt.
        </p>
      </div>

      {!result.ok ? (
        <div
          className="mag-card fade-up"
          style={{ animationDelay: "40ms" }}
        >
          <div className="mag-label">Could not load</div>
          <p style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 15 }} className="text-zinc-700 dark:text-zinc-300">
            {result.error}
          </p>
          <p
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 13 }}
            className="text-zinc-400 dark:text-zinc-600 mt-2"
          >
            Last attempt: {result.fetchedAt} (Pacific)
          </p>
        </div>
      ) : (
        <>
          <p
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 13, animationDelay: "30ms" }}
            className="text-zinc-400 dark:text-zinc-600 fade-up"
          >
            Last updated (Pacific): {result.fetchedAt}
          </p>

          {(() => {
            const { open, closed, unknown } = groupByStatus(result.libraries);
            return (
              <div className="grid grid-cols-1 gap-6 fade-up" style={{ animationDelay: "60ms" }}>
                <div className="mag-card">
                  <div className="mag-label">Now open ({open.length})</div>
                  <LibraryList items={open} emptyLabel="None listed as open right now." tone="open" />
                </div>

                <div className="mag-card">
                  <div className="mag-label">Now closed ({closed.length})</div>
                  <LibraryList items={closed} emptyLabel="None listed as closed." tone="closed" />
                </div>

                <div className="mag-card">
                  <div className="mag-label">Status unknown ({unknown.length})</div>
                  <LibraryList
                    items={unknown}
                    emptyLabel="No libraries in this category."
                    tone="unknown"
                  />
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
