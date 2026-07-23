import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import CollegeDecisionsBar from "./components/CollegeDecisionsBar";
import FloatingControls from "./components/FloatingControls";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { GlobeProvider } from "./contexts/GlobeContext";
import { I18nProvider } from "./contexts/I18nContext";
import "./globals.css";

const SITE_URL = "https://www.theushen.works";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TheusHen — Student engineer and open-source builder",
    template: "%s | TheusHen",
  },
  description:
    "Portfolio of Matheus Henrique (TheusHen), a Brazilian student engineer building open-source hardware, AI, networking and aerospace projects.",
  applicationName: "TheusHen Portfolio",
  authors: [{ name: "Matheus Henrique", url: SITE_URL }],
  creator: "Matheus Henrique",
  publisher: "TheusHen",
  keywords: [
    "Matheus Henrique",
    "TheusHen",
    "student engineer",
    "open source",
    "embedded systems",
    "artificial intelligence",
    "aerospace engineering",
    "TypeScript",
    "hardware",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TheusHen — Student engineer and open-source builder",
    description:
      "Open-source hardware, AI, networking and aerospace projects by Matheus Henrique.",
    url: SITE_URL,
    siteName: "TheusHen Portfolio",
    images: [
      {
        url: "/banner.jpg",
        width: 780,
        height: 400,
        alt: "TheusHen portfolio",
      },
    ],
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    type: "profile",
    firstName: "Matheus",
    lastName: "Henrique",
    username: "TheusHen",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheusHen — Student engineer and open-source builder",
    description:
      "Open-source hardware, AI, networking and aerospace projects by Matheus Henrique.",
    images: ["/banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/icon-192.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Matheus Henrique",
  alternateName: "TheusHen",
  url: SITE_URL,
  image: "https://avatars.githubusercontent.com/u/180109164",
  sameAs: [
    "https://github.com/TheusHen",
    "https://www.linkedin.com/in/matheus-henrique-741776367/",
  ],
  description:
    "Brazilian student engineer and open-source builder working on hardware, artificial intelligence, networking and aerospace projects.",
  knowsAbout: [
    "Open-source software",
    "Embedded systems",
    "Artificial intelligence",
    "Computer architecture",
    "Aerospace engineering",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TheusHen Portfolio",
  url: SITE_URL,
  description:
    "Portfolio of Matheus Henrique, a Brazilian student engineer and open-source builder.",
  author: {
    "@type": "Person",
    name: "Matheus Henrique",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <I18nProvider>
          <AccessibilityProvider>
            <GlobeProvider>
              <CollegeDecisionsBar />
              <FloatingControls />
              {children}
              <Analytics />
            </GlobeProvider>
          </AccessibilityProvider>
        </I18nProvider>

        <Script id="structured-data-person" type="application/ld+json">
          {JSON.stringify(personSchema)}
        </Script>
        <Script id="structured-data-website" type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </Script>
      </body>
    </html>
  );
}
