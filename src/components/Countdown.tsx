"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  target: string; // ISO date string
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / 1000 / 60) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

const ZERO = { d: 0, h: 0, m: 0, s: 0 };

export default function Countdown({ target }: CountdownProps) {
  // null = not yet mounted (SSR); avoids server/client mismatch
  const [t, setT] = useState<typeof ZERO | null>(null);

  useEffect(() => {
    // First tick immediately after mount
    setT(getTimeLeft(target));
    const id = setInterval(() => setT(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const display = t ?? ZERO;

  const cells = [
    { label: "Days", value: display.d },
    { label: "Hours", value: display.h },
    { label: "Minutes", value: display.m },
    { label: "Seconds", value: display.s },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl">
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex flex-col items-center bg-surface border border-stroke rounded-2xl px-3 py-4 md:px-6 md:py-6"
        >
          <span className="text-3xl md:text-5xl font-display tabular-nums text-text-primary">
            {String(c.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-xs text-muted uppercase tracking-[0.2em] mt-1">
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}
