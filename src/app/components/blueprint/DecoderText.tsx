"use client";

import { useEffect, useState } from "react";
import { cn } from "@/app/lib/cn";

const GLYPHS = "█▓▒░<>/\\|01";

/** Giant title with proprietary decode + mixed editorial sizes. */
export default function DecoderText({
  text,
  className,
  as: Tag = "h1",
  speed = 28,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
  speed?: number;
}) {
  const [out, setOut] = useState(text);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "reduced"
    ) {
      setOut(text);
      setDone(true);
      return;
    }
    let frame = 0;
    const total = text.length * 2 + 8;
    const id = window.setInterval(() => {
      frame++;
      const resolved = Math.floor((frame / total) * text.length);
      let s = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        const ch = text[i];
        s += ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (frame >= total) {
        window.clearInterval(id);
        setOut(text);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  const MTag = Tag as "h1";

  return (
    <MTag className={cn(!done && "bp-caret", className)} aria-label={text}>
      <span aria-hidden>{out}</span>
    </MTag>
  );
}
