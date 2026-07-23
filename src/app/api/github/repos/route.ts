import { NextResponse } from "next/server";
import { CURATED_REPOSITORIES } from "@/lib/site";

const GITHUB_USERNAME = "TheusHen";

export const revalidate = 3600;

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  topics?: string[];
  updated_at: string;
};

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`,
      {
        headers,
        next: { revalidate: 3600, tags: ["github-repos"] },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { repos: [], error: "github_unavailable" },
        {
          status: 502,
          headers: { "Cache-Control": "public, s-maxage=300" },
        }
      );
    }

    const payload: unknown = await response.json();
    const repositories = Array.isArray(payload)
      ? (payload as GitHubRepo[])
          .filter((repo) => !repo.fork && !repo.archived)
          .filter((repo) =>
            CURATED_REPOSITORIES.includes(
              repo.name as (typeof CURATED_REPOSITORIES)[number]
            )
          )
          .sort(
            (a, b) =>
              CURATED_REPOSITORIES.indexOf(
                a.name as (typeof CURATED_REPOSITORIES)[number]
              ) -
              CURATED_REPOSITORIES.indexOf(
                b.name as (typeof CURATED_REPOSITORIES)[number]
              )
          )
          .map((repo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count,
            language: repo.language,
            homepage: repo.homepage,
            topics: repo.topics ?? [],
            updated_at: repo.updated_at,
          }))
      : [];

    return NextResponse.json(
      { repos: repositories },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { repos: [], error: "fetch_failed" },
      { status: 503 }
    );
  }
}
