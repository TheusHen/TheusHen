"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDownCircle, Star } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from 'next/dynamic';
import './index.css'
import LoadingDots from "./components/LoadingDots";
import ClientRemount from "./client-remount";
import { useI18n } from "./contexts/I18nContext";

// Lazy load components
const Particles = dynamic(() => import("./components/particles"), { 
  ssr: false,
  loading: () => null
});
const About = dynamic(() => import("./pages/about"), {
  ssr: true,
  loading: () => <div className="flex items-center justify-center w-full h-screen"><LoadingDots color="#ffffff" size={10} /></div>
});

// This site was inspired by chronark/chronark.com and uses some code snippets from it, not only in this file but also in others.

const navigation = [
    { key: "nav.projects", href: "/projects" },
    { key: "nav.timeline", href: "/timeline" },
    { key: "nav.contact", href: "/contact" },
];

// Set your user and repository here
const REPO_OWNER = "TheusHen";
const REPO_NAME = "TheusHen";

export default function Home() {
    const { t } = useI18n();
    const [message, setMessage] = useState("");
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        // Lazy load Hotjar
        const loadHotjar = async () => {
            if (typeof window !== 'undefined') {
                const { default: hotjar } = await import('@hotjar/browser');
                hotjar.init(6469301, 6);
            }
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => loadHotjar(), { timeout: 3000 });
        } else {
            setTimeout(loadHotjar, 2000);
        }

        // Fetch GitHub stars with lower priority
        const fetchStars = () => {
            fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.stargazers_count !== undefined) {
                        setStars(data.stargazers_count);
                    }
                })
                .catch(() => {
                    setStars(null);
                });
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => fetchStars(), { timeout: 2000 });
        } else {
            setTimeout(fetchStars, 1000);
        }
    }, []);

    const handleSend = () => {
        if (message.trim()) {
            const encodedMessage = encodeURIComponent(message);
            window.location.href = `https://intouchbot.theushen.me?help=${encodedMessage}`;
        }
    };

    const handleScrollToAboutMe = () => {
        const aboutMeSection = document.getElementById("about-me");
        if (aboutMeSection) {
            aboutMeSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <ClientRemount>
                <SpeedInsights />
                <div className="absolute top-4 left-4 z-50 mt-10">
                    <Link
                        href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-tr from-yellow-50 to-yellow-200/80 text-yellow-900 font-semibold px-4 py-2 rounded-full shadow border border-yellow-200 transition-all duration-200 backdrop-blur group hover:scale-105 hover:shadow-lg"
                        style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)" }}
                    >
                        <Star className="fill-yellow-400 text-yellow-600 group-hover:scale-110 transition-transform duration-200 drop-shadow" size={20} />
                        <span className="flex items-center gap-1 text-xs sm:text-sm">
                        {stars !== null ? (
                            <>
                                <span className="font-bold">{stars}</span>
                                <span className="hidden sm:inline">{t("home.stars")}</span>
                                <span className="ml-2 text-yellow-700/90 group-hover:text-yellow-900 transition-colors">{t("home.support")}</span>
                            </>
                        ) : (
                            <span className="inline-flex items-center gap-1">
                                <LoadingDots color="#f59e42" size={7} />
                                <span className="hidden sm:inline ml-1">{t("home.loading")}</span>
                            </span>
                        )}
                    </span>
                    </Link>
                </div>
                <div
                    className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-700/10 to-black relative"
                    style={{ backgroundImage: "linear-gradient(to top left, #000, rgba(82,82,82,0.12), #000)" }}
                >
                    <nav className="mt-12 animate-fade-in">
                        <ul className="flex items-center justify-center gap-4">
                            {navigation.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-xs sm:text-sm duration-500 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:text-white transition-colors px-3 py-1 rounded"
                                    >
                                        {t(item.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* Decorative gradient line */}
                    <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-transparent via-zinc-300/40 to-transparent mt-4" />
                    <Particles
                        className="absolute inset-0 -z-10 animate-fade-in"
                        quantity={85}
                    />
                    <h1 className="py-2 px-1 z-10 text-4xl text-transparent duration-1000 bg-gradient-to-r from-zinc-100 via-white to-zinc-300 bg-clip-text cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-8xl whitespace-nowrap select-none drop-shadow-glow">
                        TheusHen
                    </h1>
                    {/* Decorative gradient line */}
                    <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-transparent via-zinc-300/40 to-transparent mt-6" />
                    <div className="flex items-center bg-white/70 rounded-full p-1.5 shadow w-full max-w-md mt-8 sm:max-w-xs border border-zinc-200 backdrop-blur">
                        <input
                            type="text"
                            placeholder={t("home.needHelp")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-black px-3 text-sm sm:text-xs placeholder:text-black-500"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-black/80 hover:bg-black text-white p-2 rounded-full flex items-center justify-center transition-colors duration-200"
                            aria-label={t("home.sendMessage")}
                        >
                            <ArrowUp size={18} />
                        </button>
                    </div>

                    {/* Scroll Down Indicator */}
                    <div
                        className="absolute bottom-10 flex flex-col items-center animate-bounce cursor-pointer z-20"
                        onClick={handleScrollToAboutMe}
                    >
                        <ArrowDownCircle size={32} className="text-zinc-400 hover:text-zinc-200 transition-all duration-200" />
                        <span className="mt-1 text-zinc-400 text-xs sm:text-sm font-medium">
                        {t("home.scrollDown")} <span className="font-semibold text-zinc-200">{t("home.aboutMe")}</span>
                    </span>
                    </div>
                </div>

                <div className="relative w-full flex justify-center items-center my-0">
                    <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-zinc-500/40 to-transparent" />
                </div>

                <div className="w-full h-[0.2px] bg-white shadow-lg opacity-90 my-0" />

                <div id="about-me" className="w-screen min-h-screen flex justify-center items-center relative z-10">
                    <Particles
                        className="absolute inset-0 -z-10 animate-fade-in"
                        quantity={75}
                    />
                    <About />
                </div>

            </ClientRemount>
        </>
    );
}
