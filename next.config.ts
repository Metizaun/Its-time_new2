import type { NextConfig } from "next";

// Sent on every response. A Content-Security-Policy is left out on purpose: the site loads the chat widget,
// Umami and GA4 from other hosts, and a policy needs that list checked first.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/privacidade", destination: "/politica-de-privacidade", permanent: true },
      { source: "/termos", destination: "/termos-de-uso", permanent: true },
      { source: "/dev", destination: "/dev/documentacao", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // File names here are not hashed, so a file can change in place: cache for a day, then revalidate.
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/update-icons/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        // Blog covers carry a content hash in the name (cover-<hash>.webp), so they never change in place.
        source: "/blog/:slug/:file(cover-[0-9a-f]+\\.webp)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
