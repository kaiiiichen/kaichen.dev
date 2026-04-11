"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-[var(--background)]">
      <div className="max-w-[1180px] mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            style={{ fontFamily: "'Nunito'", fontWeight: 300 }}
            className="text-base tracking-tight hover:opacity-70 transition-opacity"
          >
            Kai Chen
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5">
            {[
              { href: "/about", label: "About" },
              { href: "/projects", label: "Projects" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
                className="nav-wave text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://substack.com/@kaiiiichen"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
              className="nav-wave text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
            >
              Blog
            </a>
            <Link
              href="/gallery"
              style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
              className="nav-wave text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
            >
              Gallery
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
