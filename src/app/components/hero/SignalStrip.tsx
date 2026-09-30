const ITEMS = [
    "Full-Stack",
    "Aerospace",
    "Open Source",
    "TypeScript",
    "Next.js",
    "Three.js",
    "Hackathons",
    "20t Club",
    "Think it. Hack it. Build it.",
];

export default function SignalStrip() {
    const row = [...ITEMS, ...ITEMS];
    return (
        <div className="relative w-full overflow-hidden border-y border-white/10 bg-ink py-4 font-mono" aria-hidden="true">
            <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
                {row.map((item, i) => (
                    <span key={i} className="flex items-center gap-10 text-xs uppercase tracking-[0.3em] text-zinc-500">
                        {item}
                        <span className="h-1.5 w-1.5 rotate-45 bg-signal" />
                    </span>
                ))}
            </div>
        </div>
    );
}
