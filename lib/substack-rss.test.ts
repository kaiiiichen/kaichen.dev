import { describe, expect, it } from "vitest";
import { parseSubstackRssXml } from "@/app/lib/substack";

describe("parseSubstackRssXml", () => {
  it("parses item fields from CDATA-wrapped tags", () => {
    const xml = `<?xml version="1.0"?>
<rss><channel>
<item>
<title><![CDATA[Hello & <world>]]></title>
<link><![CDATA[https://example.com/post-1]]></link>
<pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
<description><![CDATA[<p>First paragraph</p> more text here]]></description>
</item>
</channel></rss>`;
    const [post] = parseSubstackRssXml(xml);
    expect(post.title).toBe("Hello & <world>");
    expect(post.url).toBe("https://example.com/post-1");
    expect(post.pubDate).toBe("Mon, 01 Jan 2024 12:00:00 GMT");
    expect(post.description).toBe("First paragraph more text here");
  });

  it("parses plain (non-CDATA) tags and truncates long descriptions", () => {
    const longBody = "x".repeat(120);
    const xml = `<rss><channel><item>
<title>Plain title</title>
<link>https://example.com/p2</link>
<pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>
<description>${longBody}</description>
</item></channel></rss>`;
    const [post] = parseSubstackRssXml(xml);
    expect(post.title).toBe("Plain title");
    expect(post.description).toHaveLength(101);
    expect(post.description.endsWith("…")).toBe(true);
  });
});
