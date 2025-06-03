"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

type GlobeContextType = {
    globeActive: boolean;
    setGlobeActive: (value: boolean) => void;
};

const GlobeContext = createContext<GlobeContextType | undefined>(undefined);

export function GlobeProvider({ children }: { children: ReactNode }) {
    const [globeActive, setGlobeActive] = useState(false);
    return (
        <GlobeContext.Provider value={{ globeActive, setGlobeActive }}>
            {children}
        </GlobeContext.Provider>
    );
}

export function useGlobe() {
    const context = useContext(GlobeContext);
    if (!context) {
        throw new Error("useGlobe must be used within a GlobeProvider");
    }
    return context;
}

export { GlobeContext };