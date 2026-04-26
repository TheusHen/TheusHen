import { NextResponse } from "next/server";

const REPO_OWNER = "TheusHen";
const REPO_NAME = "TheusHen";

// Revalidate every hour. The route is cached at the edge so we never hit
// the unauthenticated 60 req/h GitHub limit from the browser.
export const revalidate = 3600;

export async function GET() {
    try {
        const headers: Record<string, string> = {
            Accept: "application/vnd.github+json",
        };

        // Optional auth token to avoid rate limits in production.
        if (process.env.GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
            {
                headers,
                next: { revalidate: 3600, tags: ["github-stars"] },
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { stars: null, error: "github_unavailable" },
                { status: 200, headers: { "Cache-Control": "public, s-maxage=300" } }
            );
        }

        const data = await res.json();
        return NextResponse.json(
            { stars: data.stargazers_count ?? null },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "public, s-maxage=3600, stale-while-revalidate=86400",
                },
            }
        );
    } catch {
        return NextResponse.json(
            { stars: null, error: "fetch_failed" },
            { status: 200 }
        );
    }
}
