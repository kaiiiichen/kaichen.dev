export default function Blog() {
  return (
    <div className="max-w-[1180px] mx-auto px-6 md:px-12 py-16">

      {/* Header */}
      <div className="mb-12 fade-up" style={{ animationDelay: "0ms" }}>
        <h1
          style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 48, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          className="text-zinc-900 dark:text-zinc-100"
        >
          Blog
        </h1>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontStyle: "italic", fontSize: 15, lineHeight: 1.8 }}
          className="text-zinc-400 dark:text-zinc-600 mt-3"
        >
          Thoughts are forming. Words are coming.
        </p>
        <div className="mt-6 w-full h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Empty state */}
      <div className="fade-up" style={{ animationDelay: "60ms" }}>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }}
          className="text-zinc-300 dark:text-zinc-700"
        >
          No posts yet.
        </p>
      </div>

    </div>
  );
}
