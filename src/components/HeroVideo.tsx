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

    let hls: { destroy: () => void } | null = null;
    (async () => {
      const HlsModule = (await import("hls.js")).default;
      if (HlsModule.isSupported()) {
        const instance = new HlsModule();
        instance.loadSource(src);
        instance.attachMedia(video);
        hls = instance;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    })();

    return () => {
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
        className={`absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${
          flip ? "scale-y-[-1]" : ""
        }`}
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
