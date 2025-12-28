import type { Metadata, Viewport } from "next";
import Script from "next/script";
import CollegeDecisionsBar from "./components/CollegeDecisionsBar";
import GlobalSwitch from "./components/Switch";
import InspectDetector from "./components/InspectDetector";
import "./globals.css";
import { PostHogProvider } from "./providers/PostHogProvider";
import { GlobeProvider } from "./contexts/GlobeContext";

export const metadata: Metadata = {
    title: {
        default: "TheusHen",
        template: "%s | TheusHen",
    },
    description: "Founder of PRACTA, developer focused on open source, aerospace innovation and impactful tools.",
    applicationName: "TheusHen Portfolio",
    authors: [{ name: "Matheus Henrique", url: "https://theushen.me" }],
    keywords: [
        "theushen",
        "PRACTA",
        "developer",
        "portfolio",
        "aerospace",
        "engineering",
        "open source",
        "programming",
        "software engineer",
        "MIT",
    ],
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    creator: "Matheus Henrique",
    publisher: "TheusHen",
    metadataBase: new URL("https://theushen.me"),
    openGraph: {
        title: "TheusHen",
        description: "Founder of PRACTA, developer focused on open source and innovation.",
        url: "https://theushen.me",
        siteName: "TheusHen",
        images: [
            {
                url: "https://theushen.me/banner.jpg",
                width: 780,
                height: 400,
                alt: "Banner - TheusHen Portfolio",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "TheusHen",
        description: "Founder of PRACTA, focused on open source, aerospace and technology.",
        images: ["https://theushen.me/banner.jpg"],
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
            <link rel="preconnect" href="https://plausible.io" crossOrigin="anonymous" />
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

            {/* Plausible Analytics */}
            <Script
                data-domain="theushen.me"
                src="https://plausible.io/js/script.js"
                strategy="worker"
            />
            <Script id="plausible-init" strategy="worker">
                {`
                    window.plausible = window.plausible || function() {
                        (window.plausible.q = window.plausible.q || []).push(arguments)
                    }
                `}
            </Script>

            <Script id="structured-data" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: "Matheus Henrique",
                    url: "https://theushen.me",
                    sameAs: [
                        "https://github.com/theushen",
                        "https://www.linkedin.com/in/matheus-henrique-741776367/",
                    ],
                    jobTitle: "Full-Stack Developer",
                    worksFor: {
                        "@type": "Organization",
                        name: "PRACTA",
                    },
                })}
            </Script>
        </head>
        <body className="antialiased font-sans">
        <PostHogProvider>
            <GlobeProvider>
                <InspectDetector />
                <CollegeDecisionsBar />
                <GlobalSwitch />
                {children}
            </GlobeProvider>
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
