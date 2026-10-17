"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Timeline from "../components/Timeline";
import BlueprintShell from "../components/blueprint/BlueprintShell";
import GridCell from "../components/blueprint/GridCell";
import DecoderText from "../components/blueprint/DecoderText";
import { useI18n } from "../contexts/I18nContext";
import TimelineEn from "@/content/timeline.en.mdx";
import TimelinePt from "@/content/timeline.pt.mdx";

export default function TimelinePage() {
  const { t, language } = useI18n();
  const Mdx = language === "pt" ? TimelinePt : TimelineEn;

  return (
    <BlueprintShell>
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-white transition hover:border-[#ff2b2b]/60"
        >
          <ArrowLeft size={14} /> {t("nav.backHome")}
        </Link>
        <div className="bp-grid mt-6">
          <GridCell id="SEC.03 // TIMELINE" index="10" label="logbook" span="bp-span-8">
            <span className="bp-eyebrow"><span className="bp-dot" />markdown → github</span>
            <DecoderText text={t("timeline.title")} className="bp-giant mt-5 text-[clamp(2.8rem,8vw,6rem)]" />
            <p className="mt-4 max-w-xl text-base leading-8 text-zinc-300">{t("timeline.subtitle")}</p>
          </GridCell>
          <GridCell id="SEC.03 // ABOUT-FIELD" index="11" label="mdx" span="bp-span-4">
            <div className="bp-mdx text-[14px]"><Mdx /></div>
          </GridCell>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="bp-grid mt-8">
          <div className="bp-cell bp-span-12">
            <div className="bp-label relative z-10"><span className="bp-tick" /><span className="bp-id">12</span><span>SEC.03 // NODES</span></div>
            <div className="relative z-10"><Timeline /></div>
          </div>
        </div>
      </div>
    </BlueprintShell>
  );
}
