import { NextResponse } from "next/server";

const GITHUB_USERNAME = "TheusHen";

export const revalidate = 1800; // 30 minutes

export async function GET() {
    try {
        const headers: Record<string, string> = {
            Accept: "application/vnd.github+json",
        };

        if (process.env.GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const res = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
            {
                headers,
                next: { revalidate: 1800, tags: ["github-repos"] },
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { repos: [], error: "github_unavailable" },
                { status: 200, headers: { "Cache-Control": "public, s-maxage=300" } }
            );
        }

        const repos = await res.json();
        return NextResponse.json(
            { repos: Array.isArray(repos) ? repos : [] },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "public, s-maxage=1800, stale-while-revalidate=86400",
                },
            }
        );
    } catch {
        return NextResponse.json(
            { repos: [], error: "fetch_failed" },
            { status: 200 }
        );
    }
}
