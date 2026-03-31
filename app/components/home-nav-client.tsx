"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "volunteering", label: "Volunteering" },
  { id: "focus", label: "Focus" },
  { id: "projects", label: "Projects" },
  { id: "github", label: "GitHub" },
] as const;

type SectionId = typeof NAV_ITEMS[number]["id"];

export default function HomeNavClient() {
  const [active, setActive] = useState<SectionId>("about");

  useEffect(() => {
    const intersecting = new Set<string>();

    const observers = NAV_ITEMS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            intersecting.add(id);
          } else {
            intersecting.delete(id);
          }

          if (intersecting.size === 0) return;

          let best: string = id;
          let bestTop = Infinity;
          for (const sectionId of intersecting) {
            const sectionEl = document.getElementById(sectionId);
            if (!sectionEl) continue;
            const top = Math.abs(sectionEl.getBoundingClientRect().top);
            if (top < bestTop) {
              bestTop = top;
              best = sectionId;
            }
          }
          setActive(best as SectionId);
        },
        { threshold: 0, rootMargin: "0px 0px -70% 0px" }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <nav className="flex flex-col gap-4 mb-10">
      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a key={id} href={`#${id}`} className="group flex items-center gap-3">
            <div
              className={`h-px transition-all duration-300 ${
                isActive
                  ? "w-14 bg-zinc-600 dark:bg-zinc-400"
                  : "w-7 bg-zinc-300 dark:bg-zinc-700 group-hover:w-14 group-hover:bg-zinc-500 dark:group-hover:bg-zinc-400"
              }`}
            />
            <span
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, letterSpacing: "0.1em" }}
              className={`uppercase transition-colors duration-200 ${
                isActive
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
              }`}
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
