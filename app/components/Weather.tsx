"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temperature: number;
  emoji: string;
  condition: string;
  rainChance: number;
};

export default function Weather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .catch(() => {});
  }, []);

  return (
    <span className="flex flex-col gap-0.5">
      <span>Berkeley, CA</span>
      {time && <span>{time}</span>}
      {data && (
        <span>
          {data.temperature}°C · {data.condition}
          {data.rainChance > 0 && ` · ${data.rainChance}% chance of rain next 3h`}
        </span>
      )}
    </span>
  );
}
