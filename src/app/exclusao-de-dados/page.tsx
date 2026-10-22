import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Exclusão de dados · Its Time CRM",
  description:
    "Como pedir a exclusão dos seus dados pessoais do Its Time CRM e acompanhar o pedido.",
};

export default function DataDeletionPage() {
  return <LegalDocument document="deletion" />;
}
