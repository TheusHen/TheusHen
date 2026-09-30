import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";

export const TIMELINE_DIR = path.join(process.cwd(), "line");
const GITHUB_BASE = "https://github.com/TheusHen/TheusHen/blob/main/line";

export type TimelineMeta = {
    id: string;
    dateISO: string;
    timeHHMM: string;
    title: string;
    link: string;
    tags: string[];
    orderKey: number;
};

export type TimelineSource = TimelineMeta & { body: string };

function orderKey(dateISO: string, timeHHMM: string) {
    const [y, m, d] = dateISO.split("-").map(Number);
    const [hh, mm] = timeHHMM.split(":").map(Number);
    const t = new Date(y || 0, (m || 1) - 1, d || 1, hh || 0, mm || 0).getTime();
    return Number.isFinite(t) ? t : 0;
}

function parseLegacy(raw: string) {
    let body = raw.replace(/^\uFEFF/, "");
    const heading = body.match(/^\s*#\s+(.+)$/m);
    const time = body.match(/^time:\s*(([01]\d|2[0-3]):[0-5]\d)\s*$/im);
    const link = body.match(/^link:\s*(https?:\/\/\S+)\s*$/im);
    body = body
        .replace(/^\s*#\s+.+$/m, "")
        .replace(/^time:.*$/im, "")
        .replace(/^link:.*$/im, "")
        .trim();
    return { title: heading?.[1]?.trim(), time: time?.[1], link: link?.[1], body };
}

export async function getTimelineSources(): Promise<TimelineSource[]> {
    let files: string[] = [];
    try {
        files = (await fs.readdir(TIMELINE_DIR)).filter((f) => /\.mdx?$/i.test(f));
    } catch {
        return [];
    }

    const entries = await Promise.all(
        files.map(async (fileName) => {
            const raw = await fs.readFile(path.join(TIMELINE_DIR, fileName), "utf8");
            const { data, content } = matter(raw);
            const legacy = parseLegacy(content);
            const dateISO = String(data.date ?? fileName.replace(/\.mdx?$/i, "")).slice(0, 10);
            const timeHHMM = String(data.time ?? legacy.time ?? "00:00");
            return {
                id: fileName,
                dateISO,
                timeHHMM,
                title: String(data.title ?? legacy.title ?? "Untitled"),
                link: String(data.link ?? legacy.link ?? `${GITHUB_BASE}/${encodeURIComponent(fileName)}`),
                tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
                orderKey: orderKey(dateISO, timeHHMM),
                body: data.title ? content.trim() : legacy.body,
            };
        })
    );

    return entries.sort((a, b) => a.orderKey - b.orderKey);
}
