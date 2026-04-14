interface TheoremProps {
  children: React.ReactNode;
  title?: string;
}

export default function Theorem({ children, title }: TheoremProps) {
  return (
    <div className="my-6 rounded-sm border-l-4 border-[#C4894F] dark:border-[#D9A870] bg-amber-50/60 dark:bg-amber-950/20 px-5 py-4">
      <div
        style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
        className="text-[#C4894F] dark:text-[#D9A870] mb-2"
      >
        Theorem{title ? ` (${title})` : ""}
      </div>
      <div
        style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.85 }}
        className="text-zinc-800 dark:text-zinc-200"
      >
        {children}
      </div>
    </div>
  );
}
