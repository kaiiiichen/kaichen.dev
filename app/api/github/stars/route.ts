import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get("repo");
  if (!repo) return NextResponse.json({ error: "missing repo" }, { status: 400 });

  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return NextResponse.json({ stars: 0 });

  const data = await res.json();
  return NextResponse.json({
    stars: data.stargazers_count ?? 0,
    archived: data.archived ?? false,
  });
}
