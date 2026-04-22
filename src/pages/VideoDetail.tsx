import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { selectedVideos, filmVideos, musicVideos, commercialVideos } from "@/data/mockVideos";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the video in all categories
  const allVideos = [...selectedVideos, ...filmVideos, ...musicVideos, ...commercialVideos];
  const video = allVideos.find((v) => v.id === id);

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-sans text-2xl font-medium text-foreground mb-4">
            Video not found
          </h1>
          <Link
            to="/"
            className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground text-primary-foreground">
      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-sans text-sm">Back</span>
      </Link>

      {/* Video Player Area */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl">
          {/* Video/Image Display */}
          <div className="aspect-cinema bg-background/10 rounded overflow-hidden mb-8">
            {video.videoUrl ? (
              <iframe
                src={`${video.videoUrl}${video.videoUrl.includes("?") ? "&" : "?"}autoplay=true&responsive=true`}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="w-full h-full border-0"
                title={video.title}
              />
            ) : (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Video Info */}
          <div className="text-center">
            <h1 className="font-sans text-2xl font-medium text-primary-foreground mb-4">
              {video.title}
            </h1>
            {(video.director || video.production) && (
              <p className="font-sans text-sm text-primary-foreground/60">
                {video.director && <span>Director: {video.director}</span>}
                {video.director && video.production && <span className="mx-4">|</span>}
                {video.production && <span>Production: {video.production}</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
