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
  onToggleMuted?: () => void;
  hideThumbnail?: boolean;
  preload?: boolean;
}

const buildIframeAutoplayUrl = (url: string) => {
  const sep = url.includes("?") ? "&" : "?";
  // Always start muted so browsers allow autoplay; mute toggled later via postMessage.
  return `${url}${sep}autoplay=1&muted=1&loop=1&background=0&controls=0&title=0&byline=0&portrait=0&dnt=1&responsive=1&api=1`;
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
  onToggleMuted,
  hideThumbnail = false,
  preload = false,
}: SelectedVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const enterFullscreen = () => {
    void playerRef.current?.requestFullscreen?.();
  };

  useEffect(() => {
    setShowVideo(isActive || preload);
  }, [isActive, preload]);

  useEffect(() => {
    setIframeReady(false);
  }, [videoUrl, showVideo]);

  useEffect(() => {
    if (!isIframe || !showVideo) return;
    // Fallback: reveal iframe after a short delay in case postMessage events don't arrive.
    const timer = setTimeout(() => setIframeReady(true), 600);

    const iframe = playerRef.current?.querySelector("iframe") as HTMLIFrameElement | null;
    const sendCommand = (method: string, value?: unknown) => {
      iframe?.contentWindow?.postMessage(
        JSON.stringify(value === undefined ? { method } : { method, value }),
        "*",
      );
    };

    // Subscribe immediately (covers the case where the iframe was preloaded
    // and already fired its "ready" event before this effect re-mounted).
    const subscribe = () => {
      sendCommand("addEventListener", "timeupdate");
      sendCommand("addEventListener", "play");
      sendCommand("addEventListener", "playing");
      sendCommand("setVolume", muted ? 0 : 1);
    };
    subscribe();
    const subRetry = setTimeout(subscribe, 400);

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
      if (data?.event === "ready") {
        setIframeReady(true);
        subscribe();
      }
      if (["play", "playing", "timeupdate", "progress"].includes(data?.event)) {
        setIframeReady(true);
      }
      if (data?.event === "timeupdate" && isActive && onProgress) {
        const percent = typeof data?.data?.percent === "number"
          ? data.data.percent * 100
          : (data?.data?.duration ? (data.data.seconds / data.data.duration) * 100 : null);
        if (percent !== null) onProgress(percent);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      clearTimeout(timer);
      clearTimeout(subRetry);
      window.removeEventListener("message", handleMessage);
    };
  }, [isIframe, showVideo, isActive, onProgress, muted]);

  useEffect(() => {
    if (isActive) return;
    onProgress?.(0);
  }, [isActive, onProgress]);

  // Toggle Vimeo volume in-place when muted changes — does not affect playback
  useEffect(() => {
    if (!isIframe || !iframeReady) return;
    const iframe = playerRef.current?.querySelector("iframe") as HTMLIFrameElement | null;
    iframe?.contentWindow?.postMessage(
      JSON.stringify({ method: "setVolume", value: muted ? 0 : 1 }),
      "*",
    );
  }, [muted, isIframe, iframeReady]);

  return (
    <article
      className="block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="relative w-full">
        <div ref={playerRef} className="group/player relative w-full aspect-video overflow-hidden bg-black">
          {!hideThumbnail && (
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
          )}

          {videoUrl && showVideo && (
            isIframe ? (
              <iframe
                src={buildIframeAutoplayUrl(videoUrl)}
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
                poster={hideThumbnail ? undefined : thumbnail}
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
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          )}

          {isFullscreen && onToggleMuted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMuted();
              }}
              className="absolute bottom-9 left-1/2 z-20 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-background shadow-2xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-destructive align-middle" />
              Sound {muted ? "off" : "on"}
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
