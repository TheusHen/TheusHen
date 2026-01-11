export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" aria-hidden="true" />
          <div className="h-16 w-16 rounded-full border-4 border-transparent border-t-red-500 border-r-red-500/60 animate-spin" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-red-400 animate-ping" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-lg font-semibold tracking-wide">Loading</p>
          <p className="text-sm text-neutral-300">Preparing your experience...</p>
        </div>

        <div className="h-1 w-32 max-w-full overflow-hidden rounded-full bg-neutral-800">
          <div className="h-full w-1/2 animate-[progress_1.4s_ease-in-out_infinite] bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />
        </div>
      </div>
    </div>
  );
}
