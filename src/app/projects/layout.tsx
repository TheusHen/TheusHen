import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Projects",
    description: "Explore TheusHen's portfolio of open source projects, applications, and websites. From 20t to Arcade Lunar and Optifyx, discover innovative solutions in software development, aerospace engineering, and community platforms.",
    openGraph: {
        title: "Projects | TheusHen Portfolio",
        description: "Browse through a collection of innovative projects including 20t, Arcade Lunar, Optifyx, and various open-source GitHub repositories. Full-stack development, aerospace innovations, and community platforms.",
        url: "https://theushen.works/projects",
        siteName: "TheusHen Portfolio",
        images: [
            {
                url: "https://theushen.works/banner.jpg",
                width: 780,
                height: 400,
                alt: "TheusHen Projects - Portfolio of Open Source and Innovation",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects | TheusHen Portfolio",
        description: "Explore innovative projects in software development, aerospace, and open source. 20t, Arcade Lunar, Optifyx, and more.",
        images: ["https://theushen.works/banner.jpg"],
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script id="structured-data-portfolio" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    name: "Projects Portfolio",
                    description: "A collection of innovative projects and open-source contributions by Matheus Henrique (TheusHen)",
                    url: "https://theushen.works/projects",
                    author: {
                        "@type": "Person",
                        name: "Matheus Henrique",
                        url: "https://theushen.works"
                    },
                    mainEntity: {
                        "@type": "ItemList",
                        name: "Featured Projects",
                        description: "Featured software projects and applications",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 1,
                                item: {
                                    "@type": "SoftwareApplication",
                                    name: "20t",
                                    description: "Student-run non-profit coding club focused on building real-world projects and learning technology. Think it. Hack it. Build it. Created by TheusHen.",
                                    url: "https://discord.gg/U6GXeNwZ",
                                    applicationCategory: "WebApplication",
                                    operatingSystem: "Web Browser",
                                    offers: {
                                        "@type": "Offer",
                                        price: "0",
                                        priceCurrency: "USD"
                                    },
                                    author: {
                                        "@type": "Person",
                                        name: "Matheus Henrique"
                                    }
                                }
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                item: {
                                    "@type": "SoftwareApplication",
                                    name: "Arcade Lunar",
                                    description: "A social network focused on gaming and multiplayer experiences. Connects players worldwide, offering communities, events, and interactive features.",
                                    url: "https://arcadelunar.com.br",
                                    applicationCategory: "WebApplication",
                                    operatingSystem: "Web Browser",
                                    author: {
                                        "@type": "Person",
                                        name: "Matheus Henrique"
                                    }
                                }
                            },
                            {
                                "@type": "ListItem",
                                position: 3,
                                item: {
                                    "@type": "SoftwareApplication",
                                    name: "Optifyx",
                                    description: "An app that allows a smartphone to fully monitor a desktop in real-time over a Wi-Fi connection. Provides seamless remote access, ensuring control and visibility.",
                                    url: "https://github.com/optifyx",
                                    applicationCategory: "MobileApplication",
                                    operatingSystem: "Android, iOS",
                                    author: {
                                        "@type": "Person",
                                        name: "Matheus Henrique"
                                    }
                                }
                            }
                        ]
                    }
                })}
            </Script>
            <Script id="structured-data-breadcrumb-projects" type="application/ld+json">
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
                            name: "Projects",
                            item: "https://theushen.works/projects"
                        }
                    ]
                })}
            </Script>
            {children}
        </>
    );
}
