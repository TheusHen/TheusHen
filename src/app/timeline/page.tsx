import React from "react";
import type { Metadata } from "next";
import Particles from "../components/particles";
import Timeline from "../components/Timeline";

export const metadata: Metadata = {
    title: "Timeline",
};

export default function TimelinePage() {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-900/60 to-black text-white">
            <Particles className="absolute inset-0 -z-10 opacity-60" quantity={70} />
            <div className="relative">
                <Timeline />
            </div>
        </div>
    );
}
