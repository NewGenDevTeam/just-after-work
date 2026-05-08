"use client";

import { useEffect, useRef } from "react";

interface HeroVideoProps {
  src?: string;
  flip?: boolean;
  overlay?: string;
}

export default function HeroVideo({
  src = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8",
  flip = false,
  overlay = "bg-black/20",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted via JS property — some mobile browsers ignore the HTML attribute.
    video.muted = true;
    (video as HTMLVideoElement & { defaultMuted: boolean }).defaultMuted = true;

    // canplay fires when the browser has enough data to begin playing.
    // loadedmetadata fires too early on iOS Safari and play() gets rejected.
    const tryPlay = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // If play() is still rejected, retry once on the next canplay.
          video.addEventListener("canplay", () => { video.play().catch(() => {}); }, { once: true });
        });
      }
    };

    // iOS/macOS Safari supports HLS natively.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.load();
      video.addEventListener("canplay", tryPlay, { once: true });
      return () => video.removeEventListener("canplay", tryPlay);
    }

    // All other browsers: use hls.js.
    let hls: { destroy: () => void } | null = null;
    (async () => {
      const HlsModule = (await import("hls.js")).default;
      if (HlsModule.isSupported()) {
        const instance = new HlsModule();
        instance.loadSource(src);
        instance.attachMedia(video);
        // autoplay attribute alone is unreliable on mobile Chrome; call play() explicitly.
        video.addEventListener("canplay", tryPlay, { once: true });
        hls = instance;
      }
    })();

    return () => {
      video.removeEventListener("canplay", tryPlay);
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ pointerEvents: "none" }}
        className={`absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${
          flip ? "scale-y-[-1]" : ""
        }`}
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
