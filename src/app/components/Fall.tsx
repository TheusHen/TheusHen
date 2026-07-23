"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Fall() {
  const { t } = useI18n();

  return (
    <footer className="mt-20 border-t border-white/10 py-10">
      <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-semibold text-white">TheusHen</p>
          <p className="mt-1 text-sm text-white/50">
            {t("footer.description")}
          </p>
        </div>

        <nav aria-label={t("footer.navigation")}>
          <ul className="flex flex-wrap items-center justify-center gap-1 text-sm">
            <li>
              <Link className="footer-link" href="/projects">
                {t("nav.projects")}
              </Link>
            </li>
            <li>
              <Link className="footer-link" href="/timeline">
                {t("nav.timeline")}
              </Link>
            </li>
            <li>
              <Link className="footer-link" href="/contact">
                {t("nav.contact")}
              </Link>
            </li>
            <li>
              <Link className="footer-link" href="/donate">
                {t("nav.donate")}
              </Link>
            </li>
          </ul>
        </nav>

        <Link
          href="https://github.com/TheusHen/TheusHen"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <Github aria-hidden="true" className="h-4 w-4" />
          {t("footer.source")}
        </Link>
      </div>
    </footer>
  );
}
