"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Mail,
  Instagram,
  Linkedin,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import "./styles.css";
import { useI18n } from "../contexts/I18nContext";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <main className="contact-shell min-h-screen overflow-x-hidden text-white">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={t("nav.backHome")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-sm backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <ArrowLeft
              size={20}
              aria-hidden="true"
              className="text-white"
            />
          </Link>

          <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm shadow-sm backdrop-blur-xl">
            <Link
              href="/projects"
              className="rounded-full px-4 py-2 text-neutral-300 transition hover:bg-white hover:text-black"
            >
              {t("nav.projects")}
            </Link>

            <Link
              href="/contact"
              className="rounded-full bg-white px-4 py-2 text-black shadow-sm"
            >
              {t("nav.contact")}
            </Link>
          </nav>
        </header>

        <section className="mx-auto mb-12 max-w-3xl text-center">
          <div className="contact-eyebrow">
            <span className="contact-dot" />
            {t("contact.eyebrow")}
          </div>

          <h1 className="mt-5 text-5xl font-black tracking-[-0.075em] text-white sm:text-7xl md:text-8xl">
            {t("contact.title")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-neutral-300 text-base leading-8 sm:text-lg">
            {t("contact.description")}
          </p>
        </section>

        <section
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          aria-label={t("contact.linksLabel")}
        >
          <ContactCard
            icon={<Github size={32} aria-hidden="true" />}
            title="TheusHen"
            subtitle={t("contact.github") || "GitHub"}
            link="https://github.com/TheusHen"
          />

          <ContactCard
            icon={<Mail size={32} aria-hidden="true" />}
            title="dev@theushen.works"
            subtitle={t("contact.email") || "Email"}
            link="mailto:dev@theushen.works"
            external={false}
          />

          <ContactCard
            icon={<Instagram size={32} aria-hidden="true" />}
            title="@mmatheus_henriquee"
            subtitle={t("contact.instagram") || "Instagram"}
            link="https://www.instagram.com/mmatheus_henriquee"
          />

          <ContactCard
            icon={<Linkedin size={32} aria-hidden="true" />}
            title="Matheus Henrique"
            subtitle={t("contact.linkedin") || "LinkedIn"}
            link="https://www.linkedin.com/in/matheus-henrique-741776367/"
          />

          <WideContactCard
            link="https://www.youtube.com/@TheusHen"
            title={t("contact.youtubeChannel") || "Follow my work"}
            subtitle={
              t("contact.youtubeSubtitle") ||
              "Updates, builds, experiments and technical content from my projects."
            }
            buttonLabel={t("contact.youtubeButton") || "Open channel"}
            label={t("contact.updatesLabel")}
          />
        </section>
      </div>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  subtitle,
  link,
  external = true,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  link: string;
  external?: boolean;
}) {
  return (
    <Link
      href={link}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="white-hover-effect group block h-full rounded-[28px]"
    >
      <article className="contact-card">
        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <div className="flex items-center justify-between">
            <div className="contact-icon">{icon}</div>

            <ArrowUpRight
              size={18}
              className="text-neutral-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="break-words text-xl font-bold tracking-[-0.04em] text-white sm:text-2xl">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-300 sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

function WideContactCard({
  link,
  title,
  subtitle,
  buttonLabel,
  label,
}: {
  link: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  label: string;
}) {
  return (
    <article className="white-hover-effect contact-wide-card sm:col-span-2 xl:col-span-4">
      <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-5">
          <div className="contact-wide-icon">
            <Radio size={28} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <span className="contact-small-label">
              {label}
            </span>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
              {title}
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
              {subtitle}
            </p>

            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block break-all text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              {link}
            </Link>
          </div>
        </div>

        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_18px_50px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-neutral-200"
        >
          {buttonLabel}

          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
