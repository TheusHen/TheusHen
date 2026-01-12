import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Timeline",
    description: "Explore the journey of Matheus Henrique (TheusHen) through an interactive timeline. Discover milestones, achievements, and key moments in software development, education, and personal growth.",
    openGraph: {
        title: "Timeline | TheusHen",
        description: "Follow Matheus Henrique's journey through an interactive timeline of achievements, projects, and milestones in software development and education.",
        url: "https://theushen.me/timeline",
        siteName: "TheusHen Portfolio",
        images: [
            {
                url: "https://theushen.me/banner.jpg",
                width: 780,
                height: 400,
                alt: "TheusHen Timeline - Journey and Achievements",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Timeline | TheusHen",
        description: "Interactive timeline of Matheus Henrique's journey in software development and education.",
        images: ["https://theushen.me/banner.jpg"],
    },
};

export default function TimelineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script id="structured-data-breadcrumb-timeline" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "Home",
                            item: "https://theushen.me"
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "Timeline",
                            item: "https://theushen.me/timeline"
                        }
                    ]
                })}
            </Script>
            {children}
        </>
    );
}
