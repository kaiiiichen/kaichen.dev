import NowPlaying from "./components/now-playing";
import GitHubActivity from "./components/GitHubActivity";
import LocalTime from "./components/local-time";
import Weather from "./components/Weather";

const DT = "w-24 shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 pt-0.5";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-end gap-4 mb-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight">
          Kai Chen{" "}
          <span className="font-normal" style={{ fontFamily: "'Chiron GoRound TC', sans-serif" }}>
            陈恺
          </span>
        </h1>
        <div className="flex items-center gap-3 pb-1">
          <a
            href="https://github.com/kaiiiichen"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/kaiiiichen"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
            </svg>
          </a>
          <a
            href="mailto:kaichen0728@gmail.com"
            aria-label="Email"
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
            </svg>
          </a>
        </div>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
        Builder, tinkerer, sometimes writer.
      </p>
      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg">
        I work on software and think about how technology shapes the way we pay
        attention. This site is a small corner of the internet where I keep
        notes on what I&apos;m building and thinking about.
      </p>

      <dl className="mt-10 space-y-4 text-sm">
        <div className="flex gap-4 fade-up" style={{ animationDelay: "0ms" }}>
          <dt className={DT}>Location</dt>
          <dd className="text-zinc-700 dark:text-zinc-300">
            Berkeley, CA — UC Berkeley visiting
          </dd>
        </div>
        <div className="flex gap-4 fade-up" style={{ animationDelay: "80ms" }}>
          <dt className={DT}>Local Time</dt>
          <dd className="text-zinc-700 dark:text-zinc-300">
            <LocalTime />
          </dd>
        </div>
        <div className="flex gap-4 fade-up" style={{ animationDelay: "160ms" }}>
          <dt className={DT}>Weather</dt>
          <dd className="text-zinc-700 dark:text-zinc-300">
            <Weather />
          </dd>
        </div>
        <div className="flex gap-4 fade-up" style={{ animationDelay: "240ms" }}>
          <dt className={DT}>Focus</dt>
          <dd className="text-zinc-700 dark:text-zinc-300">
            CS61A, Data100, CogSci175
          </dd>
        </div>
        <div className="flex gap-4 fade-up" style={{ animationDelay: "320ms" }}>
          <dt className={DT}>Thinking</dt>
          <dd className="text-zinc-700 dark:text-zinc-300">
            AI governance, what it means to do research that matters
          </dd>
        </div>
        <div className="flex gap-4 fade-up" style={{ animationDelay: "400ms" }}>
          <dt className={DT}>Spotify</dt>
          <dd className="text-zinc-700 dark:text-zinc-300">
            <NowPlaying />
          </dd>
        </div>
      </dl>

      <div className="mt-10 fade-up" style={{ animationDelay: "480ms" }}>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">
          GitHub Contribution
        </p>
        <GitHubActivity />
      </div>

    </div>
  );
}
