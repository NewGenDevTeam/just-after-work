"use client";

import { useEffect, useRef } from "react";

interface HeroVideoProps {
  src?: string;
  flip?: boolean;
  overlay?: string;
}

const PLAYBACK_ID = "Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g";

export default function HeroVideo({
  src = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`,
  flip = false,
  overlay = "bg-black/20",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted via JS property — iOS Safari can ignore the HTML attribute.
    video.muted = true;
    (video as HTMLVideoElement & { defaultMuted: boolean }).defaultMuted = true;

    // canPlayType("application/vnd.apple.mpegurl") returns non-empty ONLY on Safari/WebKit.
    // On iOS 17+, Hls.isSupported() also returns true (Apple added MSE), but native HLS
    // is far more reliable for autoplay on iOS — so we check this FIRST.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      // autoPlay attribute does not re-fire when src is set via JS; call play() explicitly.
      video.play().catch(() => {});
      return;
    }

    // Chrome, Firefox, Edge: use hls.js.
    let hls: { destroy: () => void } | null = null;
    (async () => {
      const HlsModule = (await import("hls.js")).default;
      if (HlsModule.isSupported()) {
        const instance = new HlsModule();
        instance.loadSource(src);
        instance.attachMedia(video);
        video.addEventListener(
          "canplay",
          () => { video.play().catch(() => {}); },
          { once: true }
        );
        hls = instance;
      }
    })();

    return () => { hls?.destroy(); };
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
        // poster suppresses the native browser play-button overlay while the stream loads
        poster={`https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg`}
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
