import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { ClinicPage } from "@/components/solutions/clinicas/ClinicPage";
import { clinicSolution } from "@/lib/solutions/clinicas";
import { JsonLd, ORGANIZATION_ID, SITE_URL, breadcrumbList } from "@/lib/structured-data";
import "../../styles/clinicas.css";

export const metadata: Metadata = {
  title: clinicSolution.metaTitle,
  description: clinicSolution.metaDescription,
  alternates: { canonical: clinicSolution.path },
  openGraph: {
    title: clinicSolution.metaTitle,
    description: clinicSolution.metaDescription,
    url: clinicSolution.path,
    type: "website",
  },
};

const service = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}${clinicSolution.path}#service`,
  name: "Atendimento com IA e agendamento pelo WhatsApp para clínicas",
  serviceType: "Atendimento com IA, agendamento e CRM para clínicas",
  description: clinicSolution.metaDescription,
  url: `${SITE_URL}${clinicSolution.path}`,
  provider: { "@id": ORGANIZATION_ID },
  areaServed: { "@type": "Country", name: "Brasil" },
  audience: { "@type": "BusinessAudience", audienceType: "Clínicas" },
  availableChannel: ["WhatsApp", "Instagram", "Messenger", "Site"].map((name) => ({
    "@type": "ServiceChannel",
    name,
  })),
  inLanguage: "pt-BR",
};

export default function ClinicasPage() {
  return (
    <>
      <JsonLd data={breadcrumbList([{ name: "Início", path: "/" }, { name: "Clínicas" }])} />
      <JsonLd data={service} />
      <ClinicPage />
      <SiteFooter />
    </>
  );
}
