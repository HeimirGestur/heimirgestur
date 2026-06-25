import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { musicVideos } from "@/data/mockVideos";

const MusicVideos = () => {
  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] overflow-y-auto px-4 md:px-8 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto w-full">
          <VideoGrid videos={musicVideos} columns={4} preload />
        </div>
      </div>
    </Layout>
  );
};

export default MusicVideos;
