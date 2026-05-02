import { useState, useEffect, useRef } from "react";
import { HlsVideo } from "./HlsVideo";

interface SelectedVideoCardProps {
  id: string;
  title: string;
  director?: string;
  production?: string;
  thumbnail: string;
  videoUrl?: string;
  isIframe?: boolean;
  isActive?: boolean;
  onProgress?: (progress: number) => void;
  progressBar?: React.ReactNode;
  showInfo?: boolean;
  muted?: boolean;
}

const buildIframeAutoplayUrl = (url: string, muted: boolean) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=1&muted=${muted ? "1" : "0"}&loop=1&background=${muted ? "1" : "0"}&controls=0&title=0&byline=0&portrait=0&dnt=1&responsive=1&api=1`;
};

export const SelectedVideoCard = ({
  title,
  director,
  production,
  thumbnail,
  videoUrl,
  isIframe = false,
  isActive = false,
  onProgress,
  progressBar,
  showInfo = true,
  muted = true,
}: SelectedVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const enterFullscreen = () => {
    void playerRef.current?.requestFullscreen?.();
  };

  useEffect(() => {
    setShowVideo(isActive);
  }, [isActive]);

  useEffect(() => {
    setIframeReady(false);
  }, [videoUrl, showVideo, muted]);

  useEffect(() => {
    if (!isIframe || !showVideo) return;
    // Fallback: reveal iframe after a short delay in case postMessage events don't arrive.
    const timer = setTimeout(() => setIframeReady(true), 600);

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.origin === "string" && !event.origin.includes("vimeo.com")) return;
      let data = event.data;
      if (typeof event.data === "string") {
        try {
          data = JSON.parse(event.data || "{}");
        } catch {
          return;
        }
      }
      if (["play", "playing", "timeupdate", "progress", "ready"].includes(data?.event)) {
        setIframeReady(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
    };
  }, [isIframe, showVideo]);

  useEffect(() => {
    if (isActive) return;
    onProgress?.(0);
  }, [isActive, onProgress]);

  // Simulated progress for iframe videos (no timeupdate available)
  useEffect(() => {
    if (!isActive || !onProgress || !isIframe) return;
    let p = 0;
    onProgress(0);
    const interval = setInterval(() => {
      p = Math.min(p + 0.5, 100);
      onProgress(p);
      if (p >= 100) p = 0;
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, onProgress, isIframe]);

  return (
    <article
      className="block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="relative w-full">
        <div ref={playerRef} className="group/player relative w-full aspect-cinema overflow-hidden bg-black">
          <img
            src={thumbnail}
            alt={title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            className={`absolute inset-0 z-[3] h-full w-full object-contain transition-opacity duration-700 ${
              showVideo && (!isIframe || iframeReady) ? "opacity-0" : "opacity-100"
            }`}
          />

          {videoUrl && showVideo && (
            isIframe ? (
              <iframe
                src={buildIframeAutoplayUrl(videoUrl, muted)}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                tabIndex={-1}
                className="pointer-events-none absolute inset-0 z-[2] h-full w-full border-0"
                title={title}
              />
            ) : (
              <HlsVideo
                src={videoUrl}
                poster={thumbnail}
                autoPlay
                muted={muted}
                loop
                className="pointer-events-none absolute inset-0 z-[2] h-full w-full object-cover"
                onTimeUpdate={onProgress}
                title={title}
              />
            )
          )}

          {videoUrl && (
            <button
              type="button"
              onClick={enterFullscreen}
              aria-label={`Enter fullscreen for ${title}`}
              className="absolute inset-0 z-10 grid place-items-center bg-background/10 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground opacity-0 backdrop-blur-[1px] transition-opacity duration-300 hover:opacity-100 group-hover/player:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              FULLSCREEN
            </button>
          )}
        </div>

        {showInfo && (
          <div className="mt-6 text-center max-w-3xl mx-auto px-4">
            {progressBar && <div className="mb-4">{progressBar}</div>}
            <h3 className="font-sans text-sm font-medium text-foreground">{title}</h3>
            {(director || production) && (
              <p className="font-sans text-xs text-muted-foreground mt-2">
                {director && <span>Director. {director}</span>}
                {director && production && <span>, </span>}
                {production && <span>Prod. {production}</span>}
              </p>
            )}
          </div>
        )}
      </article>
    </article>
  );
};
