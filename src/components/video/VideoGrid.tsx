import { VideoCard } from "./VideoCard";
import { StackedVideoCard } from "./StackedVideoCard";

interface Video {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  videoUrl?: string;
  hover_video_url?: string;
  isIframe?: boolean;
  isYoutube?: boolean;
}

interface VideoGridProps {
  videos: Video[];
  columns?: 2 | 3 | 4;
  layout?: "grid" | "stack";
}

export const VideoGrid = ({ videos, columns = 4, layout = "grid" }: VideoGridProps) => {
  if (layout === "stack") {
    return (
      <div className="flex flex-col items-center gap-12 md:gap-16 max-w-3xl mx-auto">
        {videos.map((video) => (
          <StackedVideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            subtitle={video.subtitle}
            thumbnail={video.thumbnail}
            videoUrl={video.hover_video_url || video.videoUrl}
            isIframe={video.isIframe}
            isYoutube={video.isYoutube}
          />
        ))}
      </div>
    );
  }

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          subtitle={video.subtitle}
          thumbnail={video.thumbnail}
          videoUrl={video.hover_video_url || video.videoUrl}
          isIframe={video.isIframe}
          isYoutube={video.isYoutube}
          variant="small"
        />
      ))}
    </div>
  );
};
