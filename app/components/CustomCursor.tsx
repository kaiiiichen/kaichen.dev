"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role=button], input, textarea, select, label")) {
        setHovered(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role=button], input, textarea, select, label")) {
        setHovered(false);
      }
    };

    const onDown = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: fixed;
        top: ${e.clientY - 16}px;
        left: ${e.clientX - 16}px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid rgba(45,140,120,0.7);
        pointer-events: none;
        z-index: 9998;
        animation: cursor-ripple 0.4s ease-out forwards;
      `;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onDown);

    const loop = () => {
      // dot: instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      // ring: lerp
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          opacity: hovered ? 0 : 1,
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          marginLeft: hovered ? -8 : 0,
          marginTop: hovered ? -8 : 0,
          background: hovered ? "rgba(45,140,120,0.25)" : "transparent",
          border: hovered ? "2px solid rgba(45,140,120,0.6)" : "2px solid rgba(45,140,120,0.7)",
        }}
      />
    </>
  );
}
