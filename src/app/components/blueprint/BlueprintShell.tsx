"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import ScrollRail from "./ScrollRail";

const BlueprintField = dynamic(() => import("./BlueprintField"), { ssr: false });

/** Shell: centralizes --mx/--my + field + rail. No fills in children. */
export default function BlueprintShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
        document.documentElement.style.setProperty("--my", `${e.clientY}px`);
        document.querySelectorAll<HTMLElement>(".bp-hover").forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--mouse-x", `${x}%`);
          card.style.setProperty("--mouse-y", `${y}%`);
        });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bp-shell">
      <BlueprintField density={70} />
      <ScrollRail />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
