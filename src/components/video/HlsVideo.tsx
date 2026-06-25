import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  onTimeUpdate?: (progress: number) => void;
  title?: string;
}

export const HlsVideo = ({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  className,
  onTimeUpdate,
  title,
}: HlsVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;

    const isHls = /\.m3u8(\?|$)/i.test(src);

    if (!isHls) {
      video.src = src;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari / iOS native HLS
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    if (autoPlay) {
      const tryPlay = () => {
        video.play().catch(() => {
          // Autoplay can be blocked; ignore.
        });
      };
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
      video.addEventListener("canplay", tryPlay, { once: true });
      tryPlay();
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeAttribute("src");
      video.load();
    };
  }, [src, autoPlay]);

  const handleTimeUpdate = () => {
    if (!onTimeUpdate || !videoRef.current) return;
    const v = videoRef.current;
    if (v.duration > 0) {
      onTimeUpdate((v.currentTime / v.duration) * 100);
    }
  };

  useEffect(() => {
    if (!onTimeUpdate) return;
    const timer = window.setInterval(handleTimeUpdate, 250);
    return () => window.clearInterval(timer);
  }, [onTimeUpdate]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline
      preload="auto"
      className={className}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleTimeUpdate}
      onPlay={handleTimeUpdate}
      title={title}
    />
  );
};
