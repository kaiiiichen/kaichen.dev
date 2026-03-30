import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 500 });
  }

  const now = new Date();
  const from = new Date(now);
  from.setFullYear(now.getFullYear() - 1);

  const STAR_REPOS = [
    "kaiiiichen/kaichen-dev",
    "kaiiiichen/SUSTech-Kai-Notes",
    "kaiiiichen/SudoSodoku",
    "kaiiiichen/kai-chen.xyz",
  ];

  const [graphqlRes, commitsRes, ...starResults] = await Promise.all([
    fetch("https://api.github.com/graphql", {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          login: "kaiiiichen",
          from: from.toISOString(),
          to: now.toISOString(),
        },
      }),
    }),
    fetch(
      "https://api.github.com/search/commits?q=author:kaiiiichen&sort=author-date&order=desc&per_page=1",
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.cloak-preview",
        },
      }
    ),
    ...STAR_REPOS.map((repo) =>
      fetch(`https://api.github.com/repos/${repo}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      })
    ),
  ]);

  if (!graphqlRes.ok) {
    return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
  }

  const data = await graphqlRes.json();
  const calendar =
    data?.data?.user?.contributionsCollection?.contributionCalendar;
  const rawWeeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
    calendar?.weeks ?? [];
  const totalContributions: number = calendar?.totalContributions ?? 0;

  const weeks = rawWeeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
  );

  let lastCommit: {
    message: string;
    repo: string;
    sha: string;
    url: string;
    timeAgo: string;
  } | null = null;

  if (commitsRes.ok) {
    const result = await commitsRes.json();
    const item = result?.items?.[0];
    if (item) {
      const sha = (item.sha as string).slice(0, 7);
      const repo: string = item.repository?.full_name ?? "";
      lastCommit = {
        message: ((item.commit?.message ?? "") as string).split("\n")[0].trim().slice(0, 72) || "(no message)",
        repo,
        sha,
        url: `https://github.com/${repo}/commit/${item.sha}`,
        timeAgo: timeAgo(item.commit?.author?.date ?? item.commit?.committer?.date),
      };
    }
  }

  const stars: Record<string, number> = {};
  await Promise.all(
    starResults.map(async (res, i) => {
      const repoName = STAR_REPOS[i].split("/")[1];
      if (res.ok) {
        const json = await res.json();
        stars[repoName] = json.stargazers_count ?? 0;
      }
    })
  );

  return NextResponse.json(
    { weeks, totalContributions, lastCommit, stars },
    { headers: { "Cache-Control": "no-store" } }
  );
}
