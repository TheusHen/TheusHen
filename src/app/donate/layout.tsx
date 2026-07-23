import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Support TheusHen's independent open-source prototypes and public technical documentation.",
  alternates: { canonical: "/donate" },
  openGraph: {
    title: "Support TheusHen",
    description:
      "Support independent open-source prototypes and public technical documentation.",
    url: `${SITE_URL}/donate`,
    images: [{ url: "/banner.jpg", width: 780, height: 400, alt: "TheusHen" }],
    type: "website",
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
