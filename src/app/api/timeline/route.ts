import { NextResponse } from "next/server";
import { getTimelineSources } from "@/lib/timeline";

export const dynamic = "force-dynamic";

export async function GET() {
    const sources = await getTimelineSources();
    const items = sources.map(({ id, dateISO, timeHHMM, title, link, tags, orderKey }) => ({
        id,
        dateISO,
        timeHHMM,
        title,
        linkOverride: link,
        tags,
        orderKey,
    }));
    return NextResponse.json({ items });
}
