import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SelectedVideoCard } from "@/components/video/SelectedVideoCard";
import { ProgressBar } from "@/components/video/ProgressBar";
import { useVideosByCategory } from "@/hooks/usePortfolioContent";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: selectedVideos = [] } = useVideosByCategory("selected");

  useEffect(() => {
    document.documentElement.classList.add("selected-scroll-snap");
    return () => document.documentElement.classList.remove("selected-scroll-snap");
  }, []);

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

  const scrollToVideo = (index: number) => {
    const video = containerRef.current?.querySelector(`[data-video-index="${index}"]`);
    video?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      <div ref={containerRef} className="min-h-screen snap-y snap-mandatory">
        <div className="px-4 md:px-8">
          {selectedVideos.map((video, index) => (
            <div
              key={video.id}
              data-video-index={index}
              className="animate-fade-in-up mx-auto flex h-screen w-full max-w-[min(65vw,900px)] snap-start flex-col justify-center py-16"
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
                muted={isMuted}
                onToggleMuted={() => setIsMuted((v) => !v)}
                onProgress={activeIndex === index ? setProgress : undefined}
                progressBar={
                  <ProgressBar progress={activeIndex === index ? progress : 0} />
                }
                showInfo
              />
            </div>
          ))}
        </div>
        <nav className="fixed right-5 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3" aria-label="Selected videos">
          {selectedVideos.map((video, index) => (
            <button
              key={video.id}
              type="button"
              onClick={() => scrollToVideo(index)}
              aria-label={`Go to ${video.title}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                activeIndex === index ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground"
              }`}
            />
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setIsMuted((value) => !value)}
          className="fixed bottom-9 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-background shadow-2xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-destructive align-middle" />
          Sound {isMuted ? "off" : "on"}
        </button>
      </div>
    </Layout>
  );
};

export default Index;
