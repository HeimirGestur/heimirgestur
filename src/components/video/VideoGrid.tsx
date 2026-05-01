import { VideoCard } from "./VideoCard";

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
}

export const VideoGrid = ({ videos, columns = 4 }: VideoGridProps) => {
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
