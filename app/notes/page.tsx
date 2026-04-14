import Link from "next/link";

const COURSES = [
  {
    code: "CS61A",
    name: "Structure and Interpretation of Computer Programs",
    institution: "UC Berkeley",
    count: 1,
    href: "/notes/cs61a",
  },
];

export default function NotesPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-10 fade-up" style={{ animationDelay: "0ms" }}>
        <h1
          style={{ fontFamily: "'Nunito'", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          className="text-zinc-900 dark:text-zinc-100 text-[36px] md:text-[44px]"
        >
          Notes
        </h1>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.8 }}
          className="text-zinc-400 dark:text-zinc-600 mt-3"
        >
          Personal notes collections (under contruction).
        </p>
        <div className="mt-6 w-full h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Course cards */}
      <div className="flex flex-col gap-4 fade-up" style={{ animationDelay: "60ms" }}>
        {COURSES.map(({ code, name, institution, count, href }) => (
          <Link
            key={code}
            href={href}
            className="mag-card block group no-underline"
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}
                    className="text-[#C4894F] dark:text-[#D9A870]"
                  >
                    {code}
                  </span>
                  <span
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                    className="text-zinc-400 dark:text-zinc-600"
                  >
                    {institution}
                  </span>
                </div>
                <p
                  style={{ fontFamily: "'Bitter'", fontWeight: 400, fontStyle: "italic", fontSize: 16 }}
                  className="text-zinc-700 dark:text-zinc-300 group-hover:text-[#C4894F] dark:group-hover:text-[#D9A870] transition-colors duration-150"
                >
                  {name}
                </p>
              </div>
              <div className="shrink-0 self-center">
                <span
                  style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                  className="text-zinc-300 dark:text-zinc-700 group-hover:text-[#C4894F]/60 dark:group-hover:text-[#D9A870]/60 transition-colors"
                >
                  {count === 0 ? "coming soon" : `${count} note${count !== 1 ? "s" : ""}`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
