export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-[#ff2b2b] pl-4">
      <span className="font-display text-3xl font-bold tracking-tight text-white">{value}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</span>
    </div>
  );
}

export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border border-white/10 border-l-2 border-l-[#ff2b2b] bg-white/[0.02] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#ff5a5a]">{title}</p>
      <div className="mt-2 text-[15px] leading-7 text-zinc-300">{children}</div>
    </div>
  );
}

export function MdxGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">{children}</div>;
}
