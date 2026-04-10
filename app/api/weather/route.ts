import { NextResponse } from "next/server";

const WMO: Record<number, { emoji: string; condition: string }> = {
  0:  { emoji: "☀️",  condition: "Clear" },
  1:  { emoji: "🌤️", condition: "Mainly clear" },
  2:  { emoji: "⛅",  condition: "Partly cloudy" },
  3:  { emoji: "☁️",  condition: "Overcast" },
  45: { emoji: "🌫️", condition: "Fog" },
  48: { emoji: "🌫️", condition: "Icy fog" },
  51: { emoji: "🌦️", condition: "Light drizzle" },
  53: { emoji: "🌦️", condition: "Drizzle" },
  55: { emoji: "🌦️", condition: "Heavy drizzle" },
  61: { emoji: "🌧️", condition: "Light rain" },
  63: { emoji: "🌧️", condition: "Rain" },
  65: { emoji: "🌧️", condition: "Heavy rain" },
  71: { emoji: "🌨️", condition: "Light snow" },
  73: { emoji: "🌨️", condition: "Snow" },
  75: { emoji: "🌨️", condition: "Heavy snow" },
  80: { emoji: "🌧️", condition: "Rain showers" },
  81: { emoji: "🌧️", condition: "Rain showers" },
  82: { emoji: "⛈️",  condition: "Violent showers" },
  95: { emoji: "⛈️",  condition: "Thunderstorm" },
  96: { emoji: "⛈️",  condition: "Thunderstorm" },
  99: { emoji: "⛈️",  condition: "Thunderstorm" },
};

export async function GET() {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=37.8715&longitude=-122.2730" +
    "&current=temperature_2m,weathercode" +
    "&hourly=precipitation_probability" +
    "&temperature_unit=celsius" +
    "&timezone=America%2FLos_Angeles" +
    "&forecast_days=1";

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return NextResponse.json({ error: "weather fetch failed" }, { status: 502 });

  const data = await res.json();

  const temperature: number = Math.round(data.current.temperature_2m);
  const weatherCode: number = data.current.weathercode;
  const { emoji, condition } = WMO[weatherCode] ?? { emoji: "🌡️", condition: "Unknown" };

  // Find current hour index in hourly data and take next 3 hours
  const nowHour = new Date().toISOString().slice(0, 13); // "2026-03-28T14"
  const times: string[] = data.hourly.time;
  const probs: number[] = data.hourly.precipitation_probability;
  const idx = times.findIndex((t: string) => t.startsWith(nowHour));
  const nextProbs = idx >= 0 ? probs.slice(idx, idx + 3) : probs.slice(0, 3);
  const rainChance = Math.max(...nextProbs.map((p) => p ?? 0));

  return NextResponse.json({ temperature, weatherCode, emoji, condition, rainChance });
}
