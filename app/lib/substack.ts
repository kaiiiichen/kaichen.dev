export type SubstackPost = {
  title: string;
  url: string;
  pubDate: string;
  description: string;
};

const FEEDS = [
  "https://substack.com/@kaiiiichen/feed",
  "https://kaiiiichen.substack.com/feed",
];

function extractTag(xml: string, tag: string): string {
  const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i").exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(xml);
  return plainMatch ? plainMatch[1].trim() : "";
}

/** Pure RSS XML → posts (first 3 items). Used by `getSubstackPosts` and tests. */
export function parseSubstackRssXml(xml: string): SubstackPost[] {
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  return itemBlocks.slice(0, 3).map((block) => {
    const title = extractTag(block, "title");
    const url = extractTag(block, "link") || extractTag(block, "guid");
    const pubDate = extractTag(block, "pubDate");
    const rawDesc = extractTag(block, "description").replace(/<[^>]+>/g, "");
    const description = rawDesc.slice(0, 100) + (rawDesc.length > 100 ? "…" : "");
    return { title, url, pubDate, description };
  });
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "kaichen.dev/1.0" },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const posts = parseSubstackRssXml(xml);
      if (posts.length > 0) return posts;
    } catch {
      // try next feed
    }
  }
  return [];
}
