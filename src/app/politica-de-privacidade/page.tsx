import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Política de Privacidade · Its Time CRM",
  description:
    "Entenda como a Its Time trata dados pessoais no CRM, canais de atendimento e integrações.",
};

export default function PrivacyPage() {
  return <LegalDocument document="privacy" />;
}
