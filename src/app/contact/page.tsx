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
import { ReactNode, useEffect } from "react";
import "./styles.css";
import { useI18n } from "../contexts/I18nContext";

export default function ContactPage() {
  const { t } = useI18n();

  useEffect(() => {
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
        document.documentElement.style.setProperty("--my", `${e.clientY}px`);

        document
          .querySelectorAll<HTMLElement>(".white-hover-effect")
          .forEach((card) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty("--mouse-x", `${x}%`);
            card.style.setProperty("--mouse-y", `${y}%`);
          });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="contact-shell min-h-screen overflow-x-hidden text-neutral-950">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={t("nav.back") || "Back to home"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white/75 shadow-sm backdrop-blur-xl transition hover:-translate-x-1 hover:border-neutral-300 hover:bg-white"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>

          <nav className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 p-1 text-sm shadow-sm backdrop-blur-xl">
            <Link
              href="/projects"
              className="rounded-full px-4 py-2 text-neutral-600 transition hover:bg-neutral-950 hover:text-white"
            >
              {t("nav.projects")}
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-neutral-950 px-4 py-2 text-white shadow-sm"
            >
              {t("nav.contact")}
            </Link>
          </nav>
        </header>

        <section className="mx-auto mb-12 max-w-3xl text-center">
          <div className="contact-eyebrow">
            <span className="contact-dot" />
            Available for projects, collaborations and open-source work
          </div>

          <h1 className="mt-5 text-5xl font-black tracking-[-0.075em] text-neutral-950 sm:text-7xl md:text-8xl">
            Contact
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
            Get in touch for software projects, open-source collaborations,
            aerospace technology ideas, or anything related to building useful
            things on the internet.
          </p>
        </section>

        <section
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Contact links"
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
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="white-hover-effect group block h-full rounded-[28px]"
    >
      <article className="contact-card">
        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <div className="flex items-center justify-between">
            <div className="contact-icon">{icon}</div>
            <ArrowUpRight
              size={18}
              className="text-neutral-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="break-words text-xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-2xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500 sm:text-base">
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
}: {
  link: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
}) {
  return (
    <article className="white-hover-effect contact-wide-card sm:col-span-2 xl:col-span-4">
      <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-5">
          <div className="contact-wide-icon">
            <Radio size={28} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <span className="contact-small-label">Content & updates</span>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-neutral-950 sm:text-4xl">
              {title}
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              {subtitle}
            </p>

            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block break-all text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
            >
              {link}
            </Link>
          </div>
        </div>

        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-950 bg-neutral-950 px-6 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950"
        >
          {buttonLabel}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
