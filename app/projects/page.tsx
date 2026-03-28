import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Kai Chen",
};

const projects = [
  {
    name: "kaichen.dev",
    description: "This site. A personal space for writing and experiments.",
    status: "active",
    href: "https://kaichen.dev",
  },
  {
    name: "Project B",
    description: "A tool for thinking. Details coming soon.",
    status: "building",
    href: null,
  },
  {
    name: "Project C",
    description: "An experiment in ambient interfaces.",
    status: "paused",
    href: null,
  },
];

const statusStyles: Record<string, string> = {
  active: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
  building: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  paused: "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600",
};

export default function Projects() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl font-bold mb-10 tracking-tight">
        Projects
      </h1>
      <ul className="space-y-8">
        {projects.map((project) => (
          <li key={project.name} className="border-b border-zinc-100 dark:border-zinc-800 pb-8 last:border-0">
            <div className="flex items-center gap-3 mb-2">
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline underline-offset-4"
                >
                  {project.name}
                </a>
              ) : (
                <span className="font-medium">{project.name}</span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusStyles[project.status]}`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              {project.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
