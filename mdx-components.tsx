import type { MDXComponents } from "mdx/types";
import Theorem from "@/components/notes/Theorem";
import Definition from "@/components/notes/Definition";
import Proof from "@/components/notes/Proof";
import Example from "@/components/notes/Example";
import NoteBlock from "@/components/notes/NoteBlock";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1
        style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: "1.8rem", lineHeight: 1.2, marginBottom: "0.75rem", marginTop: "2rem" }}
        className="text-zinc-900 dark:text-zinc-100"
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: "1.3rem", lineHeight: 1.3, marginBottom: "0.5rem", marginTop: "2rem" }}
        className="text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800 pb-2"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.4, marginBottom: "0.4rem", marginTop: "1.5rem" }}
        className="text-zinc-700 dark:text-zinc-300"
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p
        style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "1rem" }}
        className="text-zinc-700 dark:text-zinc-300"
      >
        {children}
      </p>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ children, className, ...props }: any) => {
      if (className) {
        return <code className={className} {...props}>{children}</code>;
      }
      return (
        <code
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em" }}
          className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded"
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.83rem", lineHeight: 1.7 }}
        className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm p-4 overflow-x-auto mb-5"
      >
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#C4894F] dark:border-[#D9A870] pl-4 my-5 italic text-zinc-500 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul
        style={{ fontFamily: "'Nunito'", fontSize: "0.95rem" }}
        className="list-disc pl-6 mb-4 space-y-1.5 text-zinc-700 dark:text-zinc-300"
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{ fontFamily: "'Nunito'", fontSize: "0.95rem" }}
        className="list-decimal pl-6 mb-4 space-y-1.5 text-zinc-700 dark:text-zinc-300"
      >
        {children}
      </ol>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[#C4894F] dark:text-[#D9A870] underline underline-offset-2 hover:opacity-70 transition-opacity"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-8 border-zinc-200 dark:border-zinc-800" />,
    table: ({ children }) => (
      <div className="my-5 overflow-x-auto">
        <table
          style={{ fontFamily: "'Nunito'", fontSize: "0.9rem" }}
          className="w-full border-collapse border border-zinc-200 dark:border-zinc-800 rounded-sm"
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-50 dark:bg-zinc-900">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-zinc-200 dark:border-zinc-800 last:border-0">{children}</tr>
    ),
    th: ({ children }) => (
      <th
        style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
        className="px-4 py-2.5 text-left text-zinc-500 dark:text-zinc-500 border-b border-zinc-200 dark:border-zinc-800"
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.6 }}
        className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300 align-top"
      >
        {children}
      </td>
    ),
    // Custom note components — available in all MDX files without importing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Theorem: Theorem as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Definition: Definition as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Proof: Proof as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Example: Example as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    NoteBlock: NoteBlock as any,
    ...components,
  };
}
