import { OG_SIZE, OG_CONTENT_TYPE, makeOGImage } from "../lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return makeOGImage("About", "Background, experience & focus");
}
