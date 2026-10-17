import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1
        {...props}
        className="bp-mdx-h1 font-display text-4xl sm:text-5xl font-bold tracking-[-0.06em] text-white"
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        className="bp-mdx-h2 font-display text-2xl sm:text-3xl font-bold tracking-[-0.05em] text-white mt-8"
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        className="font-display text-lg font-bold tracking-tight text-white mt-6"
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p {...props} className="bp-mdx-p mt-4 text-base leading-8 text-zinc-300">
        {children}
      </p>
    ),
    a: ({ children, ...props }) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <a {...(props as any)} className="bp-mdx-a text-[#ff5a5a] underline decoration-[#ff2b2b]/50 underline-offset-4 hover:text-white hover:decoration-white transition-colors">
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul {...props} className="mt-4 space-y-2 text-zinc-300">
        {children}
      </ul>
    ),
    li: ({ children, ...props }) => (
      <li {...props} className="flex gap-3 text-[15px] leading-7">
        <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 bg-[#ff2b2b]" />
        <span>{children}</span>
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        {...props}
        className="mt-6 border-l-2 border-[#ff2b2b] pl-5 font-mono text-sm leading-7 text-zinc-400"
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code
        {...props}
        className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[13px] text-zinc-100"
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        {...props}
        className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-black/70 p-5 font-mono text-[13px] leading-6 [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0"
      >
        {children}
      </pre>
    ),
    hr: (props) => (
      <hr {...props} className="my-8 border-white/10" />
    ),
    table: ({ children, ...props }) => (
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table {...props} className="w-full font-mono text-[13px] text-zinc-300">
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th {...props} className="border-b border-white/10 bg-white/[0.03] px-4 py-3 text-left font-semibold text-white">
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td {...props} className="border-b border-white/[0.06] px-4 py-3">
        {children}
      </td>
    ),
    ...components,
  };
}
