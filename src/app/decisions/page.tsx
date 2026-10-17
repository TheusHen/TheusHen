"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay, Keyboard } from "swiper/modules";
import { ArrowLeft } from "lucide-react";
import Confetti from "react-confetti";
import { useI18n } from "@/app/contexts/I18nContext";
import BlueprintShell from "@/app/components/blueprint/BlueprintShell";
import GridCell from "@/app/components/blueprint/GridCell";
import DecoderText from "@/app/components/blueprint/DecoderText";
import CollegeTimer from "@/app/components/blueprint/CollegeTimer";

// Self-hosted seals in public/decisions — no upstream dependency, can't expire.
const images = [
  { src: "/decisions/mit.png", alt: "MIT Seal" },
  { src: "/decisions/harvard.png", alt: "Harvard Shield" },
  { src: "/decisions/northwestern.png", alt: "Northwestern Seal" },
  { src: "/decisions/yale.png", alt: "Yale Shield" },
  { src: "/decisions/stanford.png", alt: "Stanford Seal" },
  { src: "/decisions/princeton.png", alt: "Princeton Seal" },
  { src: "/decisions/caltech.png", alt: "Caltech Logo" },
];

// Duplicated set so loop mode always has enough slides (needs >= 2x slidesPerView).
const loopImages = [...images, ...images];

const DRIVE_COOLDOWN_MS = 900;

export default function AutoCarousel() {
  const { t } = useI18n();
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [mobile, setMobile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const lastDrive = useRef(0);
  const touchY = useRef<number | null>(null);
  const targetDate = useMemo(() => new Date("2027-11-01T00:00:00Z"), []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setSlidesPerView(w >= 1280 ? 4 : w >= 900 ? 3.2 : w >= 600 ? 2.3 : 1.3);
      setMobile(w < 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() >= targetDate.getTime()) setShowConfetti(true);
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Scroll drives the carousel once the page can't scroll further.
  // Scrolling down at the bottom (or up at the top) advances the slides
  // instead of doing nothing — native page scroll is untouched otherwise.
  useEffect(() => {
    const atBottom = () =>
      document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) <= 2;
    const atTop = () => window.scrollY <= 2;

    const drive = (dir: 1 | -1) => {
      const swiper = swiperRef.current;
      if (!swiper) return;
      const now = Date.now();
      if (now - lastDrive.current < DRIVE_COOLDOWN_MS) return;
      lastDrive.current = now;
      if (dir === 1) swiper.slideNext();
      else swiper.slidePrev();
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 8 && atBottom()) drive(1);
      else if (e.deltaY < -8 && atTop()) drive(-1);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY.current === null) return;
      const y = e.touches[0]?.clientY ?? touchY.current;
      const dy = touchY.current - y;
      if (Math.abs(dy) < 24) return;
      if (dy > 0 && atBottom()) {
        drive(1);
        touchY.current = y;
      } else if (dy < 0 && atTop()) {
        drive(-1);
        touchY.current = y;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && atBottom()) drive(1);
      else if (e.key === "ArrowUp" && atTop()) drive(-1);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <BlueprintShell>
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6">
        {showConfetti && <Confetti />}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:-translate-x-1 hover:border-[#ff2b2b]/60" aria-label="Back">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 font-mono text-xs">
            <Link href="/projects" className="rounded-full px-4 py-2 text-zinc-300 transition hover:bg-white hover:text-black">{t("nav.projects")}</Link>
            <Link href="/contact" className="rounded-full px-4 py-2 text-zinc-300 transition hover:bg-white hover:text-black">{t("nav.contact")}</Link>
          </div>
        </div>

        <div className="bp-grid">
          <GridCell id="SEC.05 // DECISIONS" index="15" label="mit'28" span="bp-span-8">
            <span className="bp-eyebrow"><span className="bp-dot" />college decisions — scroll drives the slides</span>
            <DecoderText text="Decisions" className="bp-giant mt-5 text-[clamp(2.8rem,8vw,6rem)]" />
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">{t("blueprint.decisionsSchools")}</p>
          </GridCell>
          <GridCell id="SEC.05 // TIMER" index="16" label="t-minus" span="bp-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff5a5a]">{t("about.timerTitle")}</p>
            <div className="mt-4"><CollegeTimer target={targetDate} /></div>
            <p className="mt-4 border-t border-white/[0.07] pt-4 font-mono text-[11px] leading-5 text-zinc-600">{t("blueprint.decisionsTarget")}<br />{t("blueprint.decisionsSignal")} <span className="text-[#ff5a5a]">{t("blueprint.decisionsLocked")}</span></p>
          </GridCell>
          <GridCell id="SEC.05 // CAROUSEL" index="17" label={`slide ${activeIdx + 1} / ${images.length}`} span="bp-span-12">
            <div className="h-[min(34vw,340px)] min-h-[220px]">
              <Swiper
                modules={[EffectCoverflow, Autoplay, Keyboard]}
                onSwiper={(s) => { swiperRef.current = s; }}
                onSlideChange={(s) => setActiveIdx(s.realIndex % images.length)}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView={slidesPerView}
                loop
                autoplay={{ delay: mobile ? 1400 : 2600, disableOnInteraction: false, pauseOnMouseEnter: !mobile }}
                speed={mobile ? 650 : 480}
                coverflowEffect={{ rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: false }}
                style={{ width: "100%", height: "100%" }}
              >
                {loopImages.map((img, i) => (
                  <SwiperSlide key={`${img.src}-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
                    <Image src={img.src} alt={img.alt} width={260} height={260} draggable={false} style={{ objectFit: "contain", width: "auto", height: "auto", minWidth: 80, maxWidth: "min(23vw,220px)", minHeight: 80, maxHeight: "min(23vw,220px)", pointerEvents: "none", userSelect: "none" }} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10">
                <div className="h-full bg-[#ff2b2b] transition-all duration-500" style={{ width: `${((activeIdx + 1) / images.length) * 100}%` }} />
              </div>
              <span className="font-mono text-[11px] tabular-nums text-zinc-500">{String(activeIdx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
            </div>
          </GridCell>
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 900px) { .swiper-slide img { max-width: 150px !important; max-height: 150px !important; } }
        @media (max-width: 600px) { .swiper-slide img { max-width: 110px !important; max-height: 110px !important; } }
      `}</style>
    </BlueprintShell>
  );
}
