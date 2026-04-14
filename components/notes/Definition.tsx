interface DefinitionProps {
  children: React.ReactNode;
  term?: string;
}

export default function Definition({ children, term }: DefinitionProps) {
  return (
    <div className="my-6 rounded-sm border border-[#C4894F]/25 dark:border-[#D9A870]/20 bg-[#C4894F]/5 dark:bg-[#D9A870]/5 px-5 py-4">
      <div
        style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
        className="text-[#C4894F] dark:text-[#D9A870] mb-2"
      >
        Definition{term ? ` — ${term}` : ""}
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
