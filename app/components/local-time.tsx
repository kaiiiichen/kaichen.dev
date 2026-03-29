"use client";

import { useEffect, useState } from "react";

export default function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const time = now.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <span className="font-mono">
      {time} · {date}
    </span>
  );
}
