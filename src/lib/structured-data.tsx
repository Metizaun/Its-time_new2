/** Schema.org JSON-LD shared by the pages. Facts here must be visible on the site itself. */
export const SITE_URL = "https://itstime.pro";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Its Time",
      alternateName: "Its Time CRM",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/brand/its-time-mark-transparent-clean.png`,
      },
      sameAs: ["https://www.instagram.com/itstime_pro/"],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Its Time",
      inLanguage: "pt-BR",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

export const softwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "Its Time CRM",
  description:
    "Atendimento com IA, CRM e automações para conectar conversas, organizar sua operação e gerar novas oportunidades de negócio.",
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "CRM",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  releaseNotes: `${SITE_URL}/updates`,
  publisher: { "@id": ORGANIZATION_ID },
};

export type Crumb = { name: string; path?: string };

/** The last crumb is the current page and carries no link. */
export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path !== undefined && { item: new URL(crumb.path, SITE_URL).toString() }),
    })),
  };
}

/** Dates in the content are plain days (2026-10-28); schema.org wants a time zone, so they are read as Brasília time. */
export function isoDate(day: string) {
  return day.includes("T") ? day : `${day}T00:00:00-03:00`;
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
