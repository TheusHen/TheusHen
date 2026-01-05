"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, CalendarDays, Clock3 } from "lucide-react";

// Repo info to build GitHub links.
const GITHUB_OWNER = "TheusHen";
const GITHUB_REPO = "TheusHen";
const GITHUB_BRANCH = "feat-add-timeline";

// Folder that contains your markdown files (must be at repository root for the GitHub link builder below)
const TIMELINE_FOLDER = "line";

// Visual tuning (bigger cards)
const CARD_MAX_W = 520;
const CARD_MIN_W = 360;
const NODE_SIZE = 14;

type TimelineItem = {
  id: string; // filename: "2026-01-05.md"
  dateISO: string; // YYYY-MM-DD
  timeHHMM: string; // HH:mm
  title: string;
  githubUrl: string;
  orderKey: number;
};

type ApiItem = {
  id: string;
  dateISO: string;
  timeHHMM: string;
  title: string;
  linkOverride: string | null;
  orderKey: number;
};

gsap.registerPlugin(ScrollTrigger);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildGithubMdUrl(fileName: string) {
  const encodedPath = `${TIMELINE_FOLDER}/${fileName}`.split("/").map(encodeURIComponent).join("/");
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${encodedPath}`;
}

export default function Timeline() {
  const reducedMotion = useReducedMotion();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);

  const [items, setItems] = useState<TimelineItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/timeline", { cache: "no-store" });
        const data: { items: ApiItem[] } = await res.json();

        const loaded: TimelineItem[] = (data.items ?? []).map((it) => ({
          id: it.id,
          dateISO: it.dateISO,
          timeHHMM: it.timeHHMM,
          title: it.title,
          githubUrl: it.linkOverride ?? buildGithubMdUrl(it.id),
          orderKey: it.orderKey,
        }));

        if (!cancelled) {
          setItems(loaded);
          setActiveId(loaded[0]?.id ?? null);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setActiveId(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // GSAP horizontal scroll + pin
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    const pin = pinRef.current;
    const rail = railRef.current;
    const itemsEl = itemsRef.current;
    if (!root || !pin || !rail || !itemsEl) return;
    if (!items.length) return;

    const ctx = gsap.context(() => {
      const measure = () => {
        const railW = rail.scrollWidth;
        const pinW = pin.clientWidth;
        return Math.max(0, railW - pinW);
      };

      const tween = gsap.to(rail, {
        x: () => -measure(),
        ease: "none",
        paused: true,
      });

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${Math.max(900, measure() + window.innerHeight * 0.8)}`,
        pin: pin,
        anticipatePin: 1,
        scrub: 1,
        onRefresh: () => {
          tween.vars.x = () => -measure();
          tween.invalidate();
        },
        onUpdate: (self) => {
          const p = self.progress;
          tween.progress(p);

          // Active item approximation based on progress across nodes
          if (items.length > 1) {
            const idx = Math.round(p * (items.length - 1));
            const id = items[clamp(idx, 0, items.length - 1)]?.id ?? null;
            setActiveId(id);
          }
        },
      });

      // Entrance animations
      const nodes = gsap.utils.toArray<HTMLElement>("[data-tl-node]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-tl-card]");

      gsap.fromTo(itemsEl, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });

      gsap.fromTo(
        nodes,
        { scale: 0.65, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.6)", stagger: 0.04, delay: 0.15 }
      );

      gsap.fromTo(
        cards,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.05, delay: 0.2 }
      );

      return () => {
        st.kill();
        tween.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [items, reducedMotion]);

  const cardW = clamp(Math.floor((CARD_MAX_W + CARD_MIN_W) / 2), CARD_MIN_W, CARD_MAX_W);

  return (
    <div ref={rootRef} className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-950">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-44 left-1/3 h-[380px] w-[780px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-52 right-1/3 h-[420px] w-[820px] translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <motion.h2
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Timeline
          </motion.h2>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-pretty text-sm text-white/65 sm:text-base"
          >
            Scroll to move through time. Each point opens the full markdown entry on GitHub.
          </motion.p>
        </div>

        <div
          ref={pinRef}
          className="relative rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)] backdrop-blur"
        >
          {/* subtle top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Viewport */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* HUD */}
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
              <span className="text-xs font-medium text-white/80">Journey</span>
              {activeId ? (
                <span className="text-xs text-white/55">• {items.find((x) => x.id === activeId)?.dateISO ?? ""}</span>
              ) : null}
            </div>

            {/* Horizontal rail */}
            <div ref={railRef} className="relative">
              <div ref={itemsRef} className="relative px-8 py-20 sm:px-10 sm:py-24">
                {/* baseline */}
                <div className="absolute left-8 right-8 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-white/10 via-white/25 to-white/10 sm:left-10 sm:right-10" />

                {/* moving glow */}
                <div className="pointer-events-none absolute left-8 right-8 top-1/2 h-[18px] -translate-y-1/2 bg-gradient-to-r from-indigo-500/0 via-indigo-500/15 to-cyan-500/0 blur-xl sm:left-10 sm:right-10" />

                {/* ITEMS ONLY (no start / no now) */}
                <div className="relative flex items-center gap-10 px-4">
                  {items.map((it, idx) => {
                    const isTop = idx % 2 === 0;
                    const isActive = activeId === it.id;

                    return (
                      <div key={it.id} className="relative flex flex-col items-center">
                        {/* node */}
                        <button
                          type="button"
                          data-tl-node
                          onClick={() => window.open(it.githubUrl, "_blank", "noopener,noreferrer")}
                          className={[
                            "group relative flex items-center justify-center rounded-full transition",
                            "outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-0",
                          ].join(" ")}
                          style={{ width: NODE_SIZE * 2.3, height: NODE_SIZE * 2.3 }}
                          aria-label={`Open ${it.title} on GitHub`}
                        >
                          <span
                            className={[
                              "absolute inset-0 rounded-full blur-md transition-opacity",
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                            ].join(" ")}
                            style={{
                              background:
                                "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.55), rgba(34,211,238,0.0) 70%)",
                            }}
                          />
                          <span
                            className={[
                              "relative rounded-full transition-all",
                              isActive
                                ? "bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.25)]"
                                : "bg-white/80 shadow-[0_0_0_6px_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.18)] group-hover:shadow-[0_0_0_8px_rgba(99,102,241,0.12),0_0_0_1px_rgba(255,255,255,0.22)]",
                            ].join(" ")}
                            style={{ width: NODE_SIZE, height: NODE_SIZE }}
                          />
                        </button>

                        {/* stem */}
                        <div
                          className={[
                            "absolute left-1/2 w-px -translate-x-1/2",
                            isTop ? "top-1/2 -translate-y-full" : "top-1/2",
                          ].join(" ")}
                          style={{
                            height: 46,
                            background:
                              "linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.18), rgba(255,255,255,0.0))",
                          }}
                        />

                        {/* card */}
                        <motion.a
                          data-tl-card
                          href={it.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          initial={false}
                          whileHover={reducedMotion ? undefined : { y: isTop ? -2 : 2 }}
                          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                          className={[
                            "absolute z-10 block",
                            "rounded-2xl border border-white/10 bg-black/35 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.95)] backdrop-blur",
                            "transition-colors hover:border-white/20",
                            "group",
                          ].join(" ")}
                          style={{
                            width: cardW,
                            top: isTop ? `calc(50% - ${62 + 46 + 160}px)` : `calc(50% + ${62 + 46}px)`,
                          }}
                          onMouseEnter={() => setActiveId(it.id)}
                          onFocus={() => setActiveId(it.id)}
                        >
                          <div className="relative p-5">
                            {/* glow */}
                            <div
                              className={[
                                "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                                "group-hover:opacity-100",
                              ].join(" ")}
                              style={{
                                background:
                                  "radial-gradient(600px circle at 20% 0%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(600px circle at 80% 100%, rgba(34,211,238,0.14), transparent 50%)",
                              }}
                            />

                            <div className="relative flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] font-medium text-white/75">
                                    <CalendarDays className="h-3.5 w-3.5 text-white/60" />
                                    {it.dateISO}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] font-medium text-white/60">
                                    <Clock3 className="h-3.5 w-3.5 text-white/50" />
                                    {it.timeHHMM}
                                  </span>
                                </div>

                                <div className="text-base sm:text-lg font-semibold leading-snug text-white break-words">
                                  {it.title}
                                </div>

                                <div className="mt-2 text-sm leading-relaxed text-white/55">
                                  Click to open the full entry on GitHub.
                                </div>
                              </div>

                              <div className="shrink-0">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors group-hover:bg-white/10 group-hover:text-white">
                                  <ExternalLink className="h-5 w-5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.a>

                        {/* card pointer */}
                        <div
                          className={[
                            "pointer-events-none absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45",
                            "border border-white/10 bg-black/35",
                            isTop ? "top-[calc(50%-46px-14px)]" : "top-[calc(50%+46px+10px)]",
                          ].join(" ")}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* bottom gradient fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-950/80 to-transparent" />
          </div>
        </div>

        {/* fallback (reduced motion or no items) */}
        {(!items.length || reducedMotion) && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
            {reducedMotion
              ? "Reduced motion is enabled. The timeline will render without scroll-pinning animations."
              : "No markdown files found in /line. Add files like 2026-01-05.md with a first line heading: '# Title'."}
          </div>
        )}
      </div>
    </div>
  );
}
