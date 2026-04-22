import { useState } from "react";
import { Link } from "react-router-dom";

interface VideoCardProps {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  videoUrl?: string;
  variant?: "large" | "small";
}

const buildHoverUrl = (url: string) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=true&muted=true&loop=true&preload=true&responsive=true`;
};

export const VideoCard = ({
  id,
  title,
  subtitle,
  thumbnail,
  videoUrl,
  variant = "small",
}: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/video/${id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="video-card">
        <div
          className={`relative overflow-hidden bg-muted ${
            variant === "large" ? "aspect-cinema" : "aspect-video"
          }`}
        >
          <img
            src={thumbnail}
            alt={title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            className={`video-card-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered && videoUrl ? "opacity-0" : "opacity-100"
            }`}
          />

          {videoUrl && isHovered && (
            <iframe
              src={buildHoverUrl(videoUrl)}
              loading="lazy"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 pointer-events-none"
              title={title}
            />
          )}
        </div>
      </article>

      <div className="mt-3 text-center">
        <h3 className="font-sans text-sm font-normal text-foreground">{title}</h3>
        {subtitle && (
          <p className="font-sans text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </Link>
  );
};
