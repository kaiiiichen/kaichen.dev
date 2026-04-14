import type { Metadata } from "next";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "Notes | Kai Chen",
  description: "Lecture notes across math and CS courses.",
};

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16">
      {children}
    </div>
  );
}
