import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SelectedVideoCard } from "@/components/video/SelectedVideoCard";
import { ProgressBar } from "@/components/video/ProgressBar";
import { useVideosByCategory } from "@/hooks/usePortfolioContent";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: selectedVideos = [] } = useVideosByCategory("selected");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const videos = containerRef.current.querySelectorAll("[data-video-index]");
      const viewportCenter = window.innerHeight / 2;
      
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      videos.forEach((video, index) => {
        const rect = video.getBoundingClientRect();
        const videoCenter = rect.top + rect.height / 2;
        const distance = Math.abs(videoCenter - viewportCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedVideos.length]);

  return (
    <Layout>
      <div ref={containerRef} className="min-h-screen">
        <div className="space-y-32 px-4 md:px-8 lg:px-16 py-16">
          {selectedVideos.map((video, index) => (
            <div
              key={video.id}
              data-video-index={index}
              className="animate-fade-in-up max-w-5xl mx-auto"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SelectedVideoCard
                id={video.id}
                title={video.title}
                director={video.director}
                production={video.production}
                thumbnail={video.thumbnail}
                videoUrl={video.hover_video_url || video.videoUrl}
                isIframe={video.isIframe}
                isActive={activeIndex === index}
                onProgress={activeIndex === index ? setProgress : undefined}
                progressBar={
                  <ProgressBar progress={activeIndex === index ? progress : 0} />
                }
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
