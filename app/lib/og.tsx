import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function makeOGImage(title: string, subtitle: string) {
  const avatar = readFileSync(join(process.cwd(), "public/avatar.jpg"));
  const avatarUrl = `data:image/jpeg;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: 1200, height: 630 }}>
        {/* Left: avatar photo, full height, object-cover */}
        <div style={{ width: 600, height: 630, display: "flex", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt=""
            style={{ width: 600, height: 630, objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        {/* Right: text panel */}
        <div
          style={{
            width: 600,
            height: 630,
            background: "#F7F3EE",
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px",
          }}
        >
          {/* Main content — centered vertically */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#1A1209",
                lineHeight: 1.1,
                marginBottom: 20,
                fontFamily: "serif",
              }}
            >
              {title}
            </div>
            {/* Amber divider line */}
            <div style={{ width: 56, height: 3, background: "#C4894F", marginBottom: 20 }} />
            <div
              style={{
                fontSize: 24,
                color: "#6B5B45",
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom: domain */}
          <div
            style={{
              fontSize: 16,
              color: "#C4894F",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            kaichen.dev
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
