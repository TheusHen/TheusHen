"use client";

import { Globe2 } from "lucide-react";
import { useGlobe } from "../contexts/GlobeContext";
import { useI18n } from "../contexts/I18nContext";

export default function GlobalSwitch() {
  const { globeActive, setGlobeActive } = useGlobe();
  const { t } = useI18n();
  const label = globeActive ? t("about.globeHide") : t("about.globeShow");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={globeActive}
      onClick={() => setGlobeActive(!globeActive)}
      className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
    >
      <Globe2 aria-hidden="true" className="h-4 w-4" />
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 rounded-full transition-colors ${
          globeActive ? "bg-red-500" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            globeActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}
