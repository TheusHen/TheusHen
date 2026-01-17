"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Particles from "../components/particles";
import Timeline from "../components/Timeline";
import { useI18n } from "../contexts/I18nContext";

export default function TimelinePage() {
    const { t } = useI18n();

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-900/60 to-black text-white">
            <Particles className="absolute inset-0 -z-10 opacity-60" quantity={70} />
            <div className="absolute left-6 top-16 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("nav.backHome")}
                </Link>
            </div>
            <div className="relative">
                <Timeline />
            </div>
        </div>
    );
}
