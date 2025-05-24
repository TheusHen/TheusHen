import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            'avatars.githubusercontent.com', "images.fillout.com", "mitpa-tech.vercel.app",
        ],
    },
    i18n: {
        locales: ["en", "pt"],
        defaultLocale: "en",
    },
};

export default nextConfig;
