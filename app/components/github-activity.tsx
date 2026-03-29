"use client";

import { useEffect, useRef, useState } from "react";

type Day = { date: string; count: number };
type LastCommit = { message: string; repo: string; sha: string; url: string; timeAgo: string };

function getColor(count: number): string {
  if (count === 0) return "var(--contribution-empty)";
  if (count <= 2) return "#c6e48b";
  if (count <= 5) return "#7bc96f";
  if (count <= 9) return "#239a3b";
  return "#196127";
}

function getMonthLabels(weeks: Day[][]): { label: string; colIndex: number }[] {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const labels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  let lastColIndex = -999;
  const MIN_COL_GAP = 3;
  weeks.forEach((week, i) => {
    if (!week[0]) return;
    const month = parseInt(week[0].date.split("-")[1]) - 1;
    if (month !== lastMonth) {
      if (i - lastColIndex >= MIN_COL_GAP) {
        labels.push({ label: MONTHS[month], colIndex: i });
        lastColIndex = i;
      }
      lastMonth = month;
    }
  });
  return labels;
}

// GitHub API: index 0 = Sun … 6 = Sat
const ROW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP; // 13px per column

const MONTH_ROW_H = 12;
const MONTH_ROW_MB = 4;
const DAY_LABEL_W = 24 + 4; // width + margin-right

export default function GitHubActivity() {
  const [allWeeks, setAllWeeks] = useState<Day[][]>([]);
  const [total, setTotal] = useState(0);
  const [lastCommit, setLastCommit] = useState<LastCommit | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/github/contributions")
      .then((r) => r.json())
      .then((data: { weeks?: Day[][]; totalContributions?: number; lastCommit?: LastCommit | null }) => {
        if (!data.weeks) return;
        setAllWeeks(data.weeks);
        setTotal(data.totalContributions ?? data.weeks.flat().reduce((s, d) => s + d.count, 0));
        if (data.lastCommit) setLastCommit(data.lastCommit);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (allWeeks.length === 0) return null;

  const naturalWidth = DAY_LABEL_W + allWeeks.length * STEP - GAP;
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / naturalWidth) : 1;
  const gridHeight = MONTH_ROW_H + MONTH_ROW_MB + 7 * STEP - GAP;

  const monthLabels = getMonthLabels(allWeeks);

  return (
    <div className="space-y-2" ref={containerRef}>
      {/* Outer container clips to container width; inner scales to fit */}
      <div style={{ width: "100%", overflow: "hidden", height: gridHeight * scale }}>
        <div
          style={{
            width: naturalWidth,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          <div className="flex items-start">
            {/* Day-of-week labels */}
            <div
              className="flex flex-col shrink-0 mr-1"
              style={{ gap: GAP, width: 24, marginTop: MONTH_ROW_H + MONTH_ROW_MB }}
            >
              {ROW_LABELS.map((label, i) => (
                <div
                  key={i}
                  style={{ height: CELL, lineHeight: `${CELL}px`, fontSize: 9 }}
                  className="font-mono text-zinc-400 dark:text-zinc-600 select-none"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Month labels + grid */}
            <div>
              {/* Month labels row */}
              <div
                className="relative select-none"
                style={{ height: MONTH_ROW_H, marginBottom: MONTH_ROW_MB, width: allWeeks.length * STEP - GAP }}
              >
                {monthLabels.map(({ label, colIndex }) => (
                  <span
                    key={label + colIndex}
                    className="absolute font-mono text-zinc-400 dark:text-zinc-600"
                    style={{ fontSize: 9, left: colIndex * STEP, lineHeight: `${MONTH_ROW_H}px` }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Contribution grid */}
              <div className="flex gap-[3px]">
                {allWeeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
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
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-zinc-400 dark:text-zinc-600" style={{ fontSize: 12 }}>
        {total.toLocaleString()} contributions in the last year
      </p>
      {lastCommit && (
        <p className="font-mono text-zinc-400 dark:text-zinc-600 truncate" style={{ fontSize: 12 }}>
          last commit ·{" "}
          <a
            href={`https://github.com/${lastCommit.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            {lastCommit.repo}
          </a>
          {" "}·{" "}
          &ldquo;{lastCommit.message}&rdquo;{" "}
          <a
            href={lastCommit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            {lastCommit.sha}
          </a>
          {" "}· {lastCommit.timeAgo}
        </p>
      )}
    </div>
  );
}
