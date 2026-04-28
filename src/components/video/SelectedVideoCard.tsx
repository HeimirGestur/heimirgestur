import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
}

const buildIframeAutoplayUrl = (url: string) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=true&muted=true&loop=true&controls=0&title=0&byline=0&portrait=0&preload=true&responsive=true`;
};

export const SelectedVideoCard = ({
  id,
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
}: SelectedVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setShowVideo(isActive);
  }, [isActive]);

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
    <Link
      to={`/video/${id}`}
      className="block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="relative w-full">
        <div className="relative w-full aspect-cinema overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              showVideo ? "opacity-0" : "opacity-100"
            } ${isHovered ? "scale-105" : "scale-100"}`}
          />

          {videoUrl && showVideo && (
            isIframe ? (
              <iframe
                src={buildIframeAutoplayUrl(videoUrl)}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
                title={title}
              />
            ) : (
              <HlsVideo
                src={videoUrl}
                poster={thumbnail}
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover"
                onTimeUpdate={onProgress}
                title={title}
              />
            )
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
    </Link>
  );
};
