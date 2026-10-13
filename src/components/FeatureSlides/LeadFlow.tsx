"use client";

import { useEffect, useRef } from "react";

/**
 * Background of the animated section. It tells the product story in the smallest possible way, on the free
 * side of the slide (the headline column), so it never competes with the scenes:
 * contacts drift in scattered and grey, line up into rows (the AI organises them), a few turn orange with a
 * short gradient trail (they converted) and all of them are absorbed at the edge of the stage.
 * The cursor lines up the pixels near it.
 *
 * One canvas, ~40 squares, 30 fps, only while the section is on screen. It never reacts by pausing.
 */

const GRID = 44; // same pitch as the CSS grid behind it
const REACH = 0.56; // the flow lives in the first REACH of the width; the stage owns the rest
const CONVERT_LIMIT = 5; // never more than this many converting pixels alive at once
const GRAY = [245, 238, 228] as const;
const ORANGE = [255, 90, 31] as const;
const PINK = [255, 77, 109] as const;

type Pixel = {
  x: number;
  fy: number; // scattered height, as a fraction of the canvas
  vx: number;
  size: number;
  alpha: number;
  seed: number;
  converts: boolean;
  convertAt: number; // fraction of the width where it turns orange
  pinged: boolean;
  ping: { t: number; x: number; y: number } | null;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: readonly number[], b: readonly number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgba = (c: readonly number[], alpha: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha.toFixed(3)})`;

function makePixel(x: number, convertingNow: number): Pixel {
  return {
    x,
    fy: Math.random(),
    vx: rand(18, 36),
    size: [3, 4, 4, 5, 6][Math.floor(Math.random() * 5)],
    alpha: rand(0.18, 0.34),
    seed: rand(0, Math.PI * 2),
    converts: convertingNow < CONVERT_LIMIT && Math.random() < 0.16,
    convertAt: rand(0.3, 0.38),
    pinged: false,
    ping: null,
  };
}

export function LeadFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    // Compact flow and reduced motion keep the plain grid: no canvas at all.
    if (window.matchMedia("(max-width: 980px), (prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let pixels: Pixel[] = [];
    let frame = 0;
    let last = 0;
    let running = false;
    let onScreen = true;
    const pointer = { x: -1000, y: -1000, power: 0 };

    const converting = (except?: Pixel) => pixels.filter((p) => p.converts && p !== except).length;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = width ? rect.width / width : 1;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!pixels.length) {
        const count = Math.round(Math.min(44, Math.max(24, width / 34)));
        for (let i = 0; i < count; i += 1) pixels.push(makePixel(rand(0, width * REACH), converting()));
      } else {
        pixels.forEach((p) => {
          p.x *= ratio;
        });
      }
    };

    const draw = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(draw);
      if (now - last < 32) return; // ~30 fps is plenty for slow drifting squares
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);
      pointer.power = Math.max(0, pointer.power - dt * 0.7);

      for (const p of pixels) {
        p.x += p.vx * dt;
        if (p.x > width * REACH) {
          Object.assign(p, makePixel(-12, converting(p)));
          continue;
        }

        const nx = p.x / width;
        const scatteredY = p.fy * height + Math.sin(t * 0.5 + p.seed) * 10 * (1 - smooth(0.06, 0.3, nx));
        const rowY = (Math.floor((p.fy * height) / GRID) + 0.5) * GRID;

        // chaos -> order: scattered on entry, locked into the grid rows a third of the way across
        let order = smooth(0.06, 0.3, nx);
        let near = 0;
        if (pointer.power > 0) {
          const d = Math.hypot(p.x - pointer.x, scatteredY - pointer.y);
          near = Math.max(0, 1 - d / 130) ** 2 * pointer.power;
          order = Math.max(order, near);
        }
        const y = scatteredY + (rowY - scatteredY) * order;

        // soft at both ends: it appears from the margin and is absorbed at the edge of the stage
        const edge = smooth(0, 0.04, nx) * (1 - smooth(0.4, 0.54, nx));
        const presence = (0.55 + 0.45 * smooth(0.1, 0.34, nx)) * edge;
        const baseAlpha = p.alpha * presence * (1 + 1.1 * near);

        let color: readonly number[] = GRAY;
        let alpha = baseAlpha;
        const converted = p.converts ? smooth(p.convertAt, p.convertAt + 0.03, nx) : 0;
        if (converted > 0) {
          color = mix(GRAY, ORANGE, converted);
          alpha = baseAlpha + (0.7 * edge - baseAlpha) * converted;
          if (!p.pinged) {
            p.pinged = true;
            p.ping = { t, x: p.x, y: rowY };
          }
          // trail: the brand gradient, only here
          for (let k = 1; k <= 3; k += 1) {
            ctx.fillStyle = rgba(mix(ORANGE, PINK, k / 3), 0.6 * edge * converted * (1 - k / 4));
            const s = k === 3 ? Math.max(2, p.size - 1) : p.size;
            ctx.fillRect(Math.round(p.x - k * (p.size + 5) - s / 2), Math.round(rowY - s / 2), s, s);
          }
        }
        ctx.fillStyle = rgba(color, alpha);
        ctx.fillRect(Math.round(p.x - p.size / 2), Math.round(y - p.size / 2), p.size, p.size);

        if (p.ping) {
          const u = (t - p.ping.t) / 0.9;
          if (u >= 1) {
            p.ping = null;
          } else {
            const s = p.size + 4 + u * 14;
            ctx.strokeStyle = rgba(ORANGE, 0.45 * (1 - u) * edge);
            ctx.lineWidth = 1;
            ctx.strokeRect(Math.round(p.ping.x - s / 2) + 0.5, Math.round(p.ping.y - s / 2) + 0.5, s, s);
          }
        }
      }
    };

    const sync = () => {
      const should = onScreen && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(draw);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.power = 1;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    intersection.observe(host);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", sync);
      pixels = [];
    };
  }, []);

  return <canvas className="feature-flow" ref={canvasRef} aria-hidden="true" />;
}
