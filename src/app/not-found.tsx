"use client";

import { useI18n } from "./contexts/I18nContext";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-4">{t("notFound.title")}</h2>
        <p className="text-zinc-400 mb-8 max-w-md">
          {t("notFound.body")}
        </p>
        <a
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {t("notFound.backHome")}
        </a>
      </div>
    </div>
  );
}
