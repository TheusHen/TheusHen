"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Accessibility, Languages, Check } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import { useAccessibility } from "../contexts/AccessibilityContext";

const languageOptions = [
  { value: "en", labelKey: "accessibility.languageEnglish" },
  { value: "pt", labelKey: "accessibility.languagePortuguese" },
] as const;

const textSizeOptions = [
  { value: "normal", labelKey: "accessibility.textSizeNormal" },
  { value: "large", labelKey: "accessibility.textSizeLarge" },
  { value: "xl", labelKey: "accessibility.textSizeXL" },
] as const;

export default function FloatingControls() {
  const pathname = usePathname();
  const hasLowerTopOffset = pathname === "/decisions" || pathname === "/contact";
  const { language, setLanguage, t } = useI18n();
  const {
    highContrast,
    setHighContrast,
    textSize,
    setTextSize,
    reduceMotion,
    setReduceMotion,
  } = useAccessibility();

  const [openPanel, setOpenPanel] = useState<"accessibility" | "language" | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) setOpenPanel(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPanel(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const togglePanel = (panel: "accessibility" | "language") => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <div
      ref={containerRef}
      className={`fixed right-3 z-[950] flex flex-col gap-2 sm:gap-3 ${
        hasLowerTopOffset ? "top-20 sm:top-24" : "top-3"
      }`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => togglePanel("accessibility")}
          aria-label={t("accessibility.accessibilityLabel")}
          aria-expanded={openPanel === "accessibility"}
          aria-controls="accessibility-panel"
          className="group relative flex items-center flex-row-reverse rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg sm:h-12 sm:w-12">
            <Accessibility className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
            {t("accessibility.accessibilityLabel")}
          </span>
        </button>

        {openPanel === "accessibility" && (
          <div
            id="accessibility-panel"
            role="region"
            aria-label={t("accessibility.accessibilityTitle")}
            className="absolute right-12 top-0 w-[min(16rem,calc(100vw-4.5rem))] rounded-2xl border border-white/20 bg-black/95 p-4 text-white shadow-2xl backdrop-blur sm:right-14"
          >
            <div className="mb-3 text-sm font-semibold text-white">
              {t("accessibility.accessibilityTitle")}
            </div>

            <div className="space-y-4 text-sm">
              <label className="flex items-center justify-between gap-3">
                <span className="text-white/80">{t("accessibility.highContrast")}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={highContrast}
                  aria-label={t("accessibility.highContrast")}
                  onClick={() => setHighContrast(!highContrast)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? "bg-red-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>

              <div>
                <div className="mb-2 text-white/80">{t("accessibility.textSize")}</div>
                <div className="flex flex-wrap gap-2">
                  {textSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTextSize(option.value)}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                        textSize === option.value
                          ? "border-red-400 bg-red-500/20 text-white"
                          : "border-white/20 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {textSize === option.value && <Check className="h-3 w-3" />}
                      {t(option.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between gap-3">
                <span className="text-white/80">{t("accessibility.reduceMotion")}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reduceMotion}
                  aria-label={t("accessibility.reduceMotion")}
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reduceMotion ? "bg-red-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reduceMotion ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => togglePanel("language")}
          aria-label={t("accessibility.translationLabel")}
          aria-expanded={openPanel === "language"}
          aria-controls="language-panel"
          className="group relative flex items-center flex-row-reverse rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg sm:h-12 sm:w-12">
            <Languages className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
            {t("accessibility.translationLabel")}
          </span>
        </button>

        {openPanel === "language" && (
          <div
            id="language-panel"
            role="region"
            aria-label={t("accessibility.languageTitle")}
            className="absolute right-12 top-0 w-[min(16rem,calc(100vw-4.5rem))] rounded-2xl border border-white/20 bg-black/95 p-4 text-white shadow-2xl backdrop-blur sm:right-14"
          >
            <div className="mb-3 text-sm font-semibold text-white">
              {t("accessibility.languageTitle")}
            </div>

            <div className="flex flex-col gap-2">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                    language === option.value
                      ? "border-red-400 bg-red-500/20 text-white"
                      : "border-white/15 text-white/75 hover:border-white/35"
                  }`}
                >
                  {t(option.labelKey)}
                  {language === option.value && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-white/60">
              {t("accessibility.languageNotice")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
