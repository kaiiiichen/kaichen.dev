import Link from "next/link";

const NOTES = [
  {
    num: "01",
    title: "Lecture Notes",
    desc: "Handwritten notes for MA219 Abstract Algebra (H) (Fall 2024) at SUSTech.",
    topics: [] as string[],
    href: "/notes/ma219/aa",
  },
];

export default function MA219Page() {
  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16">

      <div className="mb-12 fade-up" style={{ animationDelay: "0ms" }}>
        <div className="mb-5">
          <Link
            href="/notes"
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: "0.8rem" }}
            className="inline-flex items-center gap-1.5 border border-[#C4894F] dark:border-[#D9A870] text-[#C4894F] dark:text-[#D9A870] hover:bg-[#C4894F] dark:hover:bg-[#D9A870] hover:text-white dark:hover:text-zinc-900 rounded-full px-3 py-1 transition-colors duration-150"
          >
            <span>←</span>
            <span>Notes</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 mb-2.5">
          <span
            style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}
            className="text-[#C4894F] dark:text-[#D9A870]"
          >
            MA219
          </span>
          <span
            style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 14 }}
            className="text-zinc-500 dark:text-zinc-400"
          >
            SUSTech
          </span>
        </div>

        <h1
          style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: "2.5rem", letterSpacing: "-0.01em", lineHeight: 1.15 }}
          className="text-zinc-900 dark:text-zinc-100"
        >
          Abstract Algebra (H)
        </h1>

        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.8 }}
          className="text-zinc-400 dark:text-zinc-600 mt-3"
        >
          Groups, rings, and fields.
        </p>

        <div className="mt-6 w-full h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up" style={{ animationDelay: "60ms" }}>
        {NOTES.map(({ num, title, desc, topics, href }) => (
          <Link
            key={num}
            href={href}
            className="mag-card block group no-underline"
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="opacity-0 group-hover:opacity-100 text-[#C4894F] dark:text-[#D9A870] -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-xs shrink-0">
                ↗
              </span>
              <p
                style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 20, fontStyle: "italic" }}
                className="text-zinc-800 dark:text-zinc-200 group-hover:text-[#C4894F] dark:group-hover:text-[#D9A870] transition-colors duration-150"
              >
                {title}
              </p>
            </div>

            <p
              style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13, lineHeight: 1.7 }}
              className="text-zinc-500 dark:text-zinc-500 mb-3 pl-4"
            >
              {desc}
            </p>

            <div className="flex items-center justify-between pl-4">
              <div className="flex flex-wrap gap-1">
                {topics.map((tag) => (
                  <span
                    key={tag}
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 10 }}
                    className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                className="text-zinc-300 dark:text-zinc-700 group-hover:text-[#C4894F] dark:group-hover:text-[#D9A870] transition-colors duration-150 shrink-0 ml-2"
              >
                {num} ↗
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
