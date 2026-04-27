import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { selectedVideos, filmVideos, commercialVideos, type Video as MockVideo } from "@/data/mockVideos";

export type VideoCategory = "selected" | "films" | "commercials" | "music-videos";
export type VideoSourceType = "vimeo" | "cloudinary" | "direct" | "youtube" | "hls";

export type CmsVideo = {
  id: string;
  title: string;
  subtitle: string | null;
  director: string | null;
  production: string | null;
  year: string | null;
  category: VideoCategory;
  source_type: VideoSourceType;
  video_url: string | null;
  hover_video_url: string | null;
  thumbnail_url: string | null;
  vimeo_id: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type PortfolioVideo = MockVideo & {
  year?: string;
  sourceType?: VideoSourceType;
  sortOrder?: number;
  isVisible?: boolean;
};

const fallbackByCategory: Record<VideoCategory, MockVideo[]> = {
  selected: selectedVideos,
  films: filmVideos,
  commercials: commercialVideos,
  "music-videos": [],
};

export const vimeoThumbnail = (vimeoId: string) => `https://vumbnail.com/${vimeoId}.jpg`;

export const mapCmsVideo = (video: CmsVideo): PortfolioVideo => {
  const sourceUrl = video.source_type === "vimeo" ? video.vimeo_id || video.video_url || undefined : video.video_url || undefined;

  return {
    id: video.id,
    title: video.title,
    subtitle: video.subtitle || undefined,
    director: video.director || undefined,
    production: video.production || undefined,
    thumbnail: video.thumbnail_url || (video.vimeo_id ? vimeoThumbnail(video.vimeo_id) : ""),
    videoUrl: sourceUrl,
    isIframe: video.source_type === "vimeo",
    isYoutube: video.source_type === "youtube",
    category: video.category,
    year: video.year || undefined,
    sourceType: video.source_type,
    sortOrder: video.sort_order,
    isVisible: video.is_visible,
  };
};

export const useVideosByCategory = (category: VideoCategory) => {
  return useQuery({
    queryKey: ["portfolio-videos", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos" as never)
        .select("*" as never)
        .eq("category", category)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return ((data || []) as unknown as CmsVideo[]).map(mapCmsVideo);
    },
    placeholderData: fallbackByCategory[category] as PortfolioVideo[],
  });
};

export const useAboutMe = () => {
  return useQuery({
    queryKey: ["about-me"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_me" as never)
        .select("*" as never)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as { id: string; bio: string; updated_at: string } | null;
    },
  });
};

export const useContactPage = () => {
  return useQuery({
    queryKey: ["contact-page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_page" as never)
        .select("*" as never)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Record<string, string> | null;
    },
  });
};
