import { useState, useEffect, useRef } from "react";
import Player from "@vimeo/player";
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
  return `${url}${sep}autoplay=1&muted=1&loop=1&background=0&controls=0&title=0&byline=0&portrait=0&dnt=1&responsive=1&api=1&transparent=1`;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<Player | null>(null);
  const progressPercentRef = useRef(0);
  const playerProgressAtRef = useRef(0);
  const fallbackStartAtRef = useRef(0);
  const fallbackDurationRef = useRef(24);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement === playerRef.current) {
      void document.exitFullscreen?.();
    } else {
      void playerRef.current?.requestFullscreen?.();
    }
  };

  useEffect(() => {
    setShowVideo(isActive || preload);
  }, [isActive, preload]);

  useEffect(() => {
    setIframeReady(false);
  }, [videoUrl, showVideo]);

  useEffect(() => {
    if (!isIframe || !showVideo || !iframeRef.current) return;

    const player = new Player(iframeRef.current);
    vimeoPlayerRef.current = player;
    let cancelled = false;
    let pollFrame = 0;

    const updateProgress = (percent: number, fromPlayer = false) => {
      const boundedPercent = Math.max(0, Math.min(100, percent * 100));
      progressPercentRef.current = boundedPercent;
      if (fromPlayer) {
        playerProgressAtRef.current = performance.now();
        fallbackStartAtRef.current = performance.now() - (boundedPercent / 100) * fallbackDurationRef.current * 1000;
      }
      if (!cancelled && isActive && onProgress) {
        onProgress(boundedPercent);
      }
    };

    const pollProgress = async () => {
      if (cancelled) return;
      if (isActive && onProgress) {
        const runFallback = () => {
          const now = performance.now();
          const durationMs = Math.max(1, fallbackDurationRef.current) * 1000;
          if (!fallbackStartAtRef.current) {
            fallbackStartAtRef.current = now - (progressPercentRef.current / 100) * durationMs;
          }
          updateProgress(((now - fallbackStartAtRef.current) % durationMs) / durationMs);
        };
        try {
          const [currentTime, duration] = await Promise.all([
            player.getCurrentTime(),
            player.getDuration(),
          ]);
          if (duration > 0) {
            fallbackDurationRef.current = duration;
            updateProgress(currentTime / duration, true);
          } else {
            runFallback();
          }
        } catch {
          // The Vimeo player can reject while it is still initializing.
          runFallback();
        }
      }
      pollFrame = window.setTimeout(pollProgress, 250);
    };

    const handleTimeUpdate = (data: { percent?: number; seconds?: number; duration?: number }) => {
      setIframeReady(true);
      if (typeof data.percent === "number") {
        if (data.duration) fallbackDurationRef.current = data.duration;
        updateProgress(data.percent, true);
      } else if (data.duration && typeof data.seconds === "number") {
        fallbackDurationRef.current = data.duration;
        updateProgress(data.seconds / data.duration, true);
      }
    };

    const tickFallback = () => {
      if (cancelled) return;
      const now = performance.now();
      if (isActive && onProgress && now - playerProgressAtRef.current > 1200) {
        const durationMs = Math.max(1, fallbackDurationRef.current) * 1000;
        if (!fallbackStartAtRef.current) {
          fallbackStartAtRef.current = now - (progressPercentRef.current / 100) * durationMs;
        }
        updateProgress(((now - fallbackStartAtRef.current) % durationMs) / durationMs);
      }
      pollFrame = window.setTimeout(tickFallback, 250);
    };

    const markReady = () => setIframeReady(true);
    player.on("timeupdate", handleTimeUpdate);
    player.on("play", markReady);
    player.on("playing", markReady);
    player.on("progress", markReady);

    playerProgressAtRef.current = performance.now();
    fallbackStartAtRef.current = performance.now() - (progressPercentRef.current / 100) * fallbackDurationRef.current * 1000;
    pollFrame = window.setTimeout(tickFallback, 250);

    player.ready().then(() => {
      if (cancelled) return;
      setIframeReady(true);
      void player.setVolume(muted ? 0 : 1).catch(() => undefined);
      if (isActive) void player.play().catch(() => undefined);
      window.clearTimeout(pollFrame);
      pollFrame = window.setTimeout(pollProgress, 250);
    }).catch(() => {
      if (!cancelled) setIframeReady(true);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(pollFrame);
      player.off("timeupdate", handleTimeUpdate);
      player.off("play", markReady);
      player.off("playing", markReady);
      player.off("progress", markReady);
      if (vimeoPlayerRef.current === player) vimeoPlayerRef.current = null;
    };
  }, [isIframe, showVideo, isActive, onProgress, muted]);

  useEffect(() => {
    if (isActive) return;
    progressPercentRef.current = 0;
    fallbackStartAtRef.current = 0;
    onProgress?.(0);
  }, [isActive, onProgress]);

  // Toggle Vimeo volume in-place when muted changes — does not affect playback
  useEffect(() => {
    if (!isIframe || !iframeReady) return;
    void vimeoPlayerRef.current?.setVolume(muted ? 0 : 1).catch(() => undefined);
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
                ref={iframeRef}
                src={buildIframeAutoplayUrl(videoUrl)}
                loading={preload ? "eager" : "lazy"}
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
              onClick={toggleFullscreen}
              aria-label={`Toggle fullscreen for ${title}`}
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
