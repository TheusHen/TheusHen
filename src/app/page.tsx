"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Star } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./index.css";
import ClientRemount from "./client-remount";
import { useI18n } from "./contexts/I18nContext";
import BlueprintShell from "./components/blueprint/BlueprintShell";
import GridCell from "./components/blueprint/GridCell";
import DecoderText from "./components/blueprint/DecoderText";
import Reveal from "./components/blueprint/Reveal";
import About from "./pages/about";

const navigation = [
  { key: "nav.projects", href: "/projects" },
  { key: "nav.timeline", href: "/timeline" },
  { key: "nav.contact", href: "/contact" },
];

const REPO_OWNER = "TheusHen";
const REPO_NAME = "TheusHen";

export default function Home() {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
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

  const handleSend = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      window.location.href = `https://intouchbot.theushen.works?help=${encodedMessage}`;
    }
  };

  const handleScrollToAboutMe = () => {
    document.getElementById("about-me")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <BlueprintShell>
      <ClientRemount>
        <SpeedInsights />
        {/* HERO — grid 12 que se rearranja */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6">
          <Reveal>
            <nav className="flex flex-wrap items-center justify-between gap-4" aria-label="Primary">
              <Link
                href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bp-hover inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-zinc-300 backdrop-blur transition hover:border-[#ff2b2b]/50 hover:text-white"
              >
                <Star size={15} className="fill-[#ff2b2b] text-[#ff2b2b]" />
                {stars !== null ? (
                  <>
                    <span className="font-bold text-white">{stars}</span>
                    <span className="hidden sm:inline">{t("home.stars")}</span>
                    <span className="text-zinc-500">· {t("home.support")}</span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse bg-[#ff2b2b]" aria-hidden="true" />
                    {t("home.loading")}
                  </span>
                )}
              </Link>
              <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-400 transition hover:bg-white hover:text-black"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <div className="bp-grid mt-8">
            <GridCell id="SEC.00 // HERO" index="01" label="hero" span="bp-span-8" reflow="bp-reflow-a">
              <p className="bp-mono text-[11px] uppercase tracking-[0.22em] text-[#ff5a5a]">
                {t("home.eyebrow")}
              </p>
              <DecoderText
                text="TheusHen"
                className="bp-giant mt-4 text-[clamp(3.5rem,11vw,8.5rem)]"
              />
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <p className="max-w-md text-base leading-8 text-zinc-300 sm:text-lg">
                  {t("home.heroBioBefore")}
                  <span className="text-white font-semibold">{t("home.heroBioBold")}</span>
                  {t("home.heroBioAfter")}<span className="text-[#ff5a5a] font-semibold">20t</span>{t("home.heroBioTail")}
                </p>
                <div className="font-mono text-xs leading-6 text-zinc-500">
                  <p><span className="text-zinc-300">$</span> {t("home.metaWhoami")}</p>
                  <p><span className="text-zinc-300">$</span> {t("home.metaStack")}</p>
                  <p><span className="text-zinc-300">$</span> {t("home.metaStatus")} <span className="text-[#ff5a5a]">{t("home.metaBuilding")}</span></p>
                  <p><span className="text-zinc-300">$</span> {t("home.metaLocale")}</p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div
                  className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 opacity-60 backdrop-blur"
                  aria-disabled="true"
                >
                  <input
                    type="text"
                    placeholder="System under maintenance..."
                    value=""
                    disabled
                    className="flex-1 cursor-not-allowed bg-transparent px-3 font-mono text-sm text-white outline-none placeholder:text-zinc-500"
                    aria-label="Question field temporarily unavailable"
                  />

                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-full bg-[#ff2b2b]/40 p-2.5 text-white/50"
                    aria-label="Sending temporarily unavailable"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>

                <button
                  onClick={handleScrollToAboutMe}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-zinc-300 transition hover:border-[#ff2b2b]/60 hover:text-white"
                >
                  {t("home.scrollDown")} {t("home.aboutMe")}
                  <ArrowDown
                    size={14}
                    className="animate-bounce text-[#ff2b2b]"
                  />
                </button>
              </div>
            </GridCell>

            <GridCell id="SEC.00 // INDEX" index="02" label="index" span="bp-span-4" reflow="bp-reflow-b">
              <p className="bp-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">{t("blueprint.siteIndex")}</p>
              <ul className="mt-4 space-y-0">
                {[
                  ["01", "About", "#about-me", "bio / stack / timer"],
                  ["02", "Projects", "/projects", "20t / repos / gists"],
                  ["03", "Timeline", "/timeline", "logbook / github md"],
                  ["04", "Contact", "/contact", "collab / oss"],
                  ["05", "Decisions", "/decisions", "college / mit'28"],
                ].map(([n, name, href, desc]) => (
                  <li key={n} className="group border-t border-white/[0.07] py-3 first:border-t-0 first:pt-0">
                    <Link href={href} className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-[#ff2b2b]">{n}</span>
                      <span className="font-display text-2xl font-bold tracking-tight text-white transition group-hover:translate-x-1 group-hover:text-[#ff5a5a]">
                        {name}
                      </span>
                      <span className="ml-auto hidden font-mono text-[10px] text-zinc-600 lg:inline">{desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/[0.07] pt-4 font-mono text-[11px] leading-5 text-zinc-600">
                {t("home.indexNote")}
              </p>
            </GridCell>
          </div>
        </div>

        <div id="about-me" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <About />
        </div>
      </ClientRemount>
    </BlueprintShell>
  );
}
