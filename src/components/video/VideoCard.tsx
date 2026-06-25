import { useState } from "react";
import { Link } from "react-router-dom";
import { HlsVideo } from "./HlsVideo";
import { getStartTime, appendVimeoStart } from "@/lib/videoStartTimes";

interface VideoCardProps {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  videoUrl?: string;
  isIframe?: boolean;
  isYoutube?: boolean;
  variant?: "large" | "small";
  preload?: boolean;
  startTime?: number;
  vimeoId?: string;
}

const buildIframeHoverUrl = (url: string, startTime?: number) => {
  const sep = url.includes("?") ? "&" : "?";
  const base = `${url}${sep}autoplay=1&muted=1&loop=1&background=1&controls=0&title=0&byline=0&portrait=0&dnt=1&responsive=1`;
  return appendVimeoStart(base, startTime);
};

const buildYoutubeHoverUrl = (videoId: string, startTime?: number) => {
  const start = startTime ? `&start=${startTime}` : "";
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1${start}`;
};

export const VideoCard = ({
  id,
  title,
  subtitle,
  thumbnail,
  videoUrl,
  isIframe = false,
  isYoutube = false,
  variant = "small",
  preload = false,
  startTime,
  vimeoId,
}: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const showVideo = isHovered || preload;
  const resolvedStart = startTime ?? getStartTime(videoUrl, vimeoId);

  return (
    <Link
      to={`/video/${id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="video-card">
        <div
          className={`relative overflow-hidden bg-black ${
            variant === "large" ? "aspect-cinema" : "aspect-video"
          }`}
        >
          {!(preload && videoUrl) && (
            <img
              src={thumbnail}
              alt={title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              className={`video-card-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                showVideo && videoUrl ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          {videoUrl && showVideo && (
            isYoutube ? (
              <iframe
                src={buildYoutubeHoverUrl(videoUrl, resolvedStart)}
                loading={preload ? undefined : "lazy"}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                title={title}
              />
            ) : isIframe ? (
              <iframe
                src={buildIframeHoverUrl(videoUrl, resolvedStart)}
                loading={preload ? undefined : "lazy"}
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
                startTime={resolvedStart}
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
