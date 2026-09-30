"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { SHAPES } from "./shapes";
import { useScramble } from "./useScramble";

const MorphField = dynamic(() => import("./MorphField"), { ssr: false });

const CYCLE_SECONDS = 6.5;
const TAGLINES = ["Think it.", "Hack it.", "Build it."];

const navigation = [
    { key: "nav.projects", href: "/projects" },
    { key: "nav.timeline", href: "/timeline" },
    { key: "nav.contact", href: "/contact" },
];

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export default function Hero({ stars }: { stars: number | null }) {
    const { t } = useI18n();
    const prefersReduced = useReducedMotion() ?? false;
    const [shapeIndex, setShapeIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [taglineIndex, setTaglineIndex] = useState(0);
    const [message, setMessage] = useState("");
    const coordsRef = useRef<HTMLSpanElement | null>(null);

    const shapeLabel = useScramble(SHAPES[shapeIndex].label);
    const tagline = useScramble(TAGLINES[taglineIndex]);

    useEffect(() => {
        if (prefersReduced || paused) return;
        const id = setTimeout(() => setShapeIndex((i) => (i + 1) % SHAPES.length), CYCLE_SECONDS * 1000);
        return () => clearTimeout(id);
    }, [shapeIndex, prefersReduced, paused]);

    useEffect(() => {
        const id = setInterval(() => setTaglineIndex((i) => (i + 1) % TAGLINES.length), 2600);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            if (!coordsRef.current) return;
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -((e.clientY / window.innerHeight) * 2 - 1);
            coordsRef.current.textContent = `X ${x >= 0 ? "+" : ""}${x.toFixed(3)}  Y ${y >= 0 ? "+" : ""}${y.toFixed(3)}`;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, []);

    const handleSend = () => {
        if (!message.trim()) return;
        window.location.href = `https://intouchbot.theushen.works?help=${encodeURIComponent(message)}`;
    };

    const scrollToAbout = () => {
        document.getElementById("about-me")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            className="bg-noise relative flex h-[100svh] w-full flex-col overflow-hidden bg-ink pt-10 font-mono text-zinc-400"
            aria-label="TheusHen"
        >
            <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(255,59,59,0.18), transparent 65%)" }}
            />

            <MorphField shapeIndex={shapeIndex} reducedMotion={prefersReduced} className="absolute inset-0 z-0" />

            <h1 className="sr-only">TheusHen — Matheus Henrique</h1>

            <header className="relative z-10 flex items-center justify-between gap-4 px-5 pt-5 sm:px-8">
                <Link
                    href="https://github.com/TheusHen/TheusHen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] uppercase tracking-widest text-zinc-300 backdrop-blur transition-colors hover:border-signal/60 hover:text-white"
                >
                    <Star className="h-3.5 w-3.5 text-signal transition-transform group-hover:rotate-45" aria-hidden="true" />
                    <span className="tabular-nums text-white">{stars ?? "--"}</span>
                    <span className="hidden sm:inline">{t("home.stars")}</span>
                </Link>

                <nav aria-label="Principal">
                    <ul className="flex items-center gap-1 sm:gap-2">
                        {navigation.map((item, i) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="group flex items-center gap-1.5 px-2 py-1 text-[11px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none sm:px-3 sm:text-xs"
                                >
                                    <span className="text-signal/70 transition-colors group-hover:text-signal">{pad(i + 1)}</span>
                                    {t(item.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <span className="hidden items-center gap-2 text-[11px] uppercase tracking-widest lg:flex">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" aria-hidden="true" />
                    Online
                </span>
            </header>

            <div className="pointer-events-none relative z-10 mt-6 flex justify-between px-5 text-[10px] uppercase tracking-[0.3em] text-zinc-600 sm:px-8">
                <span>{"// portfolio.v3"}</span>
                <span ref={coordsRef} className="hidden tabular-nums sm:inline">
                    X +0.000 Y +0.000
                </span>
            </div>

            <div className="flex-1" />

            <div className="relative z-10 flex flex-col gap-8 px-5 pb-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex max-w-md flex-col gap-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Matheus Henrique / 20t</p>
                    <p className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl" aria-live="polite">
                        {tagline}
                        <span className="ml-1 inline-block h-[0.9em] w-[0.5ch] translate-y-[0.1em] animate-blink bg-signal" aria-hidden="true" />
                    </p>
                    <form
                        className="mt-2 flex w-full max-w-sm items-center border border-white/10 bg-black/50 backdrop-blur transition-colors focus-within:border-signal/60"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                    >
                        <span className="pl-3 text-signal" aria-hidden="true">
                            {">"}
                        </span>
                        <label htmlFor="help-input" className="sr-only">
                            {t("home.needHelp")}
                        </label>
                        <input
                            id="help-input"
                            type="text"
                            placeholder={t("home.needHelp")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                        />
                        <button
                            type="submit"
                            aria-label={t("home.sendMessage")}
                            className="m-1 flex h-9 w-9 items-center justify-center bg-signal text-black transition-transform hover:scale-105 active:scale-95"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </form>
                </div>

                <div
                    className="flex flex-col gap-3 lg:items-end"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="flex items-baseline gap-3 text-xs uppercase tracking-widest">
                        <span className="text-zinc-600">Form</span>
                        <span className="tabular-nums text-white">
                            {pad(shapeIndex + 1)}
                            <span className="text-zinc-600">/{pad(SHAPES.length)}</span>
                        </span>
                        <span className="min-w-[9ch] text-signal">{shapeLabel}</span>
                    </div>
                    <div className="flex gap-1.5" role="tablist" aria-label="Formas das partículas">
                        {SHAPES.map((shape, i) => (
                            <button
                                key={shape.id}
                                type="button"
                                role="tab"
                                aria-selected={i === shapeIndex}
                                aria-label={shape.label}
                                onClick={() => setShapeIndex(i)}
                                className="group relative h-6 w-8 sm:w-10"
                            >
                                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden bg-white/10 transition-colors group-hover:bg-white/25">
                                    {i === shapeIndex && (
                                        <span
                                            key={`${shapeIndex}-${paused}`}
                                            className={`absolute inset-0 bg-signal ${paused || prefersReduced ? "" : "hud-fill"}`}
                                            style={{ ["--cycle" as string]: `${CYCLE_SECONDS}s` }}
                                        />
                                    )}
                                    {i < shapeIndex && <span className="absolute inset-0 bg-white/40" />}
                                </span>
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                        {"Click → pulse · hover → repel"}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={scrollToAbout}
                className="group relative z-10 mx-auto mb-5 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition-colors hover:text-white"
            >
                {t("home.scrollDown")} {t("home.aboutMe")}
                <span className="relative h-10 w-px overflow-hidden bg-white/10" aria-hidden="true">
                    <span className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-signal to-transparent" />
                </span>
            </button>
        </section>
    );
}
