"use client";
import React from "react";
import { useGlobe } from "../contexts/GlobeContext";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function isMobile() {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

const switchVariants = {
    active: {
        backgroundColor: "#3B82F6",
        transition: { type: "spring", stiffness: 350, damping: 28 }
    },
    inactive: {
        backgroundColor: "#000000",
        transition: { type: "spring", stiffness: 350, damping: 28 }
    }
};

const knobVariants = {
    active: {
        x: 24, // translate-x-6, 1.5rem = 24px
        boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
        transition: { type: "spring", stiffness: 350, damping: 28 }
    },
    inactive: {
        x: 0,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
        transition: { type: "spring", stiffness: 350, damping: 28 }
    }
};

const GlobalSwitch = () => {
    const { globeActive, setGlobeActive } = useGlobe();
    const pathname = usePathname();

    if (pathname !== "/") return null;

    if (typeof window !== "undefined" && isMobile()) return null;

    return (
        <div
            className="fixed top-2 left-4 z-[9999]"
            style={{ userSelect: "none" }}
        >
            <motion.div
                className="w-12 h-6 flex items-center rounded-full p-1 cursor-pointer"
                initial={false}
                animate={globeActive ? "active" : "inactive"}
                variants={switchVariants}
                onClick={() => setGlobeActive(!globeActive)}
                role="checkbox"
                aria-checked={globeActive}
                tabIndex={0}
            >
                <motion.div
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    variants={knobVariants}
                />
            </motion.div>
        </div>
    );
};

export default GlobalSwitch;
