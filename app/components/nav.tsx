"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Nav() {
  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800">
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
