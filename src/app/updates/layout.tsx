import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novidades de novembro no Its Time CRM · Its Time",
  description:
    "Confira o novo visual do CRM, os guias da Nya e as melhorias no Chat, na Agenda e no Pipeline.",
};

export default function UpdatesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
