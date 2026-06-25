import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { musicVideos } from "@/data/mockVideos";

const MusicVideos = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center px-4 md:px-8 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto w-full py-16">
          <VideoGrid videos={musicVideos} columns={4} />
        </div>
      </div>
    </Layout>
  );
};

export default MusicVideos;
