import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates · Its Time CRM",
  description:
    "Acompanhe novidades, melhorias e correções da plataforma Its Time CRM.",
};

export default function UpdatesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
