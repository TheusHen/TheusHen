import type { ComponentPropsWithoutRef, ReactNode } from "react";

function Callout({ children, type = "note" }: { children: ReactNode; type?: "note" | "signal" }) {
    const accent = type === "signal" ? "border-signal/60 bg-signal/[0.06]" : "border-white/15 bg-white/[0.03]";
    return (
        <aside className={`my-4 border-l-2 px-4 py-3 text-sm text-zinc-300 ${accent}`}>
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                {type === "signal" ? "// signal" : "// note"}
            </span>
            {children}
        </aside>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <span className="mr-6 mt-2 inline-flex flex-col">
            <span className="font-display text-3xl font-medium tabular-nums text-white">{value}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">{label}</span>
        </span>
    );
}

function Terminal({ children, title = "zsh" }: { children: ReactNode; title?: string }) {
    return (
        <div className="my-4 overflow-hidden border border-white/10 bg-black/70 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-signal" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="ml-2 uppercase tracking-widest">{title}</span>
            </div>
            <div className="whitespace-pre-wrap px-4 py-3 leading-relaxed text-zinc-300 [&_p]:m-0">{children}</div>
        </div>
    );
}

function Kbd({ children }: { children: ReactNode }) {
    return (
        <kbd className="border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-zinc-200">{children}</kbd>
    );
}

export const mdxComponents = {
    Callout,
    Stat,
    Terminal,
    Kbd,
    p: (props: ComponentPropsWithoutRef<"p">) => <p className="my-2 leading-relaxed text-zinc-400" {...props} />,
    a: (props: ComponentPropsWithoutRef<"a">) => (
        <a
            className="text-white underline decoration-signal/60 underline-offset-4 transition-colors hover:decoration-signal"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    strong: (props: ComponentPropsWithoutRef<"strong">) => <strong className="font-semibold text-white" {...props} />,
    ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="my-3 flex flex-col gap-1.5 text-zinc-400" {...props} />,
    li: (props: ComponentPropsWithoutRef<"li">) => (
        <li className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-2 before:bg-signal/70" {...props} />
    ),
    code: (props: ComponentPropsWithoutRef<"code">) => (
        <code className="bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-200" {...props} />
    ),
    h2: (props: ComponentPropsWithoutRef<"h2">) => <h3 className="mt-4 text-lg font-medium text-white" {...props} />,
};
