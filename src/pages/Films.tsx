import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useVideosByCategory } from "@/hooks/usePortfolioContent";

const Films = () => {
  const { data: filmVideos = [] } = useVideosByCategory("films");

  return (
    <Layout>
      <div className="min-h-screen px-4 md:px-8 lg:px-16 pt-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <VideoGrid videos={filmVideos} columns={4} />
        </div>
      </div>
    </Layout>
  );
};

export default Films;
