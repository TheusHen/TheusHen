"use client";

import { useI18n } from "./contexts/I18nContext";

export default function Loading() {
  const { t } = useI18n();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-950 px-4 text-white"
      role="status"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-r-red-500/50 border-t-red-400" aria-hidden="true" />
        <p className="text-sm font-medium text-white/65">{t("home.loading")}</p>
      </div>
    </div>
  );
}
