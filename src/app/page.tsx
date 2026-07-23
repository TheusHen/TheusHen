"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Github, Star } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LoadingDots from "./components/LoadingDots";
import { useI18n } from "./contexts/I18nContext";

const Particles = dynamic(() => import("./components/particles"), {
  ssr: false,
});
const About = dynamic(() => import("./pages/about"), {
  loading: () => (
    <div className="flex min-h-[70vh] items-center justify-center">
      <LoadingDots color="#ffffff" size={8} />
    </div>
  ),
});

const navigation = [
  { key: "nav.projects", href: "/projects" },
  { key: "nav.timeline", href: "/timeline" },
  { key: "nav.contact", href: "/contact" },
] as const;

export default function Home() {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStars = async () => {
      try {
        const response = await fetch("/api/github/stars", {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data: { stars?: number } = await response.json();
        if (typeof data.stars === "number") setStars(data.stars);
      } catch {
        // The star count is optional and should never block the page.
      }
    };

    const timeout = window.setTimeout(fetchStars, 400);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    window.location.assign(
      `https://intouchbot.theushen.works?help=${encodeURIComponent(trimmedMessage)}`
    );
  };

  return (
    <>
      <SpeedInsights />
      <main className="overflow-x-clip bg-[#050505] text-white">
        <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(127,29,29,0.18),transparent_35%),linear-gradient(145deg,#020202,#111_55%,#050505)] px-5 pb-12 pt-24 sm:px-8">
          <Particles
            className="pointer-events-none absolute inset-0"
            quantity={65}
          />

          <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <Link
              href="https://github.com/TheusHen/TheusHen"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <Github aria-hidden="true" className="h-4 w-4" />
              <span>TheusHen</span>
              {stars !== null && (
                <span className="inline-flex items-center gap-1 text-amber-200">
                  <Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                  {stars}
                </span>
              )}
            </Link>

            <nav aria-label={t("home.primaryNavigation")}>
              <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 text-sm backdrop-blur">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-10 items-center rounded-full px-3 text-white/65 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 sm:px-4"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center py-20 text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-red-300 sm:text-sm">
              {t("home.eyebrow")}
            </p>
            <h1 className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-6xl font-black tracking-[-0.075em] text-transparent sm:text-8xl md:text-[9rem] md:leading-none">
              TheusHen
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              {t("home.subtitle")}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 flex w-full max-w-lg items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] p-1.5 shadow-2xl shadow-black/40 backdrop-blur"
            >
              <label htmlFor="help-message" className="sr-only">
                {t("home.needHelp")}
              </label>
              <input
                id="help-message"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t("home.needHelp")}
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/45 focus-visible:ring-0"
              />
              <button
                type="submit"
                aria-label={t("home.sendMessage")}
                disabled={!message.trim()}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </form>
          </div>

          <a
            href="#about-me"
            className="relative z-10 mx-auto inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            {t("home.scrollDown")} {t("home.aboutMe")}
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </section>

        <section id="about-me" className="scroll-mt-6">
          <About />
        </section>
      </main>
    </>
  );
}
