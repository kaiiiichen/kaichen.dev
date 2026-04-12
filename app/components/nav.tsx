"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "/about", label: "About", external: false },
  { href: "/projects", label: "Projects", external: false },
  { href: "https://substack.com/@kaiiiichen", label: "Blog", external: true },
  { href: "/gallery", label: "Gallery", external: false },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-[var(--background)]">
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          style={{ fontFamily: "'Nunito'", fontWeight: 300 }}
          className="text-base tracking-tight hover:opacity-70 transition-opacity"
        >
          Kai Chen
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-5">
            {NAV_LINKS.map(({ href, label, external }) =>
              external ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
                  className="nav-wave text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
                  className="nav-wave text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
                >
                  {label}
                </Link>
              )
            )}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile: ThemeToggle + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 text-xl leading-none p-1"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-[var(--background)] px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
                className="text-base text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 py-2"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
                className="text-base text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 py-2"
              >
                {label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
