interface ProofProps {
  children: React.ReactNode;
}

export default function Proof({ children }: ProofProps) {
  return (
    <div className="my-6 rounded-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-5 py-4">
      <div
        style={{ fontFamily: "'Bitter'", fontWeight: 400, fontStyle: "italic", fontSize: "0.9rem", lineHeight: 1.85 }}
        className="text-zinc-600 dark:text-zinc-400"
      >
        <span
          style={{ fontStyle: "normal", fontWeight: 600 }}
          className="text-zinc-700 dark:text-zinc-300 mr-1"
        >
          Proof.
        </span>
        {children}
        <span className="float-right not-italic select-none" aria-hidden>
          □
        </span>
      </div>
    </div>
  );
}
