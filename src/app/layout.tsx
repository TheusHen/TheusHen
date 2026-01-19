import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import CollegeDecisionsBar from "./components/CollegeDecisionsBar";
import GlobalSwitch from "./components/Switch";
import InspectDetector from "./components/InspectDetector";
import FloatingControls from "./components/FloatingControls";
import "./globals.css";
import { PostHogProvider } from "./providers/PostHogProvider";
import { GlobeProvider } from "./contexts/GlobeContext";
import { I18nProvider } from "./contexts/I18nContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

export const metadata: Metadata = {
    title: {
        default: "TheusHen",
        template: "%s | TheusHen",
    },
    description: "Matheus Henrique (TheusHen) - Founder of PRACTA, full-stack developer passionate about open source software, aerospace engineering, and building impactful tools. Explore my projects, timeline, and get in touch.",
    applicationName: "TheusHen Portfolio",
    authors: [{ name: "Matheus Henrique", url: "https://theushen.me" }],
    keywords: [
        "theushen",
        "Matheus Henrique",
        "PRACTA",
        "developer",
        "portfolio",
        "aerospace",
        "engineering",
        "open source",
        "programming",
        "software engineer",
        "full-stack developer",
        "web development",
        "MIT",
        "Brazil",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
    ],
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    creator: "Matheus Henrique",
    publisher: "TheusHen",
    metadataBase: new URL("https://theushen.me"),
    openGraph: {
        title: "TheusHen - Full-Stack Developer & Open Source Advocate",
        description: "Portfolio of Matheus Henrique, founder of PRACTA. Passionate about open source software, aerospace engineering, and creating impactful solutions. Discover my projects and journey in software development.",
        url: "https://theushen.me",
        siteName: "TheusHen Portfolio",
        images: [
            {
                url: "https://theushen.me/banner.jpg",
                width: 780,
                height: 400,
                alt: "TheusHen Portfolio - Matheus Henrique, Full-Stack Developer",
            },
        ],
        locale: "en_US",
        type: "profile",
        firstName: "Matheus",
        lastName: "Henrique",
        username: "TheusHen",
    },
    twitter: {
        card: "summary_large_image",
        title: "TheusHen - Full-Stack Developer & Open Source Advocate",
        description: "Portfolio of Matheus Henrique, founder of PRACTA. Passionate about open source, aerospace engineering, and building impactful solutions.",
        images: ["https://theushen.me/banner.jpg"],
        creator: "@theushen",
        site: "@theushen",
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        shortcut: "/favicon.png",
        icon: "/favicon.ico",
        apple: "/favicon.png",
    },
    manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
    colorScheme: "dark",
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            {/* Preload critical assets */}
            <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
            
            <link rel="icon" href="/favicon.ico" sizes="48x48" />
            <link rel="icon" href="/favicon.png" type="image/png" sizes="500x500" />
            <link rel="apple-touch-icon" href="/favicon.png" sizes="500x500" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="theme-color" content="#000000" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            
            {/* Preconnect to external domains */}
            <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://api.github.com" />
            <link rel="dns-prefetch" href="https://us.i.posthog.com" />
            <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />

            {/* Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-DWX5JVERXC"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-DWX5JVERXC');
                `}
            </Script>

            {/* Ahrefs Analytics */}
            <Script
                src="https://analytics.ahrefs.com/analytics.js"
                data-key="7pSFS8uTZPgZ6+AQJF9oRg"
                strategy="worker"
            />

            <Script id="structured-data-person" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: "Matheus Henrique",
                    alternateName: "TheusHen",
                    url: "https://theushen.me",
                    image: "https://avatars.githubusercontent.com/u/180109164",
                    sameAs: [
                        "https://github.com/theushen",
                        "https://www.linkedin.com/in/matheus-henrique-741776367/",
                    ],
                    jobTitle: "Full-Stack Developer",
                    description: "Founder of PRACTA, developer focused on open source, aerospace innovation and impactful tools.",
                    worksFor: {
                        "@type": "Organization",
                        name: "PRACTA",
                        url: "https://practa.tech"
                    },
                    contactPoint: {
                        "@type": "ContactPoint",
                        contactType: "Personal",
                        url: "https://theushen.me/contact"
                    },
                    knowsAbout: ["Software Development", "Aerospace Engineering", "Open Source", "Web Development", "Full-Stack Development"],
                    alumniOf: {
                        "@type": "EducationalOrganization",
                        name: "Massachusetts Institute of Technology",
                        alternateName: "MIT"
                    }
                })}
            </Script>
            <Script id="structured-data-website" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "TheusHen Portfolio",
                    alternateName: "TheusHen",
                    url: "https://theushen.me",
                    description: "Portfolio of Matheus Henrique (TheusHen), founder of PRACTA, developer focused on open source, aerospace innovation and impactful tools.",
                    author: {
                        "@type": "Person",
                        name: "Matheus Henrique",
                        url: "https://theushen.me"
                    }
                })}
            </Script>
        </head>
        <body className="antialiased font-sans">
        <PostHogProvider>
            <I18nProvider>
                <AccessibilityProvider>
                    <GlobeProvider>
                        <InspectDetector />
                        <CollegeDecisionsBar />
                        <GlobalSwitch />
                        <FloatingControls />
                        {children}
                        <Analytics />
                    </GlobeProvider>
                </AccessibilityProvider>
            </I18nProvider>
        </PostHogProvider>
        
        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
            {`
                if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                        navigator.serviceWorker.register('/sw.js').then(
                            function(registration) {
                                console.log('SW registered: ', registration);
                            },
                            function(err) {
                                console.log('SW registration failed: ', err);
                            }
                        );
                    });
                }
            `}
        </Script>
        </body>
        </html>
    );
}
