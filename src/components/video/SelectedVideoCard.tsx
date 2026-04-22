import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface SelectedVideoCardProps {
  id: string;
  title: string;
  director?: string;
  production?: string;
  thumbnail: string;
  videoUrl?: string;
  isActive?: boolean;
  onProgress?: (progress: number) => void;
}

const buildAutoplayUrl = (url: string, autoplay: boolean) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=${autoplay ? "true" : "false"}&muted=true&loop=true&preload=true&responsive=true`;
};

export const SelectedVideoCard = ({
  id,
  title,
  director,
  production,
  thumbnail,
  videoUrl,
  isActive = false,
  onProgress,
}: SelectedVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    setShowVideo(isActive);
  }, [isActive]);

  // Simulated progress for the bottom progress bar (Bunny iframe doesn't expose timeupdate)
  useEffect(() => {
    if (!isActive || !onProgress) return;
    progressRef.current = 0;
    onProgress(0);
    const interval = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + 0.5, 100);
      onProgress(progressRef.current);
      if (progressRef.current >= 100) progressRef.current = 0;
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, onProgress]);

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
            <iframe
              src={buildAutoplayUrl(videoUrl, true)}
              loading="lazy"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              title={title}
            />
          )}
        </div>

        <div className="mt-6 text-center max-w-3xl mx-auto px-4">
          <h3 className="font-sans text-base font-medium text-foreground">{title}</h3>
          {(director || production) && (
            <p className="font-sans text-sm text-muted-foreground mt-2">
              {director && <span>Director. {director}</span>}
              {director && production && <span>, </span>}
              {production && <span>Prod. {production}</span>}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};
