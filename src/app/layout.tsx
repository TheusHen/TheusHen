import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "TheusHen",
        template: "%s | TheusHen",
    },
    description: "Founder of MITPA",
    openGraph: {
        title: "TheusHen",
        description:
            "Founder of MITPA",
        url: "https://theushen.me",
        siteName: "https://theushen.me",
        images: [
            {
                url: "https://theushen.me/banner.jpg",
                width: 780,
                height: 400,
            },
        ],
        locale: "en-US",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        shortcut: "/favicon.png",
    },
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
            {/* Google Tag Manager */}
            <Script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=G-DWX5JVERXC`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-DWX5JVERXC');
                    `}
            </Script>
            {/* Plausible Analytics */}
            <Script
                defer
                data-domain="theushen.me"
                src="https://plausible.io/js/script.js"
            />
            <Script id="plausible-init" strategy="afterInteractive">
                {`
                        window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
                    `}
            </Script>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}