import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const svg = readFileSync(join(process.cwd(), "app/icon.svg"));
  const dataUrl = `data:image/svg+xml;base64,${svg.toString("base64")}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} width={180} height={180} alt="" />,
    { ...size }
  );
}
