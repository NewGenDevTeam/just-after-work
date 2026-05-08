"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PLAYBACK_ID = "Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g";

interface HeroVideoProps {
  src?: string;
  flip?: boolean;
  overlay?: string;
}

export default function HeroVideo({
  src = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`,
  flip = false,
  overlay = "bg-black/20",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const revealedRef = useRef(false);

  const revealVideo = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setVideoReady(true);
  }, []);

  useEffect(() => {
    // Mobile (< 768 px) uses a CSS-animated image layer — no video element
    // is initialised on mobile so iOS Safari can never show a play icon.
    if (window.innerWidth < 768) return;

    const video = videoRef.current;
    if (!video) return;

    // Force muted via JS — iOS Safari can ignore the HTML attribute.
    video.muted = true;
    (video as HTMLVideoElement & { defaultMuted: boolean }).defaultMuted = true;

    const attemptPlay = () => { video.play().catch(() => {}); };

    // Safari / WebKit — native HLS.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      attemptPlay();
      return;
    }

    // Chrome / Firefox / Edge — hls.js.
    let hls: { destroy: () => void } | null = null;
    (async () => {
      const HlsModule = (await import("hls.js")).default;
      if (HlsModule.isSupported()) {
        const instance = new HlsModule();
        instance.loadSource(src);
        instance.attachMedia(video);
        video.addEventListener("canplay", attemptPlay, { once: true });
        hls = instance;
      }
    })();

    return () => { hls?.destroy(); };
  }, [src]);

  // Desktop-only cover fallback: remove after 5 s even if onPlaying never fires.
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const t = setTimeout(revealVideo, 5000);
    return () => clearTimeout(t);
  }, [revealVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* ── MOBILE: pure CSS animated image — no video, no play icon possible ── */}
      <div
        className="mobile-hero-bg block md:hidden absolute inset-0"
        aria-hidden="true"
      />

      {/* ── DESKTOP: HLS video — hidden via CSS on mobile so it is never
          initialised and iOS Safari never encounters a playable element ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={revealVideo}
        onTimeUpdate={revealVideo}
        style={{ pointerEvents: "none", userSelect: "none" }}
        className={`hidden md:block absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${
          flip ? "scale-y-[-1]" : ""
        }`}
      />

      {/* Desktop-only cover: hides the video while the HLS stream buffers */}
      {!videoReady && (
        <div className="hidden md:block absolute inset-0 bg-bg" aria-hidden="true" />
      )}

      <div className={`absolute inset-0 ${overlay}`} />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
