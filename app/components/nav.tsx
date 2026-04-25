"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

const WAVE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='4'%3E%3Cpath d='M0 3 Q5 0 10 3 Q15 6 20 3' stroke='%23C4894F' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`;

const NAV_LINKS = [
  { href: "/about", label: "About", external: false },
  { href: "/projects", label: "Projects", external: false },
  { href: "/notes", label: "Notes", external: false },
  { href: "https://news.kaichen.dev", label: "News", external: true },
  { href: "https://kaiiiichen.substack.com/", label: "Blog", external: true },
];

export default function Nav() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [waveRect, setWaveRect] = useState<{ left: number; width: number; top: number } | null>(null);
  const waveLeaveFrame = useRef(0);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const onWaveEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    cancelAnimationFrame(waveLeaveFrame.current);
    setWaveRect({ left: r.left, width: r.width, top: r.bottom + 2 });
  }, []);

  const onWaveLeave = useCallback(() => {
    waveLeaveFrame.current = requestAnimationFrame(() => setWaveRect(null));
  }, []);

  const waveProps = {
    onMouseEnter: onWaveEnter,
    onMouseLeave: onWaveLeave,
  };

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
    <>
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
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
                  {...waveProps}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  style={{ fontFamily: "'Nunito'", fontWeight: 400 }}
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
                  {...waveProps}
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
            <span
              className="inline-block transition-transform duration-200 ease-in-out"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              {isOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown — always mounted, animated via max-height + opacity */}
      <div
        className={`md:hidden overflow-hidden bg-[var(--background)] transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-64 opacity-100 border-t border-zinc-200 dark:border-zinc-800"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, external }, i) => {
            const linkClass = `text-base text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200 py-2 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            }`;
            const linkStyle = {
              fontFamily: "'Nunito'",
              fontWeight: 400,
              transitionDelay: isOpen ? `${60 + i * 40}ms` : "0ms",
            };
            return external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                style={linkStyle}
                className={linkClass}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                style={linkStyle}
                className={linkClass}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
    {mounted
      ? createPortal(
          <div
            style={{
              position: "fixed",
              left: waveRect?.left ?? 0,
              top: waveRect?.top ?? 0,
              width: waveRect?.width ?? 0,
              height: 4,
              backgroundImage: WAVE_SVG,
              backgroundRepeat: "repeat-x",
              backgroundSize: "20px 4px",
              opacity: waveRect ? 1 : 0,
              transition: "opacity 0.15s ease",
              zIndex: 99999,
              pointerEvents: "none",
              animation: "nav-wave-flow 0.6s linear infinite",
              animationPlayState: waveRect ? "running" : "paused",
            }}
          />,
          document.body
        )
      : null}
    </>
  );
}
