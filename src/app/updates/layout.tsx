import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Três fluxos. Uma operação mais coordenada. · Its Time",
  description:
    "Conheça os novos fluxos de chat interno, cobrança independente, sincronização de agenda e segurança operacional do Its Time.",
};

export default function UpdatesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
