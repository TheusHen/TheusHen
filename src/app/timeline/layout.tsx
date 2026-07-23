import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "A timeline of projects, milestones and open-source work by Matheus Henrique.",
  alternates: { canonical: "/timeline" },
  openGraph: {
    title: "Timeline | TheusHen",
    description:
      "Projects, milestones and open-source work by Matheus Henrique.",
    url: `${SITE_URL}/timeline`,
    images: [{ url: "/banner.jpg", width: 780, height: 400, alt: "TheusHen timeline" }],
    type: "website",
  },
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
