"use client";

import { useI18n } from "./contexts/I18nContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-4">
          {t("errors.title")}
        </h1>
        <h2 className="text-2xl font-semibold mb-4">{t("errors.subtitle")}</h2>
        <p className="text-zinc-400 mb-8">
          {error.message || t("errors.fallback")}
        </p>
        <button
          onClick={reset}
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {t("errors.tryAgain")}
        </button>
      </div>
    </div>
  );
}
