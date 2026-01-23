import { useState, useRef, useEffect } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current && videoUrl) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, videoUrl]);

  const handleTimeUpdate = () => {
    if (videoRef.current && onProgress) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      onProgress(progress);
    }
  };

  return (
    <Link
      to={`/video/${id}`}
      className="block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="relative w-full">
        {/* Video Container - Large cinematic aspect ratio */}
        <div className="relative w-full aspect-cinema overflow-hidden">
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isPlaying ? "opacity-0" : "opacity-100"
            } ${isHovered ? "scale-105" : "scale-100"}`}
          />

          {/* Video */}
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        {/* Info below video */}
        <div className="mt-6 text-center max-w-3xl mx-auto px-4">
          <h3 className="font-sans text-base font-medium text-foreground">
            {title}
          </h3>
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
