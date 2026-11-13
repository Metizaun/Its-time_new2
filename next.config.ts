import type { NextConfig } from "next";

// Blog posts merged into guides (SEO cycle 1, 2026-11-13): the old addresses point to the guide that absorbed them.
const mergedPosts: Record<string, string> = {
  "black-friday-para-otica-o-que-medir-antes-de-27-de-novembro": "black-friday-para-oticas",
  "black-friday-para-otica-oferta-que-respeita-o-estoque": "black-friday-para-oticas",
  "black-friday-na-otica-o-que-o-vendedor-pode-prometer": "black-friday-para-oticas",
  "black-friday-para-otica-como-explicar-a-ia-e-os-dados": "black-friday-para-oticas",
  "black-friday-para-otica-retome-orcamentos-com-motivo": "black-friday-para-oticas",
  "atendimento-na-black-friday-a-conversa-nao-acaba-na-venda": "black-friday-para-oticas",
  "o-que-esperar-de-uma-ia-de-atendimento-numa-otica": "ia-de-atendimento-para-oticas",
  "ia-de-atendimento-para-oticas-da-pergunta-ao-orcamento": "ia-de-atendimento-para-oticas",
  "atendimento-fora-do-horario-a-mensagem-das-22h-na-otica": "ia-de-atendimento-para-oticas",
  "atendimento-em-varios-canais-a-ia-absorve-o-volume-da-otica": "ia-de-atendimento-para-oticas",
  "atendimento-com-ia-quando-a-voz-explica-melhor": "ia-de-atendimento-para-oticas",
  "ia-de-atendimento-curiosos-nao-viram-clientes-no-escuro": "ia-de-atendimento-para-oticas",
  "acompanhamento-de-orcamentos": "follow-up-comercial-orcamento-parado-nao-e-processo",
};

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
      ...Object.entries(mergedPosts).map(([from, to]) => ({
        source: `/blog/${from}`,
        destination: `/blog/${to}`,
        permanent: true,
      })),
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
