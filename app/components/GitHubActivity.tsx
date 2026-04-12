"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Day = { date: string; count: number };
type LastCommit = { message: string; repo: string; sha: string; url: string; timeAgo: string };

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CELL = 16;
const GAP = 3;
const STEP = CELL + GAP;

function getColor(count: number): string {
  if (count === 0) return "var(--contribution-empty)";
  if (count <= 2) return "var(--contribution-l1)";
  if (count <= 5) return "var(--contribution-l2)";
  if (count <= 9) return "var(--contribution-l3)";
  return "var(--contribution-l4)";
}

function getMonthLabels(weeks: Day[][]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    if (!week[0]) return;
    const month = new Date(week[0].date).getUTCMonth();
    if (month !== lastMonth) {
      // skip first column to avoid clipping
      if (i > 0) labels.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });
  return labels;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function GitHubActivity() {
  const [weeks, setWeeks] = useState<Day[][]>([]);
  const [total, setTotal] = useState(0);
  const [lastCommit, setLastCommit] = useState<LastCommit | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{ date: string; count: number; rect: DOMRect } | null>(null);

  useEffect(() => {
    const clear = () => setHoveredInfo(null);
    window.addEventListener("scroll", clear, true);
    window.addEventListener("resize", clear);
    return () => {
      window.removeEventListener("scroll", clear, true);
      window.removeEventListener("resize", clear);
    };
  }, []);

  useEffect(() => {
    fetch("/api/github/contributions")
      .then((r) => r.json())
      .then((data: { weeks?: Day[][]; totalContributions?: number; lastCommit?: LastCommit }) => {
        if (data.weeks) setWeeks(data.weeks);
        if (data.totalContributions) setTotal(data.totalContributions);
        if (data.lastCommit) setLastCommit(data.lastCommit);
      })
      .catch(() => {});
  }, []);

  if (weeks.length === 0) return <div style={{ height: 108 }} />;

  const monthLabels = getMonthLabels(weeks);

  return (
    <div style={{ display: "inline-block" }}>
      {/* Month labels */}
      <div className="relative" style={{ height: 14, marginBottom: 4 }}>
        {monthLabels.map(({ label, col }) => (
          <span
            key={label + col}
            className="absolute font-mono text-zinc-400 dark:text-zinc-600"
            style={{ fontSize: 9, left: col * STEP, lineHeight: "14px" }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex" style={{ gap: GAP }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
            {week.map((day) => {
              const isHovered = hoveredInfo?.date === day.date;
              return (
                <div
                  key={day.date}
                  style={{ position: "relative" }}
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setHoveredInfo({ date: day.date, count: day.count, rect });
                  }}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  <div
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 2,
                      backgroundColor: getColor(day.count),
                      transform: isHovered ? "scale(1.8)" : "scale(1)",
                      transition: "transform 150ms ease",
                      position: "relative",
                      zIndex: isHovered ? 10 : 0,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Portal tooltip — renders into document.body to escape any overflow:hidden ancestor */}
      {hoveredInfo && typeof document !== "undefined" && createPortal(
        <div
          style={{
            position: "fixed",
            top: hoveredInfo.rect.top - 44 - 8,
            left: hoveredInfo.rect.left + hoveredInfo.rect.width / 2,
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.82)",
            color: "#fff",
            fontSize: 12,
            lineHeight: "1.4",
            padding: "4px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
            textAlign: "center",
          }}
        >
          <div>{formatDate(hoveredInfo.date)}</div>
          <div>{hoveredInfo.count === 0 ? "No contributions" : `${hoveredInfo.count} contribution${hoveredInfo.count === 1 ? "" : "s"}`}</div>
        </div>,
        document.body
      )}

      {total > 0 && (
        <p className="font-mono text-zinc-400 dark:text-zinc-600 mt-2" style={{ fontSize: 11 }}>
          {total.toLocaleString()} contributions in the last year
        </p>
      )}
    </div>
  );
}
