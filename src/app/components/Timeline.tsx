"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, ExternalLink } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

const GITHUB_OWNER = "TheusHen";
const GITHUB_REPO = "TheusHen";
const GITHUB_BRANCH = "main";
const TIMELINE_FOLDER = "line";

type TimelineItem = {
  id: string;
  dateISO: string;
  timeHHMM: string;
  title: string;
  githubUrl: string;
};

type ApiItem = {
  id: string;
  dateISO: string;
  timeHHMM: string;
  title: string;
  linkOverride: string | null;
};

function buildGithubUrl(fileName: string) {
  const encodedPath = `${TIMELINE_FOLDER}/${fileName}`
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${encodedPath}`;
}

export default function Timeline() {
  const { language, t } = useI18n();
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch("/api/timeline", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Timeline unavailable");
        const data: { items?: ApiItem[] } = await response.json();
        setItems(
          (data.items ?? []).map((item) => ({
            id: item.id,
            dateISO: item.dateISO,
            timeHHMM: item.timeHHMM,
            title: item.title,
            githubUrl: item.linkOverride ?? buildGithubUrl(item.id),
          }))
        );
        setError(false);
      } catch (caughtError) {
        if (!(caughtError instanceof DOMException && caughtError.name === "AbortError")) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto w-full max-w-4xl px-5 pb-20 pt-32 sm:px-8">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-5xl font-black tracking-[-0.06em] text-white sm:text-7xl">
          {t("timeline.title")}
        </h1>
        <p className="mt-5 text-base leading-8 text-white/60">
          {t("timeline.subtitle")}
        </p>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/60">
          {t("timeline.loading")}
        </p>
      ) : error ? (
        <p className="rounded-2xl border border-red-300/20 bg-red-950/20 p-5 text-red-200">
          {t("timeline.error")}
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/60">
          {t("timeline.emptyState", { folder: TIMELINE_FOLDER })}
        </p>
      ) : (
        <ol className="relative space-y-7 before:absolute before:bottom-6 before:left-[0.45rem] before:top-6 before:w-px before:bg-gradient-to-b before:from-red-300/60 before:via-white/20 before:to-transparent">
          {items.map((item) => {
            const formattedDate = new Intl.DateTimeFormat(
              language === "pt" ? "pt-BR" : "en-US",
              { dateStyle: "medium", timeZone: "UTC" }
            ).format(new Date(`${item.dateISO}T12:00:00Z`));

            return (
              <li key={item.id} className="relative pl-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-8 h-4 w-4 rounded-full border-4 border-[#080808] bg-red-300 shadow-[0_0_0_4px_rgba(252,165,165,0.12)]"
                />
                <Link
                  href={item.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-[1.5rem] border border-white/10 bg-black/30 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2 text-xs text-white/50">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                          {formattedDate}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                          <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                          {item.timeHHMM}
                        </span>
                      </div>
                      <h2 className="mt-5 break-words text-2xl font-bold tracking-[-0.035em] text-white">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-white/50">
                        {t("timeline.cardHint")}
                      </p>
                    </div>
                    <ExternalLink
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-white/35 transition group-hover:text-white"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
