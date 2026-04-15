import { NextResponse } from "next/server";
import {
  parseOpenMeteoForecast,
  type OpenMeteoForecastPayload,
} from "@/lib/weather-open-meteo";

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

  const data = (await res.json()) as OpenMeteoForecastPayload;
  const payload = parseOpenMeteoForecast(data);
  return NextResponse.json(payload);
}
