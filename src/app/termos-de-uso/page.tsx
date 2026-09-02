import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Termos de Uso · Its Time CRM",
  description:
    "Regras gerais para contratação e uso da plataforma Its Time CRM por empresas.",
};

export default function TermsPage() {
  return <LegalDocument document="terms" />;
}
