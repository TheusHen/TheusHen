"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarClock } from "lucide-react";
import { useI18n } from "@/app/contexts/I18nContext";
import { COLLEGE_APPLICATION_DATE } from "@/lib/site";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const universities = [
  { name: "MIT", focusKey: "decisions.mitFocus" },
  { name: "Stanford", focusKey: "decisions.stanfordFocus" },
  { name: "Caltech", focusKey: "decisions.caltechFocus" },
  { name: "Princeton", focusKey: "decisions.princetonFocus" },
  { name: "Harvard", focusKey: "decisions.harvardFocus" },
  { name: "Yale", focusKey: "decisions.yaleFocus" },
  { name: "Northwestern", focusKey: "decisions.northwesternFocus" },
] as const;

function calculateTimeLeft(): TimeLeft {
  const difference = Math.max(
    0,
    new Date(COLLEGE_APPLICATION_DATE).getTime() - Date.now()
  );

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export default function DecisionsPage() {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const timerParts = [
    { value: timeLeft.days, label: t("time.days") },
    { value: timeLeft.hours, label: t("time.hoursShort") },
    { value: timeLeft.minutes, label: t("time.minutesShort") },
    { value: timeLeft.seconds, label: t("time.secondsShort") },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_50%_0%,rgba(153,27,27,0.2),transparent_34rem),linear-gradient(180deg,#050505,#0b0b0b)] px-5 pb-20 pt-8 text-white sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            aria-label={t("nav.backHome")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm">
            <Link
              href="/projects"
              className="inline-flex min-h-10 items-center rounded-full px-4 text-white/65 transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              {t("nav.projects")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-full px-4 text-white/65 transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              {t("nav.contact")}
            </Link>
          </nav>
        </header>

        <section className="mx-auto max-w-4xl pb-14 pt-24 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-300/15 bg-red-950/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-200">
            <CalendarClock aria-hidden="true" className="h-4 w-4" />
            {t("decisions.eyebrow")}
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-[-0.065em] sm:text-7xl">
            {t("decisions.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">
            {t("decisions.description")}
          </p>
        </section>

        <section
          aria-labelledby="countdown-title"
          className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 sm:p-10"
        >
          <h2
            id="countdown-title"
            className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-red-200"
          >
            {t("decisions.countdown")}
          </h2>
          <div
            className="mx-auto mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
            aria-label={t("decisions.countdown")}
          >
            {timerParts.map((part) => (
              <div
                key={part.label}
                className="rounded-2xl border border-white/10 bg-black/25 px-4 py-6 text-center"
              >
                <span className="block font-mono text-3xl font-bold tabular-nums sm:text-4xl">
                  {part.value}
                </span>
                <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-white/45">
                  {part.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="shortlist-title">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-200">
              {t("decisions.eyebrow")}
            </p>
            <h2 id="shortlist-title" className="mt-3 text-4xl font-black tracking-[-0.05em]">
              {t("decisions.shortlist")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/55">
              {t("decisions.shortlistNote")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => (
              <article
                key={university.name}
                className="rounded-[1.5rem] border border-white/10 bg-black/25 p-6"
              >
                <BookOpen aria-hidden="true" className="h-5 w-5 text-red-300" />
                <h3 className="mt-5 text-2xl font-black tracking-[-0.04em]">
                  {university.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  {t(university.focusKey)}
                </p>
              </article>
            ))}
          </div>

          <Link
            href="/timeline"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            {t("nav.timeline")}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
