import NowPlaying from "./components/now-playing";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl font-bold mb-4 tracking-tight">
        Kai Chen
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
        Builder, tinkerer, sometimes writer.
      </p>
      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg">
        I work on software and think about how technology shapes the way we pay
        attention. This site is a small corner of the internet where I keep
        notes on what I&apos;m building and thinking about.
      </p>

      <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-zinc-800">
        <h2 className="font-serif text-xl font-bold mb-6 tracking-tight">Now</h2>
        <dl className="space-y-4 text-sm">
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 pt-0.5">
              Location
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">
              Berkeley, CA — UC Berkeley visiting
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 pt-0.5">
              Focus
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">
              COMPSCI 61A, DATA C100, COGSCI 175
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 pt-0.5">
              Thinking
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">
              AI governance, what it means to do research that matters
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 pt-0.5">
              Listening
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">
              <NowPlaying />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
