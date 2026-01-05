import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Particles from "../components/particles";
import Timeline from "../components/Timeline";

export const metadata: Metadata = {
    title: "Timeline",
};

export default function TimelinePage() {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-900/60 to-black text-white">
            <Particles className="absolute inset-0 -z-10 opacity-60" quantity={70} />
            <div className="absolute right-6 top-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back home
                </Link>
            </div>
            <div className="relative">
                <Timeline />
            </div>
        </div>
    );
}
