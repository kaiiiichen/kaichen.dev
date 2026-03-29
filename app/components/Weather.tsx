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

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <span>
      {data.emoji} {data.temperature}°C · {data.condition}
      {data.rainChance > 0 && ` · ${data.rainChance}% chance of rain next 3h`}
    </span>
  );
}
