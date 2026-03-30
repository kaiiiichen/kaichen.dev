"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseHalo() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const dark = document.documentElement.classList.contains("dark");
      const color = dark
        ? "rgba(91,191,160,0.06)"
        : "rgba(45,140,120,0.055)";
      el.style.background = `radial-gradient(700px at ${e.clientX}px ${e.clientY}px, ${color}, transparent 80%)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 30,
      }}
    />
  );
}
