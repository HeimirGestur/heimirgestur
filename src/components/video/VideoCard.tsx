import { useState, useRef } from "react";
import { Link } from "react-router-dom";

interface VideoCardProps {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  videoUrl?: string;
  variant?: "large" | "small";
}

export const VideoCard = ({
  id,
  title,
  subtitle,
  thumbnail,
  videoUrl,
  variant = "small",
}: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && videoUrl) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      
      progressInterval.current = setInterval(() => {
        if (videoRef.current) {
          const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  return (
    <Link
      to={`/video/${id}`}
      className="block group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article className="video-card">
        <div
          className={`relative overflow-hidden ${
            variant === "large" ? "aspect-cinema" : "aspect-video"
          }`}
        >
          {/* Thumbnail Image */}
          <img
            src={thumbnail}
            alt={title}
            className={`video-card-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered && videoUrl ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Video (shown on hover) */}
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        {/* Progress Bar (for large variant) */}
        {variant === "large" && isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-muted">
            <div
              className="progress-line"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </article>

      {/* Title and Subtitle */}
      <div className="mt-3 text-center">
        <h3 className="font-sans text-sm font-normal text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};
