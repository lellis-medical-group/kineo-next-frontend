"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  value: number;
  suffix?: string;
  /** Animation duration in ms. */
  duration?: number;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type MatchMedia = (query: string) => { matches: boolean };

function prefersReducedMotion(): boolean {
  const matchMedia = (window as { matchMedia?: MatchMedia }).matchMedia;
  return matchMedia ? matchMedia(REDUCED_MOTION).matches : false;
}

/**
 * Counter animating from 0 to `value` on first viewport entry. Falls back to
 * the final value without JS/IntersectionObserver and stays static under
 * reduced motion.
 */
export function CountUp({ value, suffix = "", duration = 900 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (prefersReducedMotion()) return;

    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();

          const start = performance.now();
          setCurrent(0);

          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - t) ** 3;
            setCurrent(Math.round(value * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    io.observe(node);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      setCurrent(value);
    };
  }, [duration, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {current.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}
