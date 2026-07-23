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
            `https://api.github.com/users/${GITHUB_USERNAME}/gists?per_page=100`,
            {
                headers,
                next: { revalidate: 1800, tags: ["github-gists"] },
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { gists: [], error: "github_unavailable" },
                { status: 502, headers: { "Cache-Control": "public, s-maxage=300" } }
            );
        }

        const payload: unknown = await res.json();
        const gists = Array.isArray(payload)
            ? payload.slice(0, 6).map((gist: {
                id: string;
                description: string | null;
                html_url: string;
                updated_at: string;
                files: Record<string, {
                    filename: string;
                    language: string | null;
                }>;
            }) => ({
                id: gist.id,
                description: gist.description,
                html_url: gist.html_url,
                updated_at: gist.updated_at,
                files: gist.files,
            }))
            : [];
        return NextResponse.json(
            { gists },
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
            { gists: [], error: "fetch_failed" },
            { status: 503 }
        );
    }
}
