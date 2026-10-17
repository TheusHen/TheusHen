export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#050505]">
      <div className="h-px w-44 overflow-hidden bg-white/10">
        <div className="bp-loadbar h-full w-1/3 bg-[#ff2b2b]" aria-hidden="true" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-600">
        loading
      </p>
    </div>
  );
}
