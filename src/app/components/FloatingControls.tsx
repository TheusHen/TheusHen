"use client";

import React, { useEffect, useRef, useState } from "react";
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
    const { language, setLanguage, t } = useI18n();
    const { highContrast, setHighContrast, textSize, setTextSize, reduceMotion, setReduceMotion } = useAccessibility();
    const [openPanel, setOpenPanel] = useState<"accessibility" | "language" | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setOpenPanel(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const togglePanel = (panel: "accessibility" | "language") => {
        setOpenPanel((prev) => (prev === panel ? null : panel));
    };

    return (
        <div
            ref={containerRef}
            className="fixed left-4 z-[9999] flex flex-col gap-3"
            style={{ top: "50vh", transform: "translateY(-50%)" }}
        >
            <div className="relative">
                <button
                    type="button"
                    onClick={() => togglePanel("accessibility")}
                    aria-label={t("accessibility.accessibilityLabel")}
                    aria-expanded={openPanel === "accessibility"}
                    className="group flex items-center"
                >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-200 group-hover:scale-105">
                        <Accessibility className="h-6 w-6" />
                    </span>
                    <span className="ml-3 max-w-0 overflow-hidden rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
                        {t("accessibility.accessibilityLabel")}
                    </span>
                </button>

                {openPanel === "accessibility" && (
                    <div className="absolute left-14 top-0 w-64 rounded-2xl border border-white/20 bg-black/90 p-4 text-white shadow-2xl backdrop-blur">
                        <div className="mb-3 text-sm font-semibold text-white">
                            {t("accessibility.accessibilityTitle")}
                        </div>
                        <div className="space-y-4 text-sm">
                            <label className="flex items-center justify-between gap-3">
                                <span className="text-white/80">{t("accessibility.highContrast")}</span>
                                <button
                                    type="button"
                                    onClick={() => setHighContrast(!highContrast)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? "bg-red-500" : "bg-white/20"}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? "translate-x-5" : "translate-x-1"}`}
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
                                    onClick={() => setReduceMotion(!reduceMotion)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reduceMotion ? "bg-red-500" : "bg-white/20"}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reduceMotion ? "translate-x-5" : "translate-x-1"}`}
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
                    className="group flex items-center"
                >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-200 group-hover:scale-105">
                        <Languages className="h-6 w-6" />
                    </span>
                    <span className="ml-3 max-w-0 overflow-hidden rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
                        {t("accessibility.translationLabel")}
                    </span>
                </button>

                {openPanel === "language" && (
                    <div className="absolute left-14 top-0 w-64 rounded-2xl border border-white/20 bg-black/90 p-4 text-white shadow-2xl backdrop-blur">
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
                        <p className="mt-3 text-xs text-white/60">{t("accessibility.languageNotice")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
