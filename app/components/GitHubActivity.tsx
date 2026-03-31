"use client";

import { useEffect, useState } from "react";

type Day = { date: string; count: number };
type LastCommit = { message: string; repo: string; sha: string; url: string; timeAgo: string };

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CELL = 8;
const GAP = 1.5;
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

export default function GitHubActivity() {
  const [weeks, setWeeks] = useState<Day[][]>([]);
  const [total, setTotal] = useState(0);
  const [lastCommit, setLastCommit] = useState<LastCommit | null>(null);

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
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count}`}
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 2,
                  backgroundColor: getColor(day.count),
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {total > 0 && (
        <p className="font-mono text-zinc-400 dark:text-zinc-600 mt-2" style={{ fontSize: 11 }}>
          {total.toLocaleString()} contributions in the last year
        </p>
      )}
    </div>
  );
}
