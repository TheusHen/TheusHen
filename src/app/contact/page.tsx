"use client";

import { ArrowLeft, ArrowUpRight, Github, Mail, Instagram, Linkedin, Radio } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import "./styles.css";
import { useI18n } from "../contexts/I18nContext";
import BlueprintShell from "../components/blueprint/BlueprintShell";
import GridCell from "../components/blueprint/GridCell";
import DecoderText from "../components/blueprint/DecoderText";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <BlueprintShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 pt-24 sm:px-6 sm:py-14">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Back to home" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur transition hover:-translate-x-1 hover:border-[#ff2b2b]/60">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 font-mono text-xs backdrop-blur">
            <Link href="/projects" className="rounded-full px-4 py-2 text-neutral-300 transition hover:bg-white hover:text-black">{t("nav.projects")}</Link>
            <Link href="/contact" className="rounded-full bg-white px-4 py-2 font-bold text-black">{t("nav.contact")}</Link>
          </nav>
        </header>

        <div className="bp-grid">
          <GridCell id="SEC.04 // CONTACT" index="13" label="open channel" span="bp-span-8">
            <span className="bp-eyebrow"><span className="bp-dot" />available — collab / oss / aero</span>
            <DecoderText text="Contact" className="bp-giant mt-5 text-[clamp(2.8rem,8vw,6rem)]" />
            <p className="mt-4 max-w-xl text-base leading-8 text-zinc-300">
              {t("blueprint.contactIntro")}
            </p>
            <p className="mt-4 font-mono text-xs leading-6 text-zinc-600">
              <span className="text-zinc-300">$</span> {t("blueprint.contactMetaMail")}<br />
              <span className="text-zinc-300">$</span> {t("blueprint.contactMetaResponse")}<br />
              <span className="text-zinc-300">$</span> {t("blueprint.contactMetaSignal")} <span className="text-[#ff5a5a]">{t("blueprint.contactOpen")}</span>
            </p>
          </GridCell>
          <GridCell id="SEC.04 // YOUTUBE" index="14" label="broadcast" span="bp-span-4">
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 text-[#ff2b2b]"><Radio size={22} /></span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">content & updates</span>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white">{t("contact.youtubeChannel")}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{t("contact.youtubeSubtitle")}</p>
                <Link href="https://www.youtube.com/@TheusHen" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ff2b2b] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black">
                  {t("contact.youtubeButton")} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </GridCell>

          <GridCell id="C.GITHUB" index="C.01" label={t("contact.github")} span="bp-span-3">
            <ContactLine icon={<Github size={22} />} title="TheusHen" subtitle={t("contact.github")} link="https://github.com/TheusHen" />
          </GridCell>
          <GridCell id="C.EMAIL" index="C.02" label={t("contact.email")} span="bp-span-3">
            <ContactLine icon={<Mail size={22} />} title="dev@theushen.works" subtitle={t("contact.email")} link="mailto:dev@theushen.works" />
          </GridCell>
          <GridCell id="C.INSTA" index="C.03" label={t("contact.instagram")} span="bp-span-3">
            <ContactLine icon={<Instagram size={22} />} title="@mmatheus_henriquee" subtitle={t("contact.instagram")} link="https://www.instagram.com/mmatheus_henriquee" />
          </GridCell>
          <GridCell id="C.LINKEDIN" index="C.04" label={t("contact.linkedin")} span="bp-span-3">
            <ContactLine icon={<Linkedin size={22} />} title="Matheus Henrique" subtitle={t("contact.linkedin")} link="https://www.linkedin.com/in/matheus-henrique-741776367/" />
          </GridCell>
        </div>
      </main>
    </BlueprintShell>
  );
}

function ContactLine({ icon, title, subtitle, link }: { icon: ReactNode; title: string; subtitle: string; link: string }) {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col justify-between gap-8">
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 text-white transition group-hover:border-[#ff2b2b]/60 group-hover:text-[#ff5a5a]">{icon}</span>
        <ArrowUpRight size={16} className="text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ff2b2b]" />
      </div>
      <div>
        <h2 className="break-words font-display text-lg font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">{subtitle}</p>
      </div>
    </Link>
  );
}
