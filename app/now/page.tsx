import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now — Kai Chen",
};

const now = {
  updatedAt: "March 2026",
  location: "Shenzhen, China",
  focus: [
    "Building kaichen.dev as a thinking space",
    "Exploring LLM-native tooling and ambient interfaces",
    "Reading more, shipping faster",
  ],
  thinking: [
    "What does it mean to pay attention in an age of infinite distraction?",
    "Whether small personal software is making a comeback",
    "The gap between how AI is hyped and how it actually fits into daily life",
  ],
  music: [
    { title: "Says", artist: "Nils Frahm" },
    { title: "Comptine d'un autre été", artist: "Yann Tiersen" },
    { title: "Re: Stacks", artist: "Bon Iver" },
  ],
};

export default function Now() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Now</h1>
        <span className="text-xs text-zinc-400 dark:text-zinc-600 font-mono">
          updated {now.updatedAt}
        </span>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">
            Location
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">{now.location}</p>
        </section>

        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">
            Focus
          </h2>
          <ul className="space-y-2">
            {now.focus.map((item) => (
              <li
                key={item}
                className="text-zinc-700 dark:text-zinc-300 flex gap-2"
              >
                <span className="text-zinc-300 dark:text-zinc-600 select-none">
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">
            Thinking about
          </h2>
          <ul className="space-y-2">
            {now.thinking.map((item) => (
              <li
                key={item}
                className="text-zinc-700 dark:text-zinc-300 flex gap-2"
              >
                <span className="text-zinc-300 dark:text-zinc-600 select-none">
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">
            Listening to
          </h2>
          <ul className="space-y-2">
            {now.music.map((track) => (
              <li key={track.title} className="flex gap-2 text-sm">
                <span className="text-zinc-300 dark:text-zinc-600 select-none">
                  —
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {track.title}
                </span>
                <span className="text-zinc-400 dark:text-zinc-600">
                  {track.artist}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
