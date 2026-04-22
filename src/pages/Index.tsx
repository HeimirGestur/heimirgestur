import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SelectedVideoCard } from "@/components/video/SelectedVideoCard";
import { ProgressBar } from "@/components/video/ProgressBar";
import { selectedVideos } from "@/data/mockVideos";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <Layout>
      <div ref={containerRef} className="min-h-screen">
        {/* Video Stack */}
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
                videoUrl={video.videoUrl}
                isActive={activeIndex === index}
                onProgress={activeIndex === index ? setProgress : undefined}
              />
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
          <ProgressBar
            progress={progress}
            segments={selectedVideos.length}
            activeSegment={activeIndex}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
