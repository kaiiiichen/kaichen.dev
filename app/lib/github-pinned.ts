export type PinnedProject = {
  name: string;
  desc: string;
  href: string;
  repo: string;
  stack: string[];
};

/** Matches previous static list when GITHUB_TOKEN is missing or the API fails */
const FALLBACK_PINNED: PinnedProject[] = [
  {
    name: "kaichen.dev",
    desc: "Personal website and digital identity system.",
    href: "https://github.com/kaiiiichen/kaichen.dev",
    repo: "kaiiiichen/kaichen.dev",
    stack: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    name: "SUSTech-Kai-Notes",
    desc: "Open lecture notes for 20+ math and CS courses.",
    href: "https://github.com/kaiiiichen/SUSTech-Kai-Notes",
    repo: "kaiiiichen/SUSTech-Kai-Notes",
    stack: ["LaTeX"],
  },
  {
    name: "SudoSodoku",
    desc: "Terminal-style Sudoku for iOS. Minimalist, focus-driven.",
    href: "https://github.com/kaiiiichen/SudoSodoku",
    repo: "kaiiiichen/SudoSodoku",
    stack: ["Swift", "SwiftUI"],
  },
  {
    name: "kai-chen.xyz",
    desc: "Previous personal website, v1. Static.",
    href: "https://github.com/kaiiiichen/kai-chen.xyz",
    repo: "kaiiiichen/kai-chen.xyz",
    stack: ["HTML", "CSS"],
  },
];

/** GitHub profile whose pinned repos we mirror (override for forks / different accounts) */
export const GITHUB_PROFILE_LOGIN = process.env.GITHUB_LOGIN ?? "kaiiiichen";

const PINNED_QUERY = `
  query PinnedRepositories($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            nameWithOwner
            languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Repositories pinned on github.com/{login} (same order as profile).
 * Requires GITHUB_TOKEN. Falls back to a static list when unavailable.
 */
export async function getPinnedProjects(): Promise<PinnedProject[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return FALLBACK_PINNED;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: PINNED_QUERY,
        variables: { login: GITHUB_PROFILE_LOGIN },
      }),
      next: { revalidate: 120 },
    });

    const json: {
      data?: {
        user?: {
          pinnedItems?: {
            nodes?: Array<{
              name?: string;
              description?: string | null;
              url?: string;
              nameWithOwner?: string;
              languages?: { nodes?: Array<{ name?: string | null } | null> | null };
            } | null>;
          };
        };
      };
      errors?: unknown[];
    } = await res.json();

    if (!res.ok || json.errors?.length) {
      return FALLBACK_PINNED;
    }

    const nodes = json.data?.user?.pinnedItems?.nodes;
    if (!Array.isArray(nodes)) return FALLBACK_PINNED;

    const out: PinnedProject[] = [];
    for (const node of nodes) {
      if (!node?.nameWithOwner || !node.url || !node.name) continue;
      const langNames = (node.languages?.nodes ?? [])
        .map((n) => n?.name)
        .filter((n): n is string => Boolean(n));
      out.push({
        name: node.name,
        desc: node.description?.trim() ?? "",
        href: node.url,
        repo: node.nameWithOwner,
        stack: langNames.slice(0, 6),
      });
    }

    return out;
  } catch {
    return FALLBACK_PINNED;
  }
}
