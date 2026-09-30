"use client";

import React, { useState, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import "./index.css";
import LoadingDots from "./components/LoadingDots";
import ClientRemount from "./client-remount";
import Hero from "./components/hero/Hero";
import SignalStrip from "./components/hero/SignalStrip";

const Particles = dynamic(() => import("./components/particles"), {
    ssr: false,
    loading: () => null,
});
const About = dynamic(() => import("./pages/about"), {
    ssr: true,
    loading: () => (
        <div className="flex h-screen w-full items-center justify-center">
            <LoadingDots color="#ffffff" size={10} />
        </div>
    ),
});

// This site was inspired by chronark/chronark.com and uses some code snippets from it, not only in this file but also in others.

export default function Home() {
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        const fetchStars = () => {
            fetch(`/api/github/stars`)
                .then((res) => res.json())
                .then((data) => {
                    if (typeof data?.stars === "number") setStars(data.stars);
                })
                .catch(() => setStars(null));
        };

        if ("requestIdleCallback" in window) {
            requestIdleCallback(() => fetchStars(), { timeout: 2000 });
        } else {
            setTimeout(fetchStars, 1000);
        }
    }, []);

    return (
        <ClientRemount>
            <SpeedInsights />
            <main className="bg-ink">
                <Hero stars={stars} />
                <SignalStrip />
                <div id="about-me" className="relative z-10 flex min-h-screen w-screen items-center justify-center">
                    <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={75} />
                    <About />
                </div>
            </main>
        </ClientRemount>
    );
}
