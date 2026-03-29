"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-base font-bold tracking-tight hover:opacity-70 transition-opacity"
        >
          Kai Chen
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <ul className="flex gap-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition-colors hover:text-foreground ${
                    pathname === href
                      ? "text-foreground"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
