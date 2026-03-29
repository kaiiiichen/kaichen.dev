"use client";

import { useState } from "react";

const inputCls =
  "w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 py-1 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-colors";

export default function MessageForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setSent(true);
        setEmail("");
        setMessage("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Thanks — I&apos;ve received your message.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className={inputCls}
      />
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={5}
        maxLength={2000}
        className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 px-2 py-2 rounded-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-colors resize-y min-h-[120px]"
      />
      <button
        type="submit"
        disabled={submitting}
        className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors disabled:opacity-40"
      >
        {submitting ? "Sending…" : "Send →"}
      </button>
    </form>
  );
}
