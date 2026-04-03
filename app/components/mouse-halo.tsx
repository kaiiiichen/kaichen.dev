"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseHalo() {
  const [mounted, setMounted] = useState(false);
  const [isInside, setIsInside] = useState(false);
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
    const onEnter = () => setIsInside(true);
    const onLeave = () => setIsInside(false);
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
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
        visibility: isInside ? "visible" : "hidden",
      }}
    />
  );
}
