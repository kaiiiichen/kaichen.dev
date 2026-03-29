import { NextResponse } from "next/server";

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
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

  const [graphqlRes, commitsRes, eventsRes] = await Promise.all([
    fetch("https://api.github.com/graphql", {
      method: "POST",
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
    fetch("https://api.github.com/repos/kaiiiichen/kaichen-dev/commits?per_page=1", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("https://api.github.com/users/kaiiiichen/events?per_page=10", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (!graphqlRes.ok) {
    return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
  }

  const data = await graphqlRes.json();
  const rawWeeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
    data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

  const weeks = rawWeeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
  );

  // Try direct repo commits first, fall back to events PushEvent
  let lastCommit: { repo: string; message: string; ago: string } | null = null;

  if (commitsRes.ok) {
    const commits = await commitsRes.json();
    const c = commits?.[0];
    if (c) {
      const msg = (c.commit?.message ?? "").split("\n")[0].trim() || "(no message)";
      lastCommit = {
        repo: "kaiiiichen/kaichen-dev",
        message: msg.slice(0, 72),
        ago: timeAgo(c.commit?.author?.date ?? c.commit?.committer?.date),
      };
    }
  }

  if (!lastCommit && eventsRes.ok) {
    const events = await eventsRes.json();
    const push = events.find((e: { type: string }) => e.type === "PushEvent");
    if (push) {
      const msg = (push.payload?.commits?.[0]?.message ?? "").split("\n")[0].trim() || "(no message)";
      lastCommit = {
        repo: push.repo?.name ?? "",
        message: msg.slice(0, 72),
        ago: timeAgo(push.created_at),
      };
    }
  }

  return NextResponse.json(
    { weeks, lastCommit },
    { headers: { "Cache-Control": "no-store" } }
  );
}
