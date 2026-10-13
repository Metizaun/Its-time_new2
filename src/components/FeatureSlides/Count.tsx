"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Animates from the previous value to the next one (used by the interactive panels). */
export function useCount(value: number, reduce: boolean, duration = 0.9) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: reduce ? 0 : duration,
      ease: EASE,
      onUpdate: (latest) => setShown(latest),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, reduce, duration]);

  return shown;
}

export function Count({
  value,
  format,
  reduce,
  duration,
}: {
  value: number;
  format: (value: number) => string;
  reduce: boolean;
  duration?: number;
}) {
  return <>{format(useCount(value, reduce, duration))}</>;
}
