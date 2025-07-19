import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import CollegeDecisionsBar from "./components/CollegeDecisionsBar";
import GlobalSwitch from "./components/Switch";
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
};

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/favicon.ico" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="theme-color" content="#000000" />

            {/* Google Analytics */}
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DWX5JVERXC" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-DWX5JVERXC');
                `}
            </Script>
            
            {/* Ahrefs Analytics */}
            <script
                src="https://analytics.ahrefs.com/analytics.js"
                data-key="7pSFS8uTZPgZ6+AQJF9oRg"
                async
            />

            {/* Plausible Analytics */}
            <Script defer data-domain="theushen.me" src="https://plausible.io/js/script.js" />
            <Script id="plausible-init" strategy="afterInteractive">
                {`
                    window.plausible = window.plausible || function() {
                        (window.plausible.q = window.plausible.q || []).push(arguments)
                    }
                `}
            </Script>

            {/* Hotjar Analytics */}
            <Script id="hotjar-init" strategy="afterInteractive">
                {`
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:6469301,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>
            <GlobeProvider>
                <CollegeDecisionsBar />
                <GlobalSwitch />
                {children}
            </GlobeProvider>
        </PostHogProvider>
        </body>
        </html>
    );
}
