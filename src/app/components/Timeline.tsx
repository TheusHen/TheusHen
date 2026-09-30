"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export type TimelineEntry = {
    id: string;
    dateISO: string;
    timeHHMM: string;
    title: string;
    link: string;
    tags: string[];
    content: ReactNode;
};

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
    const { t } = useI18n();
    const reduced = useReducedMotion();
    const listRef = useRef<HTMLOListElement | null>(null);
    const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

    return (
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-32 pt-24 sm:px-8">
            <Link
                href="/"
                className="inline-flex items-center gap-2 border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-400 backdrop-blur transition-colors hover:border-signal/60 hover:text-white"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("nav.backHome")}
            </Link>

            <header className="mt-14 flex flex-col gap-4 border-b border-white/10 pb-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
                    {`// log · ${pad(entries.length)} entries · mdx`}
                </span>
                <motion.h1
                    initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-5xl font-medium tracking-tight text-white sm:text-7xl"
                >
                    {t("timeline.title")}
                </motion.h1>
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">{t("timeline.subtitle")}</p>
            </header>

            {entries.length === 0 ? (
                <p className="mt-10 border border-white/10 bg-white/[0.03] p-5 font-mono text-sm text-zinc-400">
                    {t("timeline.emptyState", { folder: "line" })}
                </p>
            ) : (
                <ol ref={listRef} className="relative mt-16 flex flex-col gap-16">
                    <span className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10 md:left-[calc(9rem+7px)]" aria-hidden="true" />
                    <motion.span
                        className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-gradient-to-b from-signal via-signal to-signal/0 md:left-[calc(9rem+7px)]"
                        style={{ scaleY: reduced ? 1 : progress }}
                        aria-hidden="true"
                    />

                    {entries.map((entry, i) => (
                        <motion.li
                            key={entry.id}
                            initial={reduced ? false : { opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15% 0px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative flex flex-col gap-4 pl-10 md:flex-row md:gap-10 md:pl-0"
                        >
                            <div className="flex shrink-0 flex-row items-baseline gap-3 font-mono md:w-36 md:flex-col md:items-end md:gap-1 md:pr-2 md:text-right">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">{pad(i + 1)}</span>
                                <time dateTime={`${entry.dateISO}T${entry.timeHHMM}`} className="text-sm tabular-nums text-white">
                                    {entry.dateISO.replaceAll("-", ".")}
                                </time>
                                <span className="text-xs tabular-nums text-zinc-500">{entry.timeHHMM}</span>
                            </div>

                            <span
                                className="absolute left-0 top-1 flex h-[15px] w-[15px] items-center justify-center md:left-36"
                                aria-hidden="true"
                            >
                                <span className="absolute h-full w-full rotate-45 border border-signal/50 bg-ink transition-transform duration-500 group-hover:rotate-[135deg]" />
                                <span className="relative h-1.5 w-1.5 rotate-45 bg-signal shadow-[0_0_12px_rgba(255,59,59,0.9)]" />
                            </span>

                            <article className="relative flex-1 overflow-hidden border border-white/10 bg-white/[0.02] p-6 backdrop-blur transition-colors duration-500 hover:border-white/20 md:ml-8">
                                <span
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{ background: "radial-gradient(500px circle at 0% 0%, rgba(255,59,59,0.10), transparent 55%)" }}
                                    aria-hidden="true"
                                />
                                <div className="relative flex items-start justify-between gap-4">
                                    <h2 className="font-display text-2xl font-medium tracking-tight text-white">{entry.title}</h2>
                                    <a
                                        href={entry.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={t("timeline.openOnGithub", { title: entry.title })}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-zinc-400 transition-all hover:border-signal hover:bg-signal hover:text-black"
                                    >
                                        <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                </div>
                                {entry.tags.length > 0 && (
                                    <ul className="relative mt-3 flex flex-wrap gap-2">
                                        {entry.tags.map((tag) => (
                                            <li
                                                key={tag}
                                                className="border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
                                            >
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="relative mt-3 text-sm">{entry.content}</div>
                            </article>
                        </motion.li>
                    ))}
                </ol>
            )}
        </div>
    );
}
