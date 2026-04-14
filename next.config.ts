import type { NextConfig } from "next";

// @next/mdx's createMDX currently can't pass function-based remark/rehype
// plugins through Turbopack (non-serializable options).
// We wire MDX support via the webpack path directly so Turbopack handles
// everything except .mdx files, which fall back to webpack's @mdx-js/loader.
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { resolve } from "path";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
      { protocol: "https", hostname: "*.mzstatic.com" },
    ],
  },
  webpack(config) {
    // Resolve the MDX import source to our root mdx-components.tsx
    config.resolve.alias = {
      ...config.resolve.alias,
      "next-mdx-import-source-file": [
        resolve(process.cwd(), "src/mdx-components"),
        resolve(process.cwd(), "mdx-components"),
      ],
    };

    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: require.resolve("@mdx-js/loader"),
          options: {
            providerImportSource: "next-mdx-import-source-file",
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex, rehypeHighlight],
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
