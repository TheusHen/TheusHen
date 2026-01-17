"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type TextSize = "normal" | "large" | "xl";

type AccessibilityContextValue = {
    highContrast: boolean;
    setHighContrast: (value: boolean) => void;
    textSize: TextSize;
    setTextSize: (value: TextSize) => void;
    reduceMotion: boolean;
    setReduceMotion: (value: boolean) => void;
};

const STORAGE_KEY = "theushen-accessibility";

const defaultState = {
    highContrast: false,
    textSize: "normal" as TextSize,
    reduceMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [highContrast, setHighContrast] = useState(defaultState.highContrast);
    const [textSize, setTextSize] = useState<TextSize>(defaultState.textSize);
    const [reduceMotion, setReduceMotion] = useState(defaultState.reduceMotion);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Partial<typeof defaultState>;
                if (typeof parsed.highContrast === "boolean") setHighContrast(parsed.highContrast);
                if (parsed.textSize === "normal" || parsed.textSize === "large" || parsed.textSize === "xl") {
                    setTextSize(parsed.textSize);
                }
                if (typeof parsed.reduceMotion === "boolean") setReduceMotion(parsed.reduceMotion);
            } catch {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const payload = JSON.stringify({ highContrast, textSize, reduceMotion });
        window.localStorage.setItem(STORAGE_KEY, payload);
    }, [highContrast, textSize, reduceMotion]);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        root.dataset.contrast = highContrast ? "high" : "default";
        root.dataset.textSize = textSize;
        root.dataset.motion = reduceMotion ? "reduced" : "default";
    }, [highContrast, textSize, reduceMotion]);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        const update = () => {
            if (prefersReduced?.matches) {
                root.dataset.motionPref = "reduced";
            } else {
                root.dataset.motionPref = "default";
            }
        };
        update();
        prefersReduced?.addEventListener?.("change", update);
        return () => prefersReduced?.removeEventListener?.("change", update);
    }, []);

    const value = useMemo(
        () => ({
            highContrast,
            setHighContrast,
            textSize,
            setTextSize,
            reduceMotion,
            setReduceMotion,
        }),
        [highContrast, setHighContrast, textSize, setTextSize, reduceMotion, setReduceMotion]
    );

    return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
}
