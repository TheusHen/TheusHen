"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/I18nContext";

export function useCountdown(target: Date) {
  const [timer, setTimer] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimer({
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        mins: Math.floor(diff / 60000) % 60,
        secs: Math.floor(diff / 1000) % 60,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  return timer;
}

export default function CollegeTimer({ target }: { target: Date }) {
  const { t } = useI18n();
  const timer = useCountdown(target);
  const cells: Array<[number, string]> = [
    [timer.days, t("time.days")],
    [timer.hours, t("time.hoursShort")],
    [timer.mins, t("time.minutesShort")],
    [timer.secs, t("time.secondsShort")],
  ];
  return (
    <div className="flex gap-4 font-mono text-2xl tracking-wider text-white" role="timer">
      {cells.map(([v, l], i) => (
        <div key={l + i} className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-bold tabular-nums">{String(v).padStart(2, "0")}</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#ff5a5a]">{l}</span>
          </div>
          {i < cells.length - 1 && <span className="text-[#ff2b2b]">:</span>}
        </div>
      ))}
    </div>
  );
}
