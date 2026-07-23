"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Cpu, Github, Linkedin, MapPin, Waves } from "lucide-react";
import Fall from "../components/Fall";
import GlobalSwitch from "../components/Switch";
import { useI18n } from "../contexts/I18nContext";

const LazyGlobe = dynamic(() => import("../components/LazyGlobe"), {
  ssr: false,
  loading: () => null,
});

const work = [
  {
    name: "EEGFrontier",
    descriptionKey: "about.eegWork",
    href: "https://github.com/TheusHen/EEGFrontier",
    icon: Cpu,
  },
  {
    name: "Nautilus AquaVision",
    descriptionKey: "about.aquaWork",
    href: "https://github.com/TheusHen/Nautilus-AquaVision-v0",
    icon: Waves,
  },
  {
    name: "Ternary Ibex",
    descriptionKey: "about.ternaryWork",
    href: "https://github.com/TheusHen/ternary-ibex",
    icon: Cpu,
  },
] as const;

export default function About() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(153,27,27,0.18),transparent_28%),linear-gradient(155deg,#070707,#121212_60%,#180707)] px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:grid-cols-[1fr_280px] md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
              {t("about.selectedWork")}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl">
              {t("about.titlePrefix")}
              <span className="text-red-400">TheusHen</span>
            </h2>

            <div className="mt-7 max-w-3xl space-y-4 text-base leading-8 text-white/70 sm:text-lg">
              <p>
                {t("about.paragraphOneBeforeMit")}
                <strong className="font-semibold text-white">
                  {t("about.aerospaceEngineering")}
                </strong>
                {t("about.paragraphOneAfterMit")}
              </p>
              <p>
                {t("about.paragraphTwoBefore20t")}
                <strong className="font-semibold text-white">20t</strong>
                {t("about.paragraphTwoAfter20t")}
              </p>
              <p>
                {t("about.paragraphThreeBeforeShipwrecked")}
                <strong className="font-semibold text-white">Hack Club</strong>
                {t("about.paragraphThreeBetween")}
                <strong className="font-semibold text-white">open source</strong>
                {t("about.paragraphThreeAfterHackClub")}
              </p>
              <p>{t("about.paragraphFour")}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="https://github.com/TheusHen"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                <Github aria-hidden="true" className="h-4 w-4" />
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/matheus-henrique-741776367/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                <Linkedin aria-hidden="true" className="h-4 w-4" />
                LinkedIn
              </Link>
            </div>
          </div>

          <aside className="flex flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 text-center">
            <Image
              src="https://avatars.githubusercontent.com/u/180109164"
              alt="Matheus Henrique"
              width={192}
              height={192}
              className="h-40 w-40 rounded-full border-4 border-red-400/70 object-cover shadow-xl sm:h-48 sm:w-48"
              priority
            />
            <p className="mt-5 text-xl font-bold text-white">Matheus Henrique</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-white/60">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {t("about.location")} 🇧🇷
            </p>
          </aside>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {work.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.5rem] border border-white/10 bg-black/25 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                <div className="flex items-center justify-between">
                  <Icon aria-hidden="true" className="h-6 w-6 text-red-300" />
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-white/45 transition group-hover:text-white"
                  />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {t(item.descriptionKey)}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-5">
          <GlobalSwitch />
          <LazyGlobe />
        </div>

        <Fall />
      </div>
    </div>
  );
}
