"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/cn";

/** Scroll reveal with IntersectionObserver + stagger via --bp-delay. */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "span";
  delay?: number;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "reduced"
    ) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const MTag = Tag as "div";

  return (
    <MTag
      ref={ref as React.Ref<HTMLDivElement>}
      style={{ "--bp-delay": `${delay}ms` } as React.CSSProperties}
      className={cn("bp-reveal", inView && "is-in", className)}
      {...rest}
    >
      {children}
    </MTag>
  );
}
