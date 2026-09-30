"use client";

import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

export function useScramble(target: string, duration = 700) {
    const [output, setOutput] = useState(target);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setOutput(target);
            return;
        }
        let frame = 0;
        const start = performance.now();
        const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const revealed = Math.floor(progress * target.length);
            let next = "";
            for (let i = 0; i < target.length; i++) {
                if (i < revealed || target[i] === " ") next += target[i];
                else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            setOutput(next);
            if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return output;
}
