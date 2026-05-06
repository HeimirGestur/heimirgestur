import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { musicVideos } from "@/data/mockVideos";

const MusicVideos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen px-4 md:px-8 lg:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <VideoGrid videos={musicVideos} columns={4} />
        </div>
      </div>
    </Layout>
  );
};

export default MusicVideos;
