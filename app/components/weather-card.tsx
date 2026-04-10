"use client";
import { useEffect, useState } from "react";
import BerkeleyTime from "./berkeley-time";
import WeatherIllustration from "./WeatherIllustration";

type WeatherData = {
  temperature: number;
  weatherCode: number;
  emoji: string;
  condition: string;
  rainChance: number;
};

export default function WeatherCard() {
  const [w, setW] = useState<WeatherData | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then(setW)
      .catch(() => {});
  }, []);

  const displayTemp = w
    ? isCelsius
      ? `${w.temperature}°C`
      : `${Math.round(w.temperature * 9 / 5 + 32)}°F`
    : "—°";

  return (
    <div>
      {/* Location + time row */}
      <div className="flex items-baseline justify-between mb-1">
        <p
          style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 14, letterSpacing: "0.02em" }}
          className="text-zinc-600 dark:text-zinc-400 leading-tight"
        >
          Berkeley <span className="text-zinc-400 dark:text-zinc-600">· CA · US</span>
        </p>
        <p
          style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13 }}
          className="text-zinc-300 dark:text-zinc-600 leading-none"
        >
          <BerkeleyTime />
        </p>
      </div>

    <div className="flex flex-row items-center justify-between">
      {/* Left: temperature + condition */}
      <div className="flex items-center">
        <div style={{ width: 110, flexShrink: 0 }}>
          <button
            onClick={() => setIsCelsius((v) => !v)}
            style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 20, letterSpacing: "-0.01em" }}
            className="text-zinc-800 dark:text-zinc-200 leading-none cursor-pointer hover:text-[#C4894F] dark:hover:text-[#D9A870] transition-colors duration-150 bg-transparent border-none p-0 text-left"
            aria-label={`Switch to ${isCelsius ? "Fahrenheit" : "Celsius"}`}
          >
            {displayTemp}
          </button>
        </div>

        <div className="flex flex-col gap-0" style={{ marginLeft: 6 }}>
          <p
            style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 15 }}
            className="text-zinc-400 dark:text-zinc-500 leading-none"
          >
            {w ? w.condition : "—"}
          </p>
        </div>
      </div>

      {/* Right: weather illustration */}
      <div style={{ width: 100, height: 80, flexShrink: 0 }} className="text-zinc-400 dark:text-zinc-600">
        <WeatherIllustration weatherCode={w?.weatherCode ?? 3} />
      </div>
    </div>
    </div>
  );
}
