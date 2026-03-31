import type { Metadata } from "next";
import GalleryClient from "./gallery-client";

export const metadata: Metadata = {
  title: "Listening — Kai Chen",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
