import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#F2EBD9",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange triangle — bottom-right corner, matches icon.svg polygon */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 68,
            height: 68,
            background: "#E8A020",
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
        {/* KC text */}
        <span
          style={{
            fontFamily: "serif",
            fontWeight: 600,
            fontSize: 70,
            color: "#2A1F0E",
            lineHeight: 1,
          }}
        >
          KC
        </span>
      </div>
    ),
    { ...size }
  );
}
