"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Filter, Star, ExternalLink, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import "./styles.css";
import { cn } from "@/app/lib/cn";
import { useI18n } from "@/app/contexts/I18nContext";
import BlueprintShell from "@/app/components/blueprint/BlueprintShell";
import GridCell from "@/app/components/blueprint/GridCell";
import DecoderText from "@/app/components/blueprint/DecoderText";
import Reveal from "@/app/components/blueprint/Reveal";
import ProjectsEn from "@/content/projects.en.mdx";
import ProjectsPt from "@/content/projects.pt.mdx";

const fallbackImg = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: { avatar_url: string };
  homepage?: string | null;
  topics?: string[];
}

interface Gist {
  id: string;
  description: string;
  html_url: string;
  updated_at: string;
  files: { [key: string]: { filename: string; language: string | null } };
  owner: { avatar_url: string; login: string };
}

const ProjectsPage = () => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [openSource, setOpenSource] = useState(true);
  const [closeSource, setCloseSource] = useState(true);
  const [website, setWebsite] = useState(true);
  const [application, setApplication] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGists, setLoadingGists] = useState(true);
  const [error, setError] = useState(false);
  const [gistsError, setGistsError] = useState(false);
  const [allTopics, setAllTopics] = useState<string[]>([]);
  const { t, language } = useI18n();
  const Mdx = language === "pt" ? ProjectsPt : ProjectsEn;

  useEffect(() => {
    fetch(`/api/github/repos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.repos)) {
          setRepos(data.repos);
          const topics = new Set<string>();
          data.repos.forEach((repo: Repo) => repo.topics?.forEach((tp) => topics.add(tp)));
          setAllTopics(Array.from(topics).sort());
          setError(false);
        } else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
    fetch(`/api/github/gists`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.gists)) { setGists(data.gists); setGistsError(false); }
        else setGistsError(true);
        setLoadingGists(false);
      })
      .catch(() => { setGistsError(true); setLoadingGists(false); });
  }, []);

  const toggleTopic = (topic: string) =>
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]));

  const showMitpa = openSource && website;
  const showArcadeLunar = closeSource && application;
  const showOptifyx = openSource && application;

  const filteredRepos = repos.filter((repo) =>
    selectedTopics.length === 0 ? true : repo.topics && selectedTopics.some((x) => repo.topics?.includes(x))
  );
  const sortedRepos = [...filteredRepos].sort((a, b) =>
    b.stargazers_count !== a.stargazers_count ? b.stargazers_count - a.stargazers_count : a.name.localeCompare(b.name)
  );

  return (
    <BlueprintShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 pt-24 sm:px-6 sm:py-14">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Back to home" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur transition hover:-translate-x-1 hover:border-[#ff2b2b]/60">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 font-mono text-xs backdrop-blur">
            <Link href="/projects" className="rounded-full bg-white px-4 py-2 font-bold text-black">{t("nav.projects")}</Link>
            <Link href="/contact" className="rounded-full px-4 py-2 text-neutral-300 transition hover:bg-white hover:text-black">{t("nav.contact")}</Link>
          </nav>
        </header>

        <div className="bp-grid">
          <GridCell id="SEC.02 // PROJECTS" index="06" label="featured" span="bp-span-8" reflow="bp-reflow-a">
            <span className="bp-eyebrow"><span className="bp-dot" />live builds — edge cached</span>
            <DecoderText text={t("projects.title")} className="bp-giant mt-5 text-[clamp(2.8rem,8vw,6rem)]" />
            <p className="mt-4 max-w-xl text-base leading-8 text-zinc-300">{t("projects.subtitle")}</p>
            <div className="bp-mdx mt-2 text-[15px]"><Mdx /></div>
          </GridCell>
          <GridCell id="SEC.02 // FILTER" index="07" label="control" span="bp-span-4" reflow="bp-reflow-b">
            <p className="bp-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">{t("projects.allProjects")}</p>
            <p className="mt-2 font-mono text-xs leading-6 text-zinc-600">{t("blueprint.projectsBrowse")}</p>
            <button type="button" onClick={() => setShowFilterMenu((v) => !v)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ff2b2b] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black">
              <Filter size={14} /> {t("projects.filters")}
            </button>
            {selectedTopics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedTopics.map((x) => (
                  <button key={x} onClick={() => toggleTopic(x)} className="rounded-full border border-[#ff2b2b]/50 bg-[#ff2b2b]/10 px-3 py-1 font-mono text-[11px] text-[#ff8a8a]">
                    {x} ×
                  </button>
                ))}
              </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-5 font-mono text-[11px] text-zinc-500">
              <span>repos — <b className="text-white">{repos.length}</b></span>
              <span>gists — <b className="text-white">{gists.length}</b></span>
              <span>topics — <b className="text-white">{allTopics.length}</b></span>
              <span>filter — <b className="text-[#ff5a5a]">{selectedTopics.length || "off"}</b></span>
            </div>
          </GridCell>

          {showMitpa && (
            <GridCell id="FEAT.20T // OSS" index="F.01" label="non-profit club" span="bp-span-6">
              <a href="https://discord.gg/U6GXeNwZ" target="_blank" rel="noreferrer" className="group block">
                <div className="flex items-start justify-between">
                  <Image src="/20t.png" alt="20t Project" width={96} height={96} className="h-20 w-20 rounded-2xl border border-white/10 object-cover" priority />
                  <ArrowUpRight size={18} className="text-zinc-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ff2b2b]" />
                </div>
                <h2 className="font-display mt-5 text-3xl font-bold tracking-tight text-white">20t</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{t("projects.twentyTDescription")}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-[#ff5a5a]">{t("projects.readMore")} <ArrowRight size={13} /></span>
              </a>
            </GridCell>
          )}
          <GridCell id="FEAT.STACK" index="F.02" label="arcade + optifyx" span="bp-span-6">
            <div className="grid grid-cols-1 gap-6">
              {showArcadeLunar && (
                <a href="https://arcadelunar.com.br" target="_blank" rel="noreferrer" className="group flex gap-4">
                  <Image src="https://avatars.githubusercontent.com/u/174283552" alt="Arcade Lunar" width={64} height={64} className="h-16 w-16 shrink-0 rounded-2xl border border-white/10" />
                  <div>
                    <h2 className="font-display text-xl font-bold text-white group-hover:text-[#ff5a5a]">Arcade Lunar</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{t("projects.arcadeDescription")}</p>
                  </div>
                </a>
              )}
              {showOptifyx && (
                <a href="https://github.com/optifyx" target="_blank" rel="noreferrer" className="group flex gap-4 border-t border-white/[0.07] pt-6">
                  <Image src="/optifyx.png" alt="Optifyx" width={96} height={56} className="h-14 w-24 shrink-0 rounded-xl border border-white/10 object-cover" />
                  <div>
                    <h2 className="font-display text-xl font-bold text-white group-hover:text-[#ff5a5a]">Optifyx</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{t("projects.optifyxDescription")}</p>
                  </div>
                </a>
              )}
            </div>
          </GridCell>

          <GridCell id="SEC.02 // GITHUB" index="08" label={`${sortedRepos.length} repos`} span="bp-span-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{t("projects.githubProjects")}</h2>
            {loading ? <p className="mt-4 font-mono text-sm text-zinc-500">{t("projects.loadingRepositories")}</p>
            : error ? <p className="mt-4 text-sm text-red-300">{t("projects.errorRepositories")}</p>
            : (
              <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                {sortedRepos.map((repo, i) => (
                  <Reveal key={repo.id} delay={Math.min(i * 40, 320)} className="bp-hover bg-[#070707] p-5">
                    <div className="flex items-center gap-3">
                      <Image src={repo.owner.avatar_url || fallbackImg} alt={repo.name} width={32} height={32} className="h-8 w-8 rounded-full border border-white/10" />
                      <span className="truncate font-display text-base font-bold text-white">{repo.name}</span>
                      {repo.homepage && (
                        // eslint-disable-next-line @next/next/no-html-link-for-pages
                        <a href={repo.homepage} target="_blank" rel="noreferrer" className="ml-auto text-zinc-500 hover:text-[#ff2b2b]" onClick={(e) => e.stopPropagation()} title={t("projects.projectWebsite")}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p className="mt-3 line-clamp-3 min-h-[3.5rem] text-[13px] leading-6 text-zinc-400">{repo.description || <span className="italic text-zinc-600">{t("projects.noDescription")}</span>}</p>
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {repo.topics.slice(0, 3).map((x) => (
                          <span key={x} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-zinc-300">{x}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                      <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[10px] font-bold text-black">{repo.language ?? t("projects.other")}</span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400"><Star size={11} className="fill-[#ff2b2b] text-[#ff2b2b]" />{repo.stargazers_count}</span>
                    </div>
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="absolute inset-0" aria-label={t("projects.viewOnGithub", { name: repo.name })} />
                  </Reveal>
                ))}
              </div>
            )}
          </GridCell>

          <GridCell id="SEC.02 // GISTS" index="09" label={`${gists.length} gists`} span="bp-span-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{t("projects.githubGists")}</h2>
            {loadingGists ? <p className="mt-4 font-mono text-sm text-zinc-500">{t("projects.loadingGists")}</p>
            : gistsError ? <p className="mt-4 text-sm text-red-300">{t("projects.errorGists")}</p>
            : gists.length === 0 ? <p className="mt-4 font-mono text-sm text-zinc-500">{t("projects.noGists")}</p>
            : (
              <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                {gists.map((gist) => {
                  const firstFile = Object.values(gist.files)[0];
                  return (
                    <a key={gist.id} href={gist.html_url} target="_blank" rel="noreferrer" className="bp-hover group block bg-[#070707] p-5">
                      <div className="flex items-center gap-3">
                        <Image alt={gist.owner.login} className="h-8 w-8 rounded-full border border-white/10" height={32} width={32} src={gist.owner.avatar_url || fallbackImg} />
                        <span className="block truncate font-mono text-[13px] font-bold text-white">{firstFile?.filename || t("projects.untitled")}</span>
                        <ArrowUpRight size={14} className="ml-auto text-zinc-600 transition group-hover:text-[#ff2b2b]" />
                      </div>
                      <p className="mt-3 line-clamp-3 min-h-[3.5rem] text-[13px] leading-6 text-zinc-400">{gist.description || <span className="italic text-zinc-600">{t("projects.noDescription")}</span>}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[11px] text-zinc-500">
                        <span>{firstFile?.language || t("projects.textLanguage")}</span>
                        <span>{new Date(gist.updated_at).toLocaleDateString()}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </GridCell>
        </div>

        {showFilterMenu && (
          <>
            <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setShowFilterMenu(false)} />
            <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h3 className="font-display text-xl font-bold text-white">{t("projects.filterTitle")}</h3>
                <button onClick={() => setShowFilterMenu(false)} className="rounded-full border border-white/10 p-2 text-zinc-400 hover:bg-white hover:text-black" type="button"><X size={16} /></button>
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">{t("projects.featuredType")}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[[openSource, setOpenSource, t("projects.openSource")], [closeSource, setCloseSource, t("projects.closeSource")], [website, setWebsite, t("projects.website")], [application, setApplication, t("projects.application")]].map(([v, set, label], i) => (
                      <label key={i} className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300 hover:border-[#ff2b2b]/40">
                        <input type="checkbox" checked={v as boolean} onChange={(e) => (set as (x: boolean) => void)(e.target.checked)} className="h-4 w-4 accent-[#ff2b2b]" />
                        {label as string}
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-zinc-600">{t("projects.filtersNote")}</p>
                </div>
                {allTopics.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">{t("projects.topics")}</h4>
                      {selectedTopics.length > 0 && <button onClick={() => setSelectedTopics([])} className="font-mono text-[11px] text-zinc-500 hover:text-white" type="button">{t("projects.clear")} ({selectedTopics.length})</button>}
                    </div>
                    <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      {allTopics.map((topic) => (
                        <button key={topic} className={cn("rounded-full border px-3 py-1 font-mono text-[11px] transition", selectedTopics.includes(topic) ? "border-[#ff2b2b] bg-[#ff2b2b] text-white" : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white")} onClick={() => toggleTopic(topic)} type="button">{topic}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 p-6">
                <button onClick={() => { setOpenSource(true); setCloseSource(true); setWebsite(true); setApplication(true); setSelectedTopics([]); }} className="text-sm text-zinc-500 hover:text-white" type="button">{t("projects.clearAll")}</button>
                <button className="rounded-full bg-[#ff2b2b] px-5 py-2 text-sm font-bold text-white hover:bg-white hover:text-black" onClick={() => setShowFilterMenu(false)} type="button">{t("projects.applyFilters")}</button>
              </div>
            </div>
          </>
        )}
      </main>
    </BlueprintShell>
  );
};

export default ProjectsPage;
