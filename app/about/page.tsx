import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Kai Chen",
};

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl font-bold mb-10 tracking-tight">
        About
      </h1>
      <div className="space-y-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
        <p>
          I&apos;m Kai, a software engineer and product thinker based in
          Shenzhen, China. I&apos;m interested in the intersection of AI,
          tools for thought, and ambient computing.
        </p>
        <p>
          By day I build products. By night I run experiments, read
          widely, and occasionally write things down. This site is
          where the experiments surface.
        </p>
        <p>
          I believe in small sharp tools, slow thinking, and the
          long game.
        </p>
      </div>
    </div>
  );
}
