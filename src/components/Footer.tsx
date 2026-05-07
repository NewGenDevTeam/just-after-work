"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      if (!marqueeRef.current) return;
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
      }, marqueeRef);
    })();
    return () => ctx?.revert();
  }, []);

  const marqueeText = Array(10).fill("BUILDING THE FUTURE • ").join("");

  return (
    <footer className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden border-t border-stroke">
      {/* Marquee */}
      <div className="overflow-hidden mb-16 md:mb-24">
        <div
          ref={marqueeRef}
          className="whitespace-nowrap text-5xl md:text-7xl lg:text-8xl font-display italic text-text-primary/30"
          style={{ width: "max-content" }}
        >
          {marqueeText}
          {marqueeText}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* CTA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display italic mb-6">
            Let&apos;s talk after hours
          </h2>
          <Link
            href="mailto:jude@justafterwork.com"
            className="group relative inline-flex"
          >
            <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative inline-flex items-center gap-2 bg-surface text-text-primary rounded-full px-7 py-3.5 text-sm border border-stroke">
              jude@justafterwork.com
              <span className="text-xs">↗</span>
            </span>
          </Link>
        </div>

        {/* Footer bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-stroke">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-pulse-dot" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs text-muted uppercase tracking-[0.2em]">
              Available for collaborations
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-muted">
            <Link
              href="https://www.instagram.com/justafterwork/"
              target="_blank"
              className="hover:text-text-primary transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="http://www.facebook.com/profile.php?id=61578132841991"
              target="_blank"
              className="hover:text-text-primary transition-colors"
            >
              Facebook
            </Link>
            <Link
              href="https://www.linkedin.com/company/just-after-work"
              target="_blank"
              className="hover:text-text-primary transition-colors"
            >
              LinkedIn
            </Link>
          </div>

          <p className="text-xs text-muted">© 2025 Just After Work</p>
        </div>
      </div>
    </footer>
  );
}
