import { load } from "cheerio";

export const UCB_HOURS_URL = "https://www.lib.berkeley.edu/hours";

export type LibraryStatus = "Open" | "Closed" | "Unknown";

export type UCBLibrary = {
  name: string;
  status: LibraryStatus;
  hours: string | null;
  url: string;
};

export type UCBLibraryHoursResult =
  | {
      ok: true;
      libraries: UCBLibrary[];
      fetchedAt: string;
      sourceUrl: string;
    }
  | {
      ok: false;
      error: string;
      fetchedAt: string;
      sourceUrl: string;
    };

const HOURS_PATTERN =
  /(\d{1,2}\s+(?:a\.m\.|p\.m\.)\s*-\s*\d{1,2}\s+(?:a\.m\.|p\.m\.))/i;
const FLEX_HOURS =
  /(\d{1,2}\s*(?:a\.m\.|p\.m\.)\s*[-–—]\s*\d{1,2}\s*(?:a\.m\.|p\.m\.))/i;

function parseItemText(itemText: string): Pick<UCBLibrary, "status" | "hours"> {
  let status: LibraryStatus = "Unknown";
  let hours: string | null = null;

  if (/\bClosed\b/i.test(itemText)) {
    status = "Closed";
  } else if (HOURS_PATTERN.test(itemText)) {
    const m = itemText.match(HOURS_PATTERN);
    hours = m ? m[1] : null;
    status = "Open";
  } else if (/\d+\s*(?:a\.m\.|p\.m\.)/i.test(itemText)) {
    status = "Open";
    const fm = itemText.match(FLEX_HOURS);
    hours = fm ? fm[1] : null;
  }

  return { status, hours };
}

export function parseLibrariesFromHtml(html: string): UCBLibrary[] {
  const $ = load(html);
  const libraries: UCBLibrary[] = [];
  const seen = new Set<string>();

  $("li").each((_, li) => {
    const $li = $(li);
    const nameLink = $li.find('a[href*="/visit/"]').first();

    if (!nameLink.length) return;

    const name = nameLink.text().trim();
    if (!name || name.includes("View") || name.includes("Map") || seen.has(name)) {
      return;
    }
    seen.add(name);

    const itemText = $li.text().replace(/\s+/g, " ").trim();
    const { status, hours } = parseItemText(itemText);

    let href = nameLink.attr("href") ?? "";
    if (href && !href.startsWith("http")) {
      href = `https://www.lib.berkeley.edu${href}`;
    }

    libraries.push({ name, status, hours, url: href });
  });

  return libraries;
}

function pacificTimestamp(): string {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

/** Fetches and parses UCB library hours. Cached 15 minutes via Next fetch cache. */
export async function getUCBLibraryHours(): Promise<UCBLibraryHoursResult> {
  const fetchedAt = pacificTimestamp();
  try {
    const res = await fetch(UCB_HOURS_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; kaichen.dev/1.0; +https://kaichen.dev/berkeley-libraries)",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `HTTP ${res.status}`,
        fetchedAt,
        sourceUrl: UCB_HOURS_URL,
      };
    }

    const html = await res.text();
    const libraries = parseLibrariesFromHtml(html);

    if (libraries.length === 0) {
      return {
        ok: false,
        error: "Parsed 0 libraries (page structure may have changed).",
        fetchedAt,
        sourceUrl: UCB_HOURS_URL,
      };
    }

    return { ok: true, libraries, fetchedAt, sourceUrl: UCB_HOURS_URL };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: message,
      fetchedAt,
      sourceUrl: UCB_HOURS_URL,
    };
  }
}
