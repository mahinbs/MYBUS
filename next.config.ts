import type { NextConfig } from "next";

/**
 * `output: "export"` in dev is a common source of broken Webpack chunk maps
 * on Windows (missing ./607.js, etc.). Static export is only needed for
 * `next build` / the `out/` folder — not for `next dev`.
 */
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
