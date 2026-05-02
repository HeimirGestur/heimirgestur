import { useState } from "react";
import { Link } from "react-router-dom";
import { HlsVideo } from "./HlsVideo";

interface VideoCardProps {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  videoUrl?: string;
  isIframe?: boolean;
  isYoutube?: boolean;
  variant?: "large" | "small";
}

const buildIframeHoverUrl = (url: string) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=1&muted=1&loop=1&background=1&controls=0&title=0&byline=0&portrait=0&dnt=1&responsive=1`;
};

const buildYoutubeHoverUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0`;

export const VideoCard = ({
  id,
  title,
  subtitle,
  thumbnail,
  videoUrl,
  isIframe = false,
  isYoutube = false,
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
            variant === "large" ? "aspect-cinema" : ""
          }`}
        >
          <img
            src={thumbnail}
            alt={title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            className={`video-card-image block w-full h-auto transition-opacity duration-500 ${
              isHovered && videoUrl ? "opacity-0" : "opacity-100"
            } ${variant === "large" ? "absolute inset-0 h-full object-contain" : ""}`}
          />

          {videoUrl && isHovered && (
            isYoutube ? (
              <iframe
                src={buildYoutubeHoverUrl(videoUrl)}
                loading="lazy"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-150"
                title={title}
              />
            ) : isIframe ? (
              <iframe
                src={buildIframeHoverUrl(videoUrl)}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                title={title}
              />
            ) : (
              <HlsVideo
                src={videoUrl}
                poster={thumbnail}
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                title={title}
              />
            )
          )}
        </div>
      </article>

      <div className="mt-3 text-center">
        <h3 className="font-sans text-xs font-normal text-foreground">{title}</h3>
        {subtitle && (
          <p className="font-sans text-[10px] text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </Link>
  );
};
