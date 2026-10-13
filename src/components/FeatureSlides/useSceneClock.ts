"use client";

import { useInView } from "framer-motion";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { slidePhase } from "./slidePhase";

/**
 * Auto-advancing scene clock for the story slides. It advances only while the slide has settled on screen
 * (never while it is still fading in or out, and the mouse never pauses it) and rewinds to scene 0 once the
 * slide is fully hidden, so every reveal starts the story from the beginning.
 *
 * `active` turns true when the slide has settled and false when it is hidden again: mount the parts that
 * animate on entrance only while it is true, and they play in front of the visitor instead of off screen.
 * `onTick` receives the scene and the elapsed ms of that scene on every running tick (and (scene, 0) on a reset).
 * Tab progress is painted imperatively through `fills`.
 */

export function useSceneClock(
  stageRef: RefObject<HTMLDivElement | null>,
  durations: readonly number[],
  enabled: boolean,
  onTick?: (scene: number, elapsed: number) => void,
) {
  const [scene, setScene] = useState(0);
  const [active, setActive] = useState(false);
  const sceneRef = useRef(0);
  const activeRef = useRef(false);
  const elapsed = useRef(0);
  const fills = useRef<Array<HTMLSpanElement | null>>([]);
  const inView = useInView(stageRef, { amount: 0.3 });
  const inViewRef = useRef(inView);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useEffect(() => {
    onTickRef.current = onTick;
  });

  const paint = (index: number, value: number) => {
    const fill = fills.current[index];
    if (fill) fill.style.transform = `scaleX(${value})`;
  };

  const go = (next: number) => {
    sceneRef.current = next;
    elapsed.current = 0;
    setScene(next);
    fills.current.forEach((_, i) => paint(i, i < next ? 1 : 0));
    onTickRef.current?.(next, 0);
  };

  useEffect(() => {
    if (!enabled) return;
    let last = performance.now();

    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;

      const phase = slidePhase(stageRef.current);

      if (phase === "hidden") {
        if (activeRef.current) {
          activeRef.current = false;
          setActive(false);
        }
        if (sceneRef.current !== 0 || elapsed.current !== 0) go(0);
        return;
      }

      // Still crossfading, off screen or in a background tab: hold exactly where we are.
      if (phase === "fading" || !inViewRef.current || document.hidden) return;

      if (!activeRef.current) {
        activeRef.current = true;
        setActive(true);
      }

      elapsed.current += dt;
      const duration = durations[sceneRef.current];
      paint(sceneRef.current, Math.min(1, elapsed.current / duration));
      onTickRef.current?.(sceneRef.current, elapsed.current);

      if (elapsed.current >= duration) {
        go((sceneRef.current + 1) % durations.length);
      }
    }, 80);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { scene, fills, go, active: enabled ? active : true };
}
