import type { Metadata } from "next";
import { ResourceIndexPage } from "@/components/ResourceIndexPage";

export const metadata: Metadata = {
  title: "Documentação para desenvolvedores · Its Time",
  description: "Documentação técnica para integrar seus sistemas ao Its Time: Agenda Universal, webhooks de leads e de cobrança e Jornadas RB.",
  alternates: { canonical: "/dev/documentacao" },
};

export default function DocumentationIndexPage() {
  return <ResourceIndexPage groupId="dev" path="/dev/documentacao" kicker="PARA QUEM INTEGRA" />;
}
