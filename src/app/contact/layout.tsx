import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Matheus Henrique about open-source software, hardware, research and student engineering collaborations.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | TheusHen",
    description:
      "Get in touch with Matheus Henrique about engineering and open-source collaboration.",
    url: `${SITE_URL}/contact`,
    images: [{ url: "/banner.jpg", width: 780, height: 400, alt: "Contact TheusHen" }],
    type: "website",
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact TheusHen",
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Person",
    name: "Matheus Henrique",
    url: SITE_URL,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="structured-data-contact" type="application/ld+json">
        {JSON.stringify(contactSchema)}
      </Script>
      {children}
    </>
  );
}
