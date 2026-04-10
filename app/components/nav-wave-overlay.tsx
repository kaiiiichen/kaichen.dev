"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const WAVE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='4'%3E%3Cpath d='M0 3 Q5 0 10 3 Q15 6 20 3' stroke='%23C4894F' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`;

export default function NavWaveOverlay() {
  const [rect, setRect] = useState<{ left: number; width: number; top: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleEnter = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      cancelAnimationFrame(frameRef.current);
      setRect({ left: r.left, width: r.width, top: r.bottom + 2 });
    };
    const handleLeave = () => {
      frameRef.current = requestAnimationFrame(() => setRect(null));
    };

    const links = document.querySelectorAll<HTMLElement>(".nav-wave");
    links.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });
    return () => {
      links.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: rect?.left ?? 0,
        top: rect?.top ?? 0,
        width: rect?.width ?? 0,
        height: 4,
        backgroundImage: WAVE_SVG,
        backgroundRepeat: "repeat-x",
        backgroundSize: "20px 4px",
        opacity: rect ? 1 : 0,
        transition: "opacity 0.15s ease",
        zIndex: 99999,
        pointerEvents: "none",
        animation: "nav-wave-flow 0.6s linear infinite",
        animationPlayState: rect ? "running" : "paused",
      }}
    />,
    document.body
  );
}
