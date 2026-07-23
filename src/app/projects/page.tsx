"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CircuitBoard,
  Cpu,
  ExternalLink,
  Github,
  Search,
  Star,
  Waves,
} from "lucide-react";
import { useI18n } from "@/app/contexts/I18nContext";
import { FEATURED_REPOSITORIES } from "@/lib/site";
import "./styles.css";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  homepage: string | null;
  topics: string[];
  updated_at: string;
};

type Gist = {
  id: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  files: Record<
    string,
    {
      filename: string;
      language: string | null;
    }
  >;
};

const featured = [
  {
    name: "EEGFrontier",
    href: "https://github.com/TheusHen/EEGFrontier",
    descriptionKey: "projects.eegDescription",
    icon: CircuitBoard,
    accent: "emerald",
  },
  {
    name: "Nautilus AquaVision",
    href: "https://github.com/TheusHen/Nautilus-AquaVision-v0",
    descriptionKey: "projects.aquaDescription",
    icon: Waves,
    accent: "cyan",
  },
  {
    name: "Ternary Ibex",
    href: "https://github.com/TheusHen/ternary-ibex",
    descriptionKey: "projects.ternaryDescription",
    icon: Cpu,
    accent: "red",
  },
] as const;

export default function ProjectsPage() {
  const { language, t } = useI18n();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [gists, setGists] = useState<Gist[]>([]);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const [reposResponse, gistsResponse] = await Promise.all([
          fetch("/api/github/repos", { signal: controller.signal }),
          fetch("/api/github/gists", { signal: controller.signal }),
        ]);

        if (!reposResponse.ok) throw new Error("Repositories unavailable");
        const reposData: { repos?: Repo[] } = await reposResponse.json();
        setRepos(Array.isArray(reposData.repos) ? reposData.repos : []);

        if (gistsResponse.ok) {
          const gistsData: { gists?: Gist[] } = await gistsResponse.json();
          setGists(Array.isArray(gistsData.gists) ? gistsData.gists : []);
        }
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

  const topics = useMemo(
    () =>
      Array.from(new Set(repos.flatMap((repo) => repo.topics))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [repos]
  );

  const visibleRepos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return repos
      .filter(
        (repo) =>
          !FEATURED_REPOSITORIES.includes(
            repo.name as (typeof FEATURED_REPOSITORIES)[number]
          )
      )
      .filter((repo) => !topic || repo.topics.includes(topic))
      .filter((repo) => {
        if (!normalizedQuery) return true;
        return [repo.name, repo.description ?? "", repo.language ?? "", ...repo.topics]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      });
  }, [query, repos, topic]);

  return (
    <main className="projects-shell min-h-screen text-white">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-24 sm:px-8">
        <header className="mb-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={t("nav.backHome")}
            className="control-button"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </Link>

          <nav aria-label={t("projects.sectionNavigation")} className="section-nav">
            <Link href="/projects" aria-current="page" className="active">
              {t("nav.projects")}
            </Link>
            <Link href="/contact">{t("nav.contact")}</Link>
          </nav>
        </header>

        <section className="mx-auto mb-14 max-w-3xl text-center">
          <p className="projects-eyebrow">{t("projects.eyebrow")}</p>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.075em] sm:text-7xl md:text-8xl">
            {t("projects.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            {t("projects.subtitle")}
          </p>
        </section>

        <section
          aria-labelledby="featured-projects"
          className="grid gap-5 md:grid-cols-3"
        >
          <h2 id="featured-projects" className="sr-only">
            {t("projects.featuredLabel")}
          </h2>
          {featured.map((project) => {
            const Icon = project.icon;
            return (
              <Link
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className={`projects-feature-card accent-${project.accent}`}
              >
                <div className="flex items-center justify-between">
                  <span className="project-icon">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/40" />
                </div>
                <h3 className="mt-7 text-2xl font-black tracking-[-0.045em]">
                  {project.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {t(project.descriptionKey)}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-16" aria-labelledby="repository-title">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="repository-title" className="text-3xl font-black tracking-[-0.05em]">
                {t("projects.githubProjects")}
              </h2>
              <p className="mt-2 text-sm text-white/50">
                {t("projects.browseSubtitle")}
              </p>
            </div>
            <Link
              href="https://github.com/TheusHen?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <Github aria-hidden="true" className="h-4 w-4" />
              {t("projects.viewAllGithub")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_220px]">
            <label className="filter-field">
              <span className="sr-only">{t("projects.searchLabel")}</span>
              <Search aria-hidden="true" className="h-4 w-4 text-white/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("projects.searchPlaceholder")}
              />
            </label>
            <label className="filter-field">
              <span className="sr-only">{t("projects.topics")}</span>
              <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                <option value="">{t("projects.allTopics")}</option>
                {topics.map((currentTopic) => (
                  <option key={currentTopic} value={currentTopic}>
                    {currentTopic}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <p className="status-text">{t("projects.loadingRepositories")}</p>
          ) : error ? (
            <p className="status-text text-red-300">{t("projects.errorRepositories")}</p>
          ) : visibleRepos.length === 0 ? (
            <p className="status-text">{t("projects.noResults")}</p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleRepos.map((repo) => (
                <article key={repo.id} className="projects-list-card">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 truncate text-lg font-bold tracking-[-0.035em]">
                      {repo.name}
                    </h3>
                    {repo.homepage && (
                      <Link
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${t("projects.projectWebsite")}: ${repo.name}`}
                        className="card-icon-link"
                      >
                        <ExternalLink aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    )}
                  </div>

                  <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-white/60">
                    {repo.description || t("projects.noDescription")}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {repo.topics.slice(0, 3).map((repoTopic) => (
                      <span key={repoTopic} className="projects-chip">
                        {repoTopic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs text-white/45">
                    <span>{repo.language ?? t("projects.other")}</span>
                    <span className="inline-flex items-center gap-1">
                      <Star aria-hidden="true" className="h-3.5 w-3.5" />
                      {repo.stargazers_count}
                    </span>
                  </div>

                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t("projects.viewOnGithub", { name: repo.name })}
                    className="absolute inset-0 rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                  />
                </article>
              ))}
            </div>
          )}
        </section>

        {gists.length > 0 && (
          <section className="mt-16" aria-labelledby="gists-title">
            <h2 id="gists-title" className="text-3xl font-black tracking-[-0.05em]">
              {t("projects.githubGists")}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gists.map((gist) => {
                const firstFile = Object.values(gist.files)[0];
                return (
                  <Link
                    key={gist.id}
                    href={gist.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="projects-list-card block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="truncate font-bold">
                        {firstFile?.filename || t("projects.untitled")}
                      </h3>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-white/40" />
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/60">
                      {gist.description || t("projects.noDescription")}
                    </p>
                    <p className="mt-5 text-xs text-white/40">
                      {new Intl.DateTimeFormat(
                        language === "pt" ? "pt-BR" : "en-US",
                        { dateStyle: "medium" }
                      ).format(new Date(gist.updated_at))}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
