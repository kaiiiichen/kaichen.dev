"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-[var(--background)]">
      <div className="max-w-[1180px] mx-auto px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-base font-bold tracking-tight hover:opacity-70 transition-opacity"
        >
          Kai Chen
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
