"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Timeline from "../components/Timeline";
import { useI18n } from "../contexts/I18nContext";

export default function TimelinePage() {
  const { t } = useI18n();

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_50%_0%,rgba(14,116,144,0.14),transparent_28rem),linear-gradient(180deg,#050505,#0b0b0b)] text-white">
      <Link
        href="/"
        aria-label={t("nav.backHome")}
        className="absolute left-5 top-20 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-medium text-white/75 transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 sm:left-8"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        {t("nav.backHome")}
      </Link>
      <Timeline />
    </main>
  );
}
