"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, WalletCards } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

const wallets = [
  {
    name: "Monero",
    network: "XMR",
    address:
      "88qbtu73qaT71f9h7M9uHJh6TW9rkWkvj6f15UyiV6iENn6y3St8EbjGofMMGSVTzx1UBzPgmZf6BSbLkDEwndWGVKC7Fnq",
    uri: "monero:88qbtu73qaT71f9h7M9uHJh6TW9rkWkvj6f15UyiV6iENn6y3St8EbjGofMMGSVTzx1UBzPgmZf6BSbLkDEwndWGVKC7Fnq",
  },
  {
    name: "Bitcoin",
    network: "BTC",
    address: "bc1qt73ej5rw3g7qm0c87tvvzkltxxjahjy23755q4",
    uri: "bitcoin:bc1qt73ej5rw3g7qm0c87tvvzkltxxjahjy23755q4?label=TheusHen",
  },
] as const;

export default function DonatePage() {
  const { t } = useI18n();
  const [copied, setCopied] = useState<string | null>(null);

  const copyAddress = async (name: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(name);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      setCopied(null);
    }
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_50%_0%,rgba(120,53,15,0.16),transparent_30rem),linear-gradient(180deg,#050505,#0a0a0a)] px-5 pb-20 pt-8 text-white sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            aria-label={t("nav.backHome")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-white/65 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {t("nav.projects")}
          </Link>
        </header>

        <section className="mx-auto max-w-3xl pb-14 pt-24 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/15 bg-amber-950/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            <WalletCards aria-hidden="true" className="h-4 w-4" />
            {t("donate.eyebrow")}
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-[-0.065em] sm:text-7xl">
            {t("donate.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            {t("donate.description")}
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2" aria-label={t("donate.walletsLabel")}>
          {wallets.map((wallet) => (
            <article
              key={wallet.name}
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/25"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black tracking-[-0.04em]">
                  {wallet.name}
                </h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
                  {wallet.network}
                </span>
              </div>
              <code className="mt-6 block min-h-24 break-all rounded-2xl border border-dashed border-white/15 bg-black/30 p-4 text-xs leading-6 text-white/65">
                {wallet.address}
              </code>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={wallet.uri}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  {t("donate.openWallet")}
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => copyAddress(wallet.name, wallet.address)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <Copy aria-hidden="true" className="h-4 w-4" />
                  {t("donate.copy")}
                </button>
              </div>
            </article>
          ))}
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-white/45">
          {t("donate.notice")}
        </p>
        <p className="sr-only" aria-live="polite">
          {copied ? `${copied}: ${t("donate.copied")}` : ""}
        </p>
      </div>
    </main>
  );
}
