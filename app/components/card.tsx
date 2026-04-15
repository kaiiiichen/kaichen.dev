"use client";

import { useRef, useCallback, useEffect, type ReactNode } from "react";

type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children:   ReactNode;
  className?: string;
  padding?:   Padding;
  maxTilt?:   number;
  static?:    boolean;
}

const PADDING: Record<Padding, string> = {
  none: "",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-6",
};

const LERP    = 0.07;
const MAX_S   = 1.02;
const DEF_TILT = 5;

export default function Card({
  children,
  className = "",
  padding   = "md",
  maxTilt   = DEF_TILT,
  static: isStatic = false,
}: CardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const cur   = useRef({ x: 0, y: 0, s: 1 });
  const tgt   = useRef({ x: 0, y: 0, s: 1 });
  const rafId = useRef(0);
  const mtRef = useRef(maxTilt);

  useEffect(() => {
    mtRef.current = maxTilt;
  }, [maxTilt]);

  const tick = useCallback(() => {
    function step() {
      const card = cardRef.current;
      if (!card) return;
      const { x: cx, y: cy, s: cs } = cur.current;
      const { x: tx, y: ty, s: ts } = tgt.current;

      const nx = cx + (tx - cx) * LERP;
      const ny = cy + (ty - cy) * LERP;
      const ns = cs + (ts - cs) * LERP;
      cur.current = { x: nx, y: ny, s: ns };

      const mag = Math.abs(nx) + Math.abs(ny);
      card.style.transform = `rotateX(${nx}deg) rotateY(${ny}deg) scale(${ns})`;
      card.style.boxShadow = `${(-ny * 0.4).toFixed(2)}px ${(nx * 0.4).toFixed(2)}px ${(12 + mag).toFixed(1)}px rgba(0,0,0,${(0.15 + mag * 0.003).toFixed(3)})`;

      const still = Math.abs(nx - tx) < 0.005 && Math.abs(ny - ty) < 0.005 && Math.abs(ns - ts) < 0.0005;
      if (still) {
        cur.current = { x: tx, y: ty, s: ts };
        rafId.current = 0;
      } else {
        rafId.current = requestAnimationFrame(step);
      }
    }
    step();
  }, []);

  const kick = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(tick);
  }, [tick]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el || isStatic) return;
    const r  = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width)  * 2 - 1;
    const py = ((e.clientY - r.top)  / r.height) * 2 - 1;
    tgt.current.x = -py * mtRef.current;
    tgt.current.y =  px * mtRef.current;
    kick();
  }, [isStatic, kick]);

  const onEnter = useCallback(() => {
    if (isStatic) return;
    tgt.current.s = MAX_S;
    kick();
  }, [isStatic, kick]);

  const onLeave = useCallback(() => {
    if (isStatic) return;
    tgt.current = { x: 0, y: 0, s: 1 };
    kick();
  }, [isStatic, kick]);

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return (
    <div
      ref={wrapRef}
      style={{ perspective: "1200px", position: "relative", height: "100%" }}
      onMouseMove ={isStatic ? undefined : onMove}
      onMouseEnter={isStatic ? undefined : onEnter}
      onMouseLeave={isStatic ? undefined : onLeave}
    >
      <div
        ref={cardRef}
        style={{ transformOrigin: "center center", willChange: isStatic ? "auto" : "transform", height: "100%" }}
        className={[
          "rounded-2xl border cursor-default overflow-hidden",
          "border-zinc-200/80 dark:border-zinc-700/50",
          "bg-gradient-to-br from-white to-zinc-50/80 dark:from-zinc-900 dark:to-zinc-800/30",
          PADDING[padding],
          className,
        ].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
