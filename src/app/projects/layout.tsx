import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected open-source hardware, artificial intelligence, networking and aerospace projects by Matheus Henrique.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | TheusHen",
    description:
      "Selected open-source engineering and software projects by Matheus Henrique.",
    url: `${SITE_URL}/projects`,
    images: [{ url: "/banner.jpg", width: 780, height: 400, alt: "TheusHen projects" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | TheusHen",
    description:
      "Selected open-source engineering and software projects by Matheus Henrique.",
    images: ["/banner.jpg"],
  },
};

const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "TheusHen Projects",
  url: `${SITE_URL}/projects`,
  author: {
    "@type": "Person",
    name: "Matheus Henrique",
    url: SITE_URL,
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "CreativeWork",
          name: "EEGFrontier",
          url: "https://github.com/TheusHen/EEGFrontier",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "CreativeWork",
          name: "Nautilus AquaVision",
          url: "https://github.com/TheusHen/Nautilus-AquaVision-v0",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "CreativeWork",
          name: "Ternary Ibex",
          url: "https://github.com/TheusHen/ternary-ibex",
        },
      },
    ],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="structured-data-projects" type="application/ld+json">
        {JSON.stringify(projectsSchema)}
      </Script>
      {children}
    </>
  );
}
