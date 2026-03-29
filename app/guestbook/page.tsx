import type { Metadata } from "next";
import MessageForm from "../components/Guestbook";

export const metadata: Metadata = {
  title: "Message — Kai Chen",
};

export default function MessagePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl font-bold mb-4 tracking-tight">Message</h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-12 leading-relaxed">
        Send me a note — I read every message.
      </p>
      <MessageForm />
    </div>
  );
}
