import { useState } from "react";
import { Link } from "react-router-dom";
import { HlsVideo } from "./HlsVideo";

interface StackedVideoCardProps {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  videoUrl?: string;
  isIframe?: boolean;
  isYoutube?: boolean;
}

const buildIframeHoverUrl = (url: string) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=true&muted=true&loop=true&preload=true&responsive=true`;
};

const buildYoutubeHoverUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0`;

export const StackedVideoCard = ({
  id,
  title,
  subtitle,
  thumbnail,
  videoUrl,
  isIframe = false,
  isYoutube = false,
}: StackedVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);

  return (
    <Link
      to={`/video/${id}`}
      className="block group w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="w-full">
        <div
          className="relative w-full overflow-hidden bg-black mx-auto"
          style={ratio ? { aspectRatio: `${ratio}` } : undefined}
        >
          <img
            src={thumbnail}
            alt={title}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered && videoUrl ? "opacity-0" : "opacity-100"
            }`}
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

        <div className="mt-3 text-center">
          <h3 className="font-sans text-xs font-normal text-foreground">{title}</h3>
          {subtitle && (
            <p className="font-sans text-[10px] text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </article>
    </Link>
  );
};
