"use client";

import { cn } from "@/app/lib/cn";
import Reveal from "./Reveal";

/** Border-only blueprint cell: no fill, just border + [+] + mono label. */
export default function GridCell({
  id,
  index,
  label,
  span = "bp-span-6",
  reflow,
  className,
  children,
}: {
  id: string;
  index: string;
  label: string;
  span?: string;
  reflow?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={cn("bp-cell bp-hover", span, reflow, className)} as="section" aria-label={label}>
      <div className="bp-label relative z-10">
        <span className="bp-tick" aria-hidden />
        <span className="bp-id">{index}</span>
        <span>{id}</span>
        <span className="ml-auto hidden sm:inline opacity-60">// {label}</span>
      </div>
      <div className="relative z-10">{children}</div>
    </Reveal>
  );
}
