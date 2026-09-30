import Particles from "../components/particles";
import Timeline, { type TimelineEntry } from "../components/Timeline";
import { getTimelineSources } from "@/lib/timeline";
import { renderMdx } from "./render-mdx";

export const revalidate = 3600;

export default async function TimelinePage() {
    const sources = await getTimelineSources();
    const entries: TimelineEntry[] = await Promise.all(
        sources.map(async ({ body, orderKey: _orderKey, ...meta }) => ({
            ...meta,
            content: await renderMdx(body),
        }))
    );

    return (
        <main className="bg-noise relative min-h-screen bg-ink text-white">
            <div className="bg-grid pointer-events-none fixed inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
            <Particles className="pointer-events-none fixed inset-0 opacity-50" quantity={60} />
            <div className="relative">
                <Timeline entries={entries} />
            </div>
        </main>
    );
}
