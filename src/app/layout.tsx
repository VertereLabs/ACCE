import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Providers from "./providers";
import "./globals.css";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://accetutors.co.za/#organization",
      name: "ACCE Tutors",
      url: "https://accetutors.co.za",
      logo: "https://accetutors.co.za/icon.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://accetutors.co.za/#website",
      name: "ACCE Tutors",
      url: "https://accetutors.co.za",
      publisher: {
        "@id": "https://accetutors.co.za/#organization",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://accetutors.co.za"),
  title: "ACCE Tutors | Expert CA(SA) & CTA Support",
  description: "Expert tutoring for Undergraduate and PGDA/CTA students. Master Accounting, Tax, Management Accounts & Finance, and Auditing.",
  keywords: "tutoring, CA(SA), CTA, accounting, tax, auditing, South Africa, PGDA, undergraduate",
  authors: [{ name: "ACCE Tutors" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ACCE Tutors | Expert CA(SA) & CTA Support",
    description: "Unlock your academic potential with Elevate. Expert tutoring for university and postgraduate students.",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACCE Tutors | Expert CA(SA) & CTA Support",
    description: "Unlock your academic potential with expert tutoring for university and postgraduate students.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          defer
          src="https://stats.verterelabs.co.za/script.js"
          data-website-id="6c7e46f6-fba8-40d3-80fa-79a00cedad07"
        />
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </Script>
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
}
