import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Kai Chen",
};

const experience = [
  {
    role: "Peer Mentor",
    org: "SUSTech Zhicheng College, Shenzhen",
    period: "2024–2025",
    note: "300+ hours of one-to-one mentoring; recognized as Outstanding Peer Mentor.",
  },
  {
    role: "Teaching Assistant",
    org: "Lingnan University × SUSTech Wellness Ambassador Program, Hong Kong",
    period: "2024",
  },
  {
    role: "President",
    org: "SUSTech Psychology Society",
    period: "2024–2025",
  },
  {
    role: "Member",
    org: "Effective Altruism at UC Berkeley",
    period: "2026–present",
  },
  {
    role: "Member",
    org: "Project Reboot, UC Berkeley",
    period: "2026–present",
  },
];

const label = "w-24 shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 pt-0.5";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl font-bold mb-12 tracking-tight">
        About
      </h1>

      <div className="space-y-10">
        {/* Background */}
        <div className="flex gap-4">
          <span className={label}>Background</span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Kai Chen. Mathematics major (数学与应用数学) at Southern University of
            Science and Technology (SUSTech), currently visiting UC Berkeley (2026).
            Fields Medal Honors Program student. Previously attended a summer program
            in Deep Unsupervised Learning at the University of Oxford (2025).
          </p>
        </div>

        {/* Interests */}
        <div className="flex gap-4">
          <span className={label}>Interests</span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Broadly interested in the intersection of mathematics, data science,
            and AI — with a growing focus on AI governance and research with
            real-world impact. Committed to effective altruism;{" "}
            <Link
              href="https://www.givingwhatwecan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Giving What We Can
            </Link>{" "}
            pledger #10986.
          </p>
        </div>

        {/* Experience */}
        <div className="flex gap-4">
          <span className={label}>Experience</span>
          <ul className="space-y-4 flex-1">
            {experience.map((item) => (
              <li key={`${item.role}-${item.org}`} className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <span className="font-medium">{item.role}</span>
                {", "}
                {item.org}
                <span className="text-zinc-400 dark:text-zinc-600 ml-2 font-mono text-xs">
                  {item.period}
                </span>
                {item.note && (
                  <span className="text-zinc-500 dark:text-zinc-500">
                    {" "}— {item.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex gap-4">
          <span className={label}>Contact</span>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>
              <Link
                href="mailto:kaichen0728@gmail.com"
                className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                kaichen0728@gmail.com
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/kaiiiichen"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                github.com/kaiiiichen
              </Link>
            </li>
            <li>
              <Link
                href="https://linkedin.com/in/kaiiiichen"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                linkedin.com/in/kaiiiichen
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
