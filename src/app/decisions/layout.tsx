import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "College application journey",
  description:
    "Matheus Henrique's transparent university planning page and application milestone countdown.",
  alternates: { canonical: "/decisions" },
  openGraph: {
    title: "College application journey | TheusHen",
    description:
      "A transparent planning page for Matheus Henrique's university journey.",
    url: `${SITE_URL}/decisions`,
    images: [{ url: "/banner.jpg", width: 780, height: 400, alt: "TheusHen" }],
    type: "website",
  },
};

export default function DecisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
