import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "kai-chen",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
