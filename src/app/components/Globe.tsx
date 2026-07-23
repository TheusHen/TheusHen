"use client";

import { useGlobe } from "../contexts/GlobeContext";
import { useI18n } from "../contexts/I18nContext";

export default function GlobeBrazil() {
  const { globeActive } = useGlobe();
  const { t } = useI18n();

  if (!globeActive) return null;

  return (
    <div
      className="globe-stage"
      role="img"
      aria-label={`${t("about.location")} — highlighted on a stylized globe`}
    >
      <div className="globe-sphere">
        <span className="globe-grid" aria-hidden="true" />
        <span className="globe-brazil" aria-hidden="true">
          <span />
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-white/60">
        {t("about.location")} · 22° S, 47° W
      </p>

      <style jsx>{`
        .globe-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: min(22rem, 90vw);
          padding: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          background: rgba(0, 0, 0, 0.25);
        }

        .globe-sphere {
          position: relative;
          width: min(18rem, 72vw);
          aspect-ratio: 1;
          overflow: hidden;
          border: 1px solid rgba(125, 211, 252, 0.25);
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.18), transparent 16%),
            radial-gradient(ellipse at 28% 44%, #7dd3a8 0 9%, transparent 10%),
            radial-gradient(ellipse at 62% 28%, #7dd3a8 0 12%, transparent 13%),
            radial-gradient(ellipse at 60% 62%, #62bd8d 0 15%, transparent 16%),
            radial-gradient(circle at 35% 35%, #1f78b4, #082f49 70%);
          box-shadow:
            inset -2.5rem -2rem 4rem rgba(0, 0, 0, 0.55),
            0 2rem 5rem rgba(14, 116, 144, 0.18);
          animation: globe-float 7s ease-in-out infinite;
        }

        .globe-grid {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            repeating-radial-gradient(
              ellipse at center,
              transparent 0 14%,
              rgba(255, 255, 255, 0.08) 14.5% 15%,
              transparent 15.5% 28%
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0 15%,
              rgba(255, 255, 255, 0.07) 15.5% 16%,
              transparent 16.5% 31%
            );
          mask-image: radial-gradient(circle, black 63%, transparent 72%);
        }

        .globe-brazil {
          position: absolute;
          left: 36%;
          top: 58%;
          display: grid;
          width: 2.25rem;
          height: 2.25rem;
          place-items: center;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.18);
          box-shadow: 0 0 1.75rem rgba(34, 197, 94, 0.8);
          animation: marker-pulse 2.2s ease-in-out infinite;
        }

        .globe-brazil span {
          width: 0.65rem;
          height: 0.65rem;
          border: 2px solid white;
          border-radius: 50%;
          background: #22c55e;
        }

        @keyframes globe-float {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-0.5rem) rotate(2deg);
          }
        }

        @keyframes marker-pulse {
          0%,
          100% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.15);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .globe-sphere,
          .globe-brazil {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
