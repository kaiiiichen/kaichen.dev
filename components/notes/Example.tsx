interface ExampleProps {
  children: React.ReactNode;
  title?: string;
}

export default function Example({ children, title }: ExampleProps) {
  return (
    <div className="my-6 rounded-sm bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 px-5 py-4">
      <div
        style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
        className="text-green-700 dark:text-green-400 mb-2"
      >
        Example{title ? ` — ${title}` : ""}
      </div>
      <div
        style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.85 }}
        className="text-zinc-700 dark:text-zinc-300"
      >
        {children}
      </div>
    </div>
  );
}
