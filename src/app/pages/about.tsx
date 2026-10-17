"use client";

import React from "react";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import GridCell from "../components/blueprint/GridCell";
import DecoderText from "../components/blueprint/DecoderText";
import Reveal from "../components/blueprint/Reveal";
import CollegeTimer from "../components/blueprint/CollegeTimer";
import AboutEn from "@/content/about.en.mdx";
import AboutPt from "@/content/about.pt.mdx";

const PROFILE_IMAGE = "https://avatars.githubusercontent.com/u/180109164";
const HACKCLUB_IMAGE =
  "https://images.fillout.com/orgid-81/flowpublicid-eLhFehpKG6us/widgetid-cbsLd1W9tHmPW9frkYFap2/3G6y1B7Rk3agk6YVqtLmJN/Group-106.png?a=hcRnPh87k73TcrVHzBe6UW";
const COLLEGE_APP_DATE = new Date("2028-11-01T00:00:00Z");

export default function About() {
  const { t, language } = useI18n();
  const Mdx = language === "pt" ? AboutPt : AboutEn;

  return (
    <div className="bp-grid">
      {/* BIO — large text + small mono, MDX powered */}
      <GridCell id="SEC.01 // BIO" index="03" label="about-mtx" span="bp-span-7" reflow="bp-reflow-a">
        <DecoderText text={`${t("about.titlePrefix")}TheusHen!`} as="h2" className="bp-giant text-[clamp(2.2rem,5vw,3.8rem)]" />
        <div className="bp-mdx mt-2">
          <Mdx />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://github.com/TheusHen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff2b2b] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black"
          >
            <Github size={15} /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/matheus-henrique-741776367/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-[#ff2b2b] hover:text-[#ff5a5a]"
          >
            <Linkedin size={15} /> LinkedIn
          </a>
        </div>
        <Reveal delay={120} className="mt-8 overflow-hidden border border-white/10">
          <Image
            src="https://raw.githubusercontent.com/TheusHen/TheusHen/output/snake.svg"
            alt="GitHub Contribution Snake"
            width={800}
            height={200}
            className="h-auto w-full"
            loading="lazy"
          />
        </Reveal>
      </GridCell>

      {/* PROFILE — image square inside the cell */}
      <GridCell id="SEC.01 // PROFILE" index="04" label="fig" span="bp-span-5" reflow="bp-reflow-b">
        <div className="relative mx-auto w-fit">
          <Image
            src={PROFILE_IMAGE}
            alt="Profile photo"
            width={220}
            height={220}
            className="h-52 w-52 rounded-full border-2 border-[#ff2b2b] object-cover shadow-[0_0_60px_rgba(255,43,43,0.25)]"
            priority
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
            alt="Brazil Flag"
            width={64}
            height={44}
            className="absolute -bottom-1 -right-2 h-9 w-14 rounded border border-white/20 shadow-lg"
            loading="lazy"
          />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-6">
          <div>
            <p className="font-display text-2xl font-bold text-white">20t</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">founder</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white">MIT&apos;28</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">target</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#ff5a5a]">OSS</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">first</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4 border border-white/10 p-4">
          <Image src={HACKCLUB_IMAGE} alt="Hack Club" width={120} height={52} className="h-12 w-auto" loading="lazy" />
          <div>
            <p className="font-display text-lg font-bold text-white">{t("about.hackClubTitle")}</p>
            <p className="font-mono text-[11px] text-zinc-500">{t("about.hackClubSubtitle")}</p>
          </div>
        </div>
      </GridCell>

      {/* TIMER — full-width cell, reflows below on mobile */}
      <GridCell id="SEC.01 // COUNTDOWN" index="05" label="timer" span="bp-span-12" reflow="bp-reflow-c">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff5a5a]">{t("about.timerTitle")}</p>
            <p className="font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              College Application <span className="text-[#ff2b2b]">— 2028.11.01</span>
            </p>
          </div>
          <CollegeTimer target={COLLEGE_APP_DATE} />
        </div>
      </GridCell>
    </div>
  );
}
