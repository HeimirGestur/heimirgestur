import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { musicVideos } from "@/data/mockVideos";

const MusicVideos = () => {
  return (
    <Layout>
      <div className="min-h-screen px-4 md:px-8 lg:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <VideoGrid videos={musicVideos} layout="stack" />
        </div>
      </div>
    </Layout>
  );
};

export default MusicVideos;
