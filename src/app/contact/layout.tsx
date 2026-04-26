import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Matheus Henrique (TheusHen). Connect for collaboration opportunities, project inquiries, or discussions about open source software, aerospace engineering, and innovative technology solutions.",
    openGraph: {
        title: "Contact | TheusHen",
        description: "Reach out to Matheus Henrique for collaboration, project inquiries, or tech discussions. Open to opportunities in software development and aerospace innovation.",
        url: "https://theushen.works/contact",
        siteName: "TheusHen Portfolio",
        images: [
            {
                url: "https://theushen.works/banner.jpg",
                width: 780,
                height: 400,
                alt: "Contact TheusHen - Get in Touch",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact | TheusHen",
        description: "Get in touch with Matheus Henrique for collaboration and project opportunities.",
        images: ["https://theushen.works/banner.jpg"],
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script id="structured-data-breadcrumb-contact" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "Home",
                            item: "https://theushen.works"
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "Contact",
                            item: "https://theushen.works/contact"
                        }
                    ]
                })}
            </Script>
            <Script id="structured-data-contact-page" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    name: "Contact TheusHen",
                    description: "Get in touch with Matheus Henrique",
                    url: "https://theushen.works/contact",
                    mainEntity: {
                        "@type": "Person",
                        name: "Matheus Henrique",
                        url: "https://theushen.works",
                        contactPoint: {
                            "@type": "ContactPoint",
                            contactType: "Personal",
                            url: "https://theushen.works/contact"
                        }
                    }
                })}
            </Script>
            {children}
        </>
    );
}
