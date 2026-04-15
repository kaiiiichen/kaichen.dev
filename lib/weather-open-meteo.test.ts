import { describe, expect, it } from "vitest";
import { parseOpenMeteoForecast, type OpenMeteoForecastPayload } from "@/lib/weather-open-meteo";

describe("parseOpenMeteoForecast", () => {
  it("maps current fields, WMO lookup, and rain chance from hourly window", () => {
    const now = new Date("2026-03-28T14:30:00.000Z");
    const data: OpenMeteoForecastPayload = {
      current: { temperature_2m: 18.4, weathercode: 0 },
      hourly: {
        time: [
          "2026-03-28T13:00",
          "2026-03-28T14:00",
          "2026-03-28T15:00",
          "2026-03-28T16:00",
        ],
        precipitation_probability: [10, 20, 30, 40],
      },
    };
    const out = parseOpenMeteoForecast(data, now);
    expect(out.temperature).toBe(18);
    expect(out.weatherCode).toBe(0);
    expect(out.emoji).toBe("☀️");
    expect(out.condition).toBe("Clear");
    expect(out.rainChance).toBe(40);
  });
});
