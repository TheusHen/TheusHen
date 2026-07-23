"use client";

import { memo, useEffect, useRef } from "react";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

interface Circle {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

const Particles = memo(function Particles({
  className = "",
  quantity = 40,
  staticity = 50,
  ease = 50,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !container || !context) return;

    const pointer = { x: 0, y: 0 };
    const size = { width: 0, height: 0 };
    let circles: Circle[] = [];
    let animationFrame = 0;
    let isVisible = !document.hidden;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const createCircle = (): Circle => ({
      x: Math.random() * size.width,
      y: Math.random() * size.height,
      offsetX: 0,
      offsetY: 0,
      size: Math.random() * 1.8 + 0.2,
      alpha: 0,
      targetAlpha: Math.random() * 0.45 + 0.1,
      dx: (Math.random() - 0.5) * 0.16,
      dy: (Math.random() - 0.5) * 0.16,
      magnetism: 0.2 + Math.random() * 3,
    });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.width = Math.max(1, Math.round(rect.width));
      size.height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      circles = Array.from({ length: reducedMotion ? quantity / 2 : quantity }, createCircle);
    };

    const draw = () => {
      context.clearRect(0, 0, size.width, size.height);

      for (const circle of circles) {
        const edgeDistance = Math.min(
          circle.x,
          size.width - circle.x,
          circle.y,
          size.height - circle.y
        );
        const edgeOpacity = Math.min(1, Math.max(0, edgeDistance / 24));
        circle.alpha += (circle.targetAlpha * edgeOpacity - circle.alpha) * 0.04;

        if (!reducedMotion) {
          circle.x += circle.dx;
          circle.y += circle.dy;
          circle.offsetX +=
            (pointer.x / (staticity / circle.magnetism) - circle.offsetX) / ease;
          circle.offsetY +=
            (pointer.y / (staticity / circle.magnetism) - circle.offsetY) / ease;
        }

        if (
          circle.x < -4 ||
          circle.x > size.width + 4 ||
          circle.y < -4 ||
          circle.y > size.height + 4
        ) {
          Object.assign(circle, createCircle());
        }

        context.beginPath();
        context.arc(
          circle.x + circle.offsetX,
          circle.y + circle.offsetY,
          circle.size,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255,255,255,${circle.alpha})`;
        context.fill();
      }

      if (isVisible && !reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left - size.width / 2;
      pointer.y = event.clientY - rect.top - size.height / 2;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !reducedMotion) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    resize();
    draw();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [ease, quantity, refresh, staticity]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
});

Particles.displayName = "Particles";

export default Particles;
