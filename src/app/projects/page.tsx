"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  Star,
  ExternalLink,
  X,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import "./styles.css";

import { cn } from "@/app/lib/cn";
import { useI18n } from "@/app/contexts/I18nContext";

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-white/20" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

const fallbackImg =
  "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: { avatar_url: string };
  fork: boolean;
  homepage?: string | null;
  topics?: string[];
}

interface Gist {
  id: string;
  description: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  files: {
    [key: string]: {
      filename: string;
      language: string | null;
      size: number;
    };
  };
  owner: {
    avatar_url: string;
    login: string;
  };
  public: boolean;
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

  const [topicsPage, setTopicsPage] = useState(0);
  const TOPICS_PER_PAGE = 10;

  const { t } = useI18n();
  const gridRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setLoading(true);

    fetch(`/api/github/repos`)
      .then((res) => res.json())
      .then((data) => {
        const repos = data?.repos;

        if (Array.isArray(repos)) {
          setRepos(repos);

          const topics = new Set<string>();

          repos.forEach((repo: Repo) => {
            repo.topics?.forEach((topic) => topics.add(topic));
          });

          setAllTopics(Array.from(topics).sort());
          setError(false);
        } else {
          setError(true);
        }

        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    setLoadingGists(true);

    fetch(`/api/github/gists`)
      .then((res) => res.json())
      .then((data) => {
        const gists = data?.gists;

        if (Array.isArray(gists)) {
          setGists(gists);
          setGistsError(false);
        } else {
          setGistsError(true);
        }

        setLoadingGists(false);
      })
      .catch(() => {
        setGistsError(true);
        setLoadingGists(false);
      });
  }, []);

  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  const applyFilters = () => {
    toggleFilterMenu();
  };

  const clearAllFilters = () => {
    setOpenSource(true);
    setCloseSource(true);
    setWebsite(true);
    setApplication(true);
    setSelectedTopics([]);
    setTopicsPage(0);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((currentTopic) => currentTopic !== topic)
        : [...prev, topic]
    );
  };

  const showMitpa = openSource && website;
  const showArcadeLunar = closeSource && application;
  const showOptifyx = openSource && application;

  const filteredRepos = repos.filter((repo) => {
    if (selectedTopics.length === 0) return true;

    return (
      repo.topics &&
      selectedTopics.some((topic) => repo.topics?.includes(topic))
    );
  });

  const sortedRepos = [...filteredRepos].sort((a, b) =>
    b.stargazers_count !== a.stargazers_count
      ? b.stargazers_count - a.stargazers_count
      : a.name.localeCompare(b.name)
  );

  const totalTopicsPages = Math.ceil(allTopics.length / TOPICS_PER_PAGE);

  const pagedTopics = allTopics.slice(
    topicsPage * TOPICS_PER_PAGE,
    (topicsPage + 1) * TOPICS_PER_PAGE
  );

  const goPrevTopics = () => {
    setTopicsPage((prev) => Math.max(0, prev - 1));
  };

  const goNextTopics = () => {
    setTopicsPage((prev) => Math.min(totalTopicsPages - 1, prev + 1));
  };

  useEffect(() => {
    if (topicsPage > totalTopicsPages - 1) {
      setTopicsPage(0);
    }
  }, [allTopics.length, topicsPage, totalTopicsPages]);

  return (
    <main className="projects-shell min-h-screen overflow-x-hidden text-white">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={t("nav.back") || "Back to home"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-sm backdrop-blur-xl transition hover:-translate-x-1 hover:border-white/20 hover:bg-white/10"
          >
            <ArrowLeft size={20} aria-hidden="true" className="text-white" />
          </Link>

          <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm shadow-sm backdrop-blur-xl">
            <Link
              href="/projects"
              className="rounded-full bg-white px-4 py-2 text-black shadow-sm"
            >
              {t("nav.projects")}
            </Link>

            <Link
              href="/contact"
              className="rounded-full px-4 py-2 text-neutral-300 transition hover:bg-white hover:text-black"
            >
              {t("nav.contact")}
            </Link>
          </nav>
        </header>

        <section className="mx-auto mb-12 max-w-3xl text-center">
          <div className="projects-eyebrow">
            <span className="projects-dot" />
            Featured builds, repositories and experiments
          </div>

          <h1 className="mt-5 text-5xl font-black tracking-[-0.075em] text-white sm:text-7xl md:text-8xl">
            {t("projects.title")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg">
            {t("projects.subtitle")}
          </p>
        </section>

        <section className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-lg font-semibold text-white">
              {t("projects.allProjects")}
            </span>
            <p className="mt-1 text-sm text-neutral-400">
              Browse selected projects, GitHub repositories and public gists.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-neutral-200 shadow-sm backdrop-blur-xl transition hover:border-white/20 hover:bg-white hover:text-black"
            onClick={toggleFilterMenu}
          >
            <Filter size={16} />
            <span>{t("projects.filters")}</span>
          </button>
        </section>

        {showFilterMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={toggleFilterMenu}
            />

            <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2">
              <div className="projects-modal">
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                  <h3 className="text-xl font-bold tracking-[-0.04em] text-white">
                    {t("projects.filterTitle")}
                  </h3>

                  <button
                    onClick={toggleFilterMenu}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition hover:bg-white hover:text-black"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-neutral-300">
                      {t("projects.featuredType")}
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <FilterCheckbox
                        checked={openSource}
                        onChange={setOpenSource}
                        label={t("projects.openSource")}
                      />
                      <FilterCheckbox
                        checked={closeSource}
                        onChange={setCloseSource}
                        label={t("projects.closeSource")}
                      />
                      <FilterCheckbox
                        checked={website}
                        onChange={setWebsite}
                        label={t("projects.website")}
                      />
                      <FilterCheckbox
                        checked={application}
                        onChange={setApplication}
                        label={t("projects.application")}
                      />
                    </div>

                    <p className="mt-2 text-xs text-neutral-500">
                      {t("projects.filtersNote")}
                    </p>
                  </div>

                  {allTopics.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-neutral-300">
                          {t("projects.topics")}
                        </h4>

                        {selectedTopics.length > 0 && (
                          <button
                            onClick={() => setSelectedTopics([])}
                            className="text-xs text-neutral-400 transition hover:text-white"
                            type="button"
                          >
                            {t("projects.clear")} ({selectedTopics.length})
                          </button>
                        )}
                      </div>

                      <div className="mb-3 flex items-center gap-2">
                        <button
                          className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={goPrevTopics}
                          disabled={topicsPage === 0}
                          aria-label={t("projects.previousTopics")}
                          type="button"
                        >
                          <ArrowLeft size={16} />
                        </button>

                        <span className="text-xs text-neutral-400">
                          {topicsPage + 1} / {totalTopicsPages}
                        </span>

                        <button
                          className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={goNextTopics}
                          disabled={topicsPage >= totalTopicsPages - 1}
                          aria-label={t("projects.nextTopics")}
                          type="button"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      <ScrollArea className="max-h-48 rounded-2xl border border-white/10 bg-white/[0.03]">
                        <div className="flex flex-wrap gap-2 p-3">
                          {pagedTopics.map((topic) => (
                            <button
                              key={topic}
                              className={cn(
                                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                                selectedTopics.includes(topic)
                                  ? "border-white bg-white text-black"
                                  : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                              )}
                              onClick={() => toggleTopic(topic)}
                              type="button"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 p-6">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-neutral-400 transition hover:text-white"
                    type="button"
                  >
                    {t("projects.clearAll")}
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={toggleFilterMenu}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-300 transition hover:text-white"
                      type="button"
                    >
                      {t("projects.cancel")}
                    </button>

                    <button
                      className="rounded-full border border-white/15 bg-white px-5 py-2 text-sm font-bold text-black shadow-[0_18px_50px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-neutral-200"
                      onClick={applyFilters}
                      type="button"
                    >
                      {t("projects.applyFilters")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {showMitpa && (
            <ProjectCard href="https://discord.gg/U6GXeNwZ" large>
              <div className="flex items-start justify-between gap-4">
                <Image
                  src="/20t.png"
                  alt="20t Project"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-2xl object-cover"
                  priority
                />

                <ArrowUpRight className="text-neutral-400" size={18} />
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-[-0.055em] text-white">
                20t
              </h2>

              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {t("projects.twentyTDescription")}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-200">
                <span>{t("projects.readMore")}</span>
                <ArrowRight size={14} />
              </div>
            </ProjectCard>
          )}

          <div className="flex flex-col gap-6">
            {showArcadeLunar && (
              <ProjectCard href="https://arcadelunar.com.br">
                <Image
                  src="https://avatars.githubusercontent.com/u/174283552"
                  alt="Arcade Lunar"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-2xl"
                />

                <h2 className="mt-5 text-2xl font-black tracking-[-0.05em] text-white">
                  Arcade Lunar
                </h2>

                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {t("projects.arcadeDescription")}
                </p>
              </ProjectCard>
            )}

            {showOptifyx && (
              <ProjectCard href="https://github.com/optifyx">
                <Image
                  src="/optifyx.png"
                  alt="Optifyx"
                  width={144}
                  height={88}
                  className="h-22 mb-1 w-36 rounded-2xl object-cover"
                />

                <h2 className="mt-5 text-2xl font-black tracking-[-0.05em] text-white">
                  Optifyx
                </h2>

                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {t("projects.optifyxDescription")}
                </p>
              </ProjectCard>
            )}
          </div>
        </section>

        <SectionTitle>{t("projects.githubProjects")}</SectionTitle>

        {loading ? (
          <StatusText>{t("projects.loadingRepositories")}</StatusText>
        ) : error ? (
          <ErrorText>{t("projects.errorRepositories")}</ErrorText>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sortedRepos.map((repo) => (
              <article
                key={repo.id}
                className="white-hover-effect projects-list-card group"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex items-center gap-3">
                    <Image
                      src={repo.owner.avatar_url || fallbackImg}
                      alt={repo.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                      }}
                    />

                    <span className="truncate text-lg font-bold tracking-[-0.04em] text-white">
                      {repo.name}
                    </span>

                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="relative z-20 ml-auto text-neutral-400 transition hover:text-white"
                        title={t("projects.projectWebsite")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <p className="mb-4 flex-1 text-sm leading-7 text-neutral-300">
                    {repo.description || (
                      <span className="italic text-neutral-500">
                        {t("projects.noDescription")}
                      </span>
                    )}
                  </p>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="projects-chip">
                          {topic}
                        </span>
                      ))}

                      {repo.topics.length > 3 && (
                        <span className="projects-chip-muted">
                          +{repo.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto flex items-end justify-between">
                    <span className="projects-language">
                      {repo.language ?? t("projects.other")}
                    </span>

                    <span className="flex items-center text-xs font-bold text-neutral-300">
                      <Star className="mr-1" size={12} />
                      {repo.stargazers_count}
                    </span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 z-10"
                    aria-label={t("projects.viewOnGithub", {
                      name: repo.name,
                    })}
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        <SectionTitle className="mt-16">{t("projects.githubGists")}</SectionTitle>

        {loadingGists ? (
          <StatusText>{t("projects.loadingGists")}</StatusText>
        ) : gistsError ? (
          <ErrorText>{t("projects.errorGists")}</ErrorText>
        ) : gists.length === 0 ? (
          <StatusText>{t("projects.noGists")}</StatusText>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gists.map((gist) => {
              const firstFile = Object.values(gist.files)[0];
              const fileCount = Object.keys(gist.files).length;
              const mainLanguage =
                firstFile?.language || t("projects.textLanguage");
              const fileLabel =
                fileCount - 1 === 1
                  ? t("projects.fileSingular")
                  : t("projects.filePlural");

              return (
                <a
                  key={gist.id}
                  href={gist.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="white-hover-effect projects-list-card group block"
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-4 flex items-center gap-3">
                      <Image
                        alt={gist.owner.login}
                        className="h-10 w-10 rounded-full"
                        height={40}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackImg;
                        }}
                        src={gist.owner.avatar_url || fallbackImg}
                        width={40}
                      />

                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-white">
                          {firstFile?.filename || t("projects.untitled")}
                        </span>

                        {fileCount > 1 && (
                          <span className="text-xs text-neutral-400">
                            {t("projects.moreFiles", {
                              count: fileCount - 1,
                              fileLabel,
                            })}
                          </span>
                        )}
                      </div>

                      <ArrowUpRight
                        size={16}
                        className="text-neutral-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      />
                    </div>

                    <p className="mb-4 line-clamp-3 flex-1 text-sm leading-7 text-neutral-300">
                      {gist.description || (
                        <span className="italic text-neutral-500">
                          {t("projects.noDescription")}
                        </span>
                      )}
                    </p>

                    <div className="flex items-end justify-between">
                      <span className="projects-language">{mainLanguage}</span>

                      <span className="text-xs text-neutral-400">
                        {new Date(gist.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

function FilterCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.06]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-black text-white accent-white"
      />
      <span className="text-sm text-neutral-300">{label}</span>
    </label>
  );
}

function ProjectCard({
  href,
  children,
  large,
}: {
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "white-hover-effect projects-feature-card group block",
        large && "min-h-full"
      )}
    >
      <div className="relative z-10">{children}</div>
    </a>
  );
}

function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-6 mt-10 text-3xl font-black tracking-[-0.055em] text-white",
        className
      )}
    >
      {children}
    </h2>
  );
}

function StatusText({ children }: { children: React.ReactNode }) {
  return <div className="text-neutral-400">{children}</div>;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <div className="text-red-300">{children}</div>;
}

export default ProjectsPage;
