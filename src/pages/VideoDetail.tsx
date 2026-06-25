import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { selectedVideos, filmVideos, musicVideos, commercialVideos } from "@/data/mockVideos";
import { HlsVideo } from "@/components/video/HlsVideo";
import { supabase } from "@/integrations/supabase/client";
import { mapCmsVideo, type CmsVideo } from "@/hooks/usePortfolioContent";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: cmsVideo } = useQuery({
    queryKey: ["video-detail", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos" as never)
        .select("*" as never)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapCmsVideo(data as unknown as CmsVideo) : null;
    },
  });

  const allVideos = [...selectedVideos, ...filmVideos, ...musicVideos, ...commercialVideos];
  const video = cmsVideo || allVideos.find((v) => v.id === id);

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
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-sans text-sm">Back</span>
      </Link>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl">
          <div className="aspect-cinema bg-background/10 rounded overflow-hidden mb-8">
            {(() => {
              const vimeoId = (video as { vimeo_id?: string }).vimeo_id;
              if (vimeoId) {
                return (
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&responsive=true`}
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="w-full h-full border-0"
                    title={video.title}
                  />
                );
              }
              if (!video.videoUrl) {
                return <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />;
              }
              if (video.isYoutube) {
                return (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.videoUrl}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    loading="lazy"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                    title={video.title}
                  />
                );
              }
              if (video.isIframe) {
                return (
                  <iframe
                    src={`${video.videoUrl.startsWith("http") ? video.videoUrl : `https://player.vimeo.com/video/${video.videoUrl}`}?autoplay=1&responsive=true`}
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="w-full h-full border-0"
                    title={video.title}
                  />
                );
              }
              return (
                <HlsVideo
                  src={video.videoUrl}
                  poster={video.title.startsWith("The Bride") ? undefined : video.thumbnail}
                  autoPlay
                  muted={false}
                  controls
                  className="w-full h-full object-contain bg-black"
                  title={video.title}
                />
              );
            })()}
          </div>

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
