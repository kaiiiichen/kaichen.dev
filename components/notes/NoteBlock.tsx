interface NoteBlockProps {
  children: React.ReactNode;
}

export default function NoteBlock({ children }: NoteBlockProps) {
  return (
    <div className="my-6 rounded-sm bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 px-5 py-4">
      <div
        style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
        className="text-yellow-700 dark:text-yellow-400 mb-2"
      >
        Note
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
