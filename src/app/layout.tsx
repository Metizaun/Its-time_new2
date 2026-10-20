import type { Metadata } from "next";
import { Chakra_Petch, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { UMAMI_SRC, UMAMI_WEBSITE_ID } from "@/lib/analytics";
import "./globals.css";
import "../styles/feature-section.css";
import "../styles/crescer-section.css";
import "../styles/customer-journey.css";
import "../styles/revenue-recovery.css";
import "../styles/chat-journey.css";
import "../styles/cash-flow.css";
import "../styles/handoff-map.css";
import "../styles/performance-panel.css";
import "../styles/operation-day.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://itstime.pro"),
  title: "Its Time IA — Inteligência que opera. Estratégia que escala.",
  description: "Atendimento com IA, CRM e automações para conectar conversas, organizar sua operação e gerar novas oportunidades de negócio.",
  openGraph: {
    siteName: "Its Time",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {UMAMI_SRC && UMAMI_WEBSITE_ID ? (
          <>
            <Script
              src={UMAMI_SRC}
              data-website-id={UMAMI_WEBSITE_ID}
              data-domains="itstime.pro,www.itstime.pro"
              data-do-not-track="true"
              strategy="afterInteractive"
            />
            <AnalyticsTracker />
          </>
        ) : null}
        <Script
          src="https://app.itstime.pro/widget.js"
          data-widget-key="sGN8WHpExmKo1LBtGudzZA5sejoxEYQt"
          data-api="https://api.itstime.pro"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
