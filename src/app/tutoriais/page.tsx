import type { Metadata } from "next";
import { ResourceIndexPage } from "@/components/ResourceIndexPage";

export const metadata: Metadata = {
  title: "Tutoriais do Its Time CRM · Its Time",
  description: "Guias práticos para configurar e usar o Its Time CRM: conexão do WhatsApp oficial e boas práticas de atendimento.",
  alternates: { canonical: "/tutoriais" },
};

export default function TutorialsIndexPage() {
  return <ResourceIndexPage groupId="tutoriais" path="/tutoriais" kicker="PARA QUEM USA O CRM" />;
}
