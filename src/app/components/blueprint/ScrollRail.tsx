"use client";

import { useEffect, useState } from "react";

/** Side rail: scroll % + red fill. */
export default function ScrollRail() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setPct(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="bp-rail" aria-hidden="true">
      <span className="bp-rail-pct">SCROLL</span>
      <div className="bp-rail-track">
        <div className="bp-rail-fill" style={{ height: `${Math.round(pct * 100)}%` }} />
      </div>
      <span className="bp-rail-pct">{String(Math.round(pct * 100)).padStart(2, "0")}%</span>
    </div>
  );
}
