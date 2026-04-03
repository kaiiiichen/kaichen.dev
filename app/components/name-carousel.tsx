"use client";

import { useEffect, useState } from "react";

const ITEMS = ["陳凱", "진 카이", "Kái Chén", "चेन काई", "تشن كاي"];

export default function NameCarousel() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // slide old text up
      setVisible(false);
      setAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ITEMS.length);
        setVisible(true);
        setTimeout(() => setAnimating(false), 300);
      }, 280);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 ml-2">
      {/* divider */}
      <span
        style={{ width: 1, height: "1em", background: "currentColor", opacity: 0.2, display: "inline-block", verticalAlign: "middle" }}
      />
      {/* sliding text */}
      <span
        style={{
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: "middle",
          height: "1.4em",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-instrument-serif)",
            fontSize: 20,
            transform: animating
              ? visible
                ? "translateY(0)"
                : "translateY(-110%)"
              : "translateY(0)",
            opacity: visible ? 1 : 0,
            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
          }}
          className="text-zinc-400 dark:text-zinc-600"
        >
          {ITEMS[index]}
        </span>
      </span>
    </span>
  );
}
