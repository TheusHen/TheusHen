"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function CollegeDecisionsBar() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/decisions") return null;

  return (
    <Link
      href="/decisions"
      className="fixed left-3 top-3 z-[900] inline-flex min-h-11 items-center gap-2 rounded-full border border-red-400/20 bg-red-950/85 px-4 py-2 text-sm font-semibold text-red-50 shadow-lg shadow-black/30 backdrop-blur-xl transition hover:border-red-300/30 hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
    >
      {t("decisions.bar")}
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
