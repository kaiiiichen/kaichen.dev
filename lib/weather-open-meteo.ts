const WMO: Record<number, { emoji: string; condition: string }> = {
  0: { emoji: "☀️", condition: "Clear" },
  1: { emoji: "🌤️", condition: "Mainly clear" },
  2: { emoji: "⛅", condition: "Partly cloudy" },
  3: { emoji: "☁️", condition: "Overcast" },
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
  82: { emoji: "⛈️", condition: "Violent showers" },
  95: { emoji: "⛈️", condition: "Thunderstorm" },
  96: { emoji: "⛈️", condition: "Thunderstorm" },
  99: { emoji: "⛈️", condition: "Thunderstorm" },
};

export type OpenMeteoForecastPayload = {
  current: { temperature_2m: number; weathercode: number };
  hourly: { time: string[]; precipitation_probability: (number | null)[] };
};

export type ParsedOpenMeteoForecast = {
  temperature: number;
  weatherCode: number;
  emoji: string;
  condition: string;
  rainChance: number;
};

/** Maps Open-Meteo JSON to UI fields. Pass `now` for deterministic hour index (tests). */
export function parseOpenMeteoForecast(
  data: OpenMeteoForecastPayload,
  now: Date = new Date()
): ParsedOpenMeteoForecast {
  const temperature = Math.round(data.current.temperature_2m);
  const weatherCode = data.current.weathercode;
  const { emoji, condition } = WMO[weatherCode] ?? { emoji: "🌡️", condition: "Unknown" };

  const nowHour = now.toISOString().slice(0, 13);
  const times = data.hourly.time;
  const probs = data.hourly.precipitation_probability;
  const idx = times.findIndex((t) => t.startsWith(nowHour));
  const nextProbs = idx >= 0 ? probs.slice(idx, idx + 3) : probs.slice(0, 3);
  const rainChance = Math.max(...nextProbs.map((p) => p ?? 0));

  return { temperature, weatherCode, emoji, condition, rainChance };
}
