import Link from "next/link";

const COURSES: {
  code: string;
  name: string;
  institution: string;
  count: number;
  href: string;
  underConstruction?: boolean;
}[] = [
    {
      code: "CS61A",
      name: "Structure and Interpretation of Computer Programs",
      institution: "UC Berkeley",
      count: 2,
      href: "/notes/cs61a",
      underConstruction: true,
    },
    {
      code: "Data 100",
      name: "Principles and Techniques of Data Science",
      institution: "UC Berkeley",
      count: 0,
      href: "/notes/data100",
      underConstruction: true,
    },
    {
      code: "CS217",
      name: "Data Structures & Algorithm Analysis (H)",
      institution: "SUSTech",
      count: 1,
      href: "/notes/cs217",
    },
    {
      code: "MA337",
      name: "Real Analysis (H)",
      institution: "SUSTech",
      count: 1,
      href: "/notes/ma337",
    },
    {
      code: "MA232",
      name: "Complex Analysis (H)",
      institution: "SUSTech",
      count: 1,
      href: "/notes/ma232",
    },
    {
      code: "MA231",
      name: "Mathematical Analysis III (H)",
      institution: "SUSTech",
      count: 1,
      href: "/notes/ma231",
    },
    {
      code: "MA230",
      name: "Ordinary Differential Equations A (H)",
      institution: "SUSTech",
      count: 1,
      href: "/notes/ma230",
    },
    {
      code: "MA219",
      name: "Abstract Algebra (H)",
      institution: "SUSTech",
      count: 1,
      href: "/notes/ma219",
    },
    {
      code: "MA215",
      name: "Probability Theory",
      institution: "SUSTech",
      count: 1,
      href: "/notes/ma215",
    },
    {
      code: "MA121",
      name: "Advanced Linear Algebra II (H)",
      institution: "SUSTech",
      count: 1,
      href: "/notes/ma121",
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
          Personal notes collections. All things here are made by myself. For more general notes collection, please check out&nbsp;
          <a href="https://github.com/kaiiiichen/SUSTech-Kai-Notes" target="_blank" rel="noopener noreferrer" className="text-[#C4894F] dark:text-[#D9A870] hover:text-[#C4894F]/60 dark:hover:text-[#D9A870]/60 transition-colors duration-150">
            SUSTech-Kai-Notes
          </a>.
        </p>
        <div className="mt-6 w-full h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Course cards — two per row on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-up" style={{ animationDelay: "60ms" }}>
        {COURSES.map(({ code, name, institution, count, href, underConstruction }) => (
          <Link
            key={code}
            href={href}
            className="mag-card block group no-underline min-w-0"
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
                  {underConstruction
                    ? "under construction"
                    : count === 0
                      ? "coming soon"
                      : `${count} note${count !== 1 ? "s" : ""}`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
