import { NextRequest, NextResponse } from "next/server";

/** ISR: refresh repo metadata often enough for archive / visibility to stay accurate */
export const revalidate = 120;

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60",
};

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get("repo");
  if (!repo) return NextResponse.json({ error: "missing repo" }, { status: 400 });

  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    return NextResponse.json({ stars: 0 }, { headers: cacheHeaders });
  }

  const data = await res.json();
  const visibility =
    typeof data.visibility === "string"
      ? (data.visibility as "public" | "private")
      : data.private
        ? "private"
        : "public";

  return NextResponse.json(
    {
      stars: data.stargazers_count ?? 0,
      archived: data.archived ?? false,
      visibility,
    },
    { headers: cacheHeaders }
  );
}
