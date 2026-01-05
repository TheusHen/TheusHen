import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const TIMELINE_DIR = path.join(process.cwd(), "line");

const TIME_LINE_REGEX = /^time:\s*(([01]\d|2[0-3]):[0-5]\d)\s*$/im;
const LINK_LINE_REGEX = /^link:\s*(https?:\/\/\S+)\s*$/im;

function parseFirstHeading(md: string) {
    const normalized = md.replace(/^\uFEFF/, "");
    const lines = normalized.split("\n");

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const m = trimmed.match(/^#\s*(.+)$/);
        if (m?.[1]) return m[1].trim();
    }
    return "Untitled";
}

function parseTime(md: string) {
    const m = md.match(TIME_LINE_REGEX);
    return m?.[1] ?? "00:00";
}

function parseLinkOverride(md: string) {
    const m = md.match(LINK_LINE_REGEX);
    return m?.[1] ?? null;
}

function dateToOrderKey(dateISO: string, timeHHMM: string) {
    const [y, m, d] = dateISO.split("-").map(Number);
    const [hh, mm] = timeHHMM.split(":").map(Number);
    const t = new Date(y || 0, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0).getTime();
    return Number.isFinite(t) ? t : 0;
}

type ApiTimelineItem = {
    id: string; // filename, ex: "2026-01-05.md"
    dateISO: string; // "2026-01-05"
    timeHHMM: string; // "18:40" or "00:00"
    title: string;
    linkOverride: string | null;
    orderKey: number;
};

export async function GET() {
    try {
        const dirEntries = await fs.readdir(TIMELINE_DIR);
        const mdFiles = dirEntries
            .filter((f) => f.toLowerCase().endsWith(".md"))
            .sort((a, b) => a.localeCompare(b));

        const items: ApiTimelineItem[] = await Promise.all(
            mdFiles.map(async (fileName) => {
                const fullPath = path.join(TIMELINE_DIR, fileName);
                const md = await fs.readFile(fullPath, "utf8");

                const dateISO = fileName.replace(/\.md$/i, "");
                const title = parseFirstHeading(md);
                const timeHHMM = parseTime(md);
                const linkOverride = parseLinkOverride(md);

                return {
                    id: fileName,
                    dateISO,
                    timeHHMM,
                    title,
                    linkOverride,
                    orderKey: dateToOrderKey(dateISO, timeHHMM),
                };
            })
        );

        items.sort((a, b) => a.orderKey - b.orderKey);

        return NextResponse.json({ items });
    } catch {
        return NextResponse.json({ items: [] });
    }
}
