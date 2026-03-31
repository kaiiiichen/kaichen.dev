"use client";

import { useState, useEffect } from "react";
const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#volunteering", label: "Volunteering" },
  { href: "#focus", label: "Focus" },
  { href: "#projects", label: "Projects" },
  { href: "#github", label: "GitHub" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
      >
        <span className="block h-px w-5 bg-zinc-600 dark:bg-zinc-400 transition-colors" />
        <span className="block h-px w-5 bg-zinc-600 dark:bg-zinc-400 transition-colors" />
        <span className="block h-px w-3 bg-zinc-600 dark:bg-zinc-400 transition-colors" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-1/2 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col px-6 py-8 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="self-end text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-10"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Links */}
        <nav className="flex flex-col gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, letterSpacing: "0.04em" }}
              className="uppercase text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
