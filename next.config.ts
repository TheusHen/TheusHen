import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            'avatars.githubusercontent.com', "images.fillout.com", "mitpa-tech.vercel.app",
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: `
                          default-src 'self';
                          script-src 'self' https://www.googletagmanager.com https://plausible.io https://vercel.live 'unsafe-inline' 'unsafe-eval';
                          style-src 'self' 'unsafe-inline';
                          img-src 'self' data: https:;
                          connect-src 'self' https:;
                          font-src 'self' https:;
                        `.replace(/\s{2,}/g, ' ').trim(),
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "geolocation=(), microphone=(), camera=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
