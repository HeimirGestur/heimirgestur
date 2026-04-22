import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import film4 from "@/assets/film-4.jpg";
import film5 from "@/assets/film-5.jpg";
import film6 from "@/assets/film-6.jpg";

export interface Video {
  id: string;
  title: string;
  subtitle?: string;
  director?: string;
  production?: string;
  thumbnail: string;
  videoUrl?: string; // HLS .m3u8 URL or iframe embed URL
  isIframe?: boolean; // true if videoUrl should be loaded in an <iframe> instead of <video>
  category: "selected" | "films" | "music-videos" | "commercials";
}

const HLS_BASE = "https://vz-7b18eadc-f58.b-cdn.net";
const IFRAME_LIBRARY_ID = "642892";

const hls = (guid: string) => `${HLS_BASE}/${guid}/playlist.m3u8`;
const thumb = (guid: string) => `${HLS_BASE}/${guid}/thumbnail.jpg`;
const iframeEmbed = (guid: string) =>
  `https://iframe.mediadelivery.net/embed/${IFRAME_LIBRARY_ID}/${guid}`;

// Bunny Stream GUIDs
const G = {
  kjot: "3c367d6e-a39a-40e9-97fb-eabf94cfec6b",
  grace: "98b41c6d-f706-482e-886c-1f6a28e012b4",
  meal: "4031a81d-a2f6-4e2b-ad38-686e7a6bcc8d",
  haiku: "2ea95e66-8cb7-4e49-a897-69e0bb2d2ada",
  bobby: "6c6b72ee-6b9e-45c1-a916-74dddbdaa718",
  cccc: "82d00c82-e06f-4a10-a9a0-0418b36cd2f8",
  flood: "f12d3b52-f37e-404b-83be-ba468d0c3aab",
  plesn: "dd3ebf2e-c4d1-45aa-b2f4-28555c3612f9",
  shack: "3cf46997-d5e3-44bb-9eb0-aef9474d9f67",
  bride: "1132130d-c020-405f-9103-a25553cb56c4",
};

// Fallback thumbnails (kept for cases where Bunny thumbnail isn't generated yet)
const fallbackThumbs = [film1, film2, film3, film4, film5, film6];

export const selectedVideos: Video[] = [
  { id: "1", title: "Kjöt", thumbnail: thumb(G.kjot), videoUrl: hls(G.kjot), category: "selected" },
  { id: "2", title: "Grace", thumbnail: thumb(G.grace), videoUrl: hls(G.grace), category: "selected" },
  { id: "3", title: "Meal", thumbnail: thumb(G.meal), videoUrl: hls(G.meal), category: "selected" },
  { id: "4", title: "Haiku", thumbnail: thumb(G.haiku), videoUrl: hls(G.haiku), category: "selected" },
  { id: "5", title: "Bobby", thumbnail: thumb(G.bobby), videoUrl: hls(G.bobby), category: "selected" },
  { id: "6", title: "The Bride", thumbnail: thumb(G.bride), videoUrl: iframeEmbed(G.bride), isIframe: true, category: "selected" },
];

export const filmVideos: Video[] = [
  { id: "f1", title: "Kjöt", thumbnail: thumb(G.kjot), videoUrl: hls(G.kjot), category: "films" },
  { id: "f2", title: "Grace", thumbnail: thumb(G.grace), videoUrl: hls(G.grace), category: "films" },
  { id: "f3", title: "Meal", thumbnail: thumb(G.meal), videoUrl: hls(G.meal), category: "films" },
  { id: "f4", title: "Haiku", thumbnail: thumb(G.haiku), videoUrl: hls(G.haiku), category: "films" },
  { id: "f5", title: "Bobby", thumbnail: thumb(G.bobby), videoUrl: hls(G.bobby), category: "films" },
  { id: "f6", title: "The Bride", thumbnail: thumb(G.bride), videoUrl: iframeEmbed(G.bride), isIframe: true, category: "films" },
];

export const musicVideos: Video[] = [
  { id: "mv1", title: "CĆCĆ", thumbnail: thumb(G.cccc), videoUrl: hls(G.cccc), category: "music-videos" },
  { id: "mv2", title: "Flood", thumbnail: thumb(G.flood), videoUrl: hls(G.flood), category: "music-videos" },
  { id: "mv3", title: "Pleśn", thumbnail: thumb(G.plesn), videoUrl: hls(G.plesn), category: "music-videos" },
  { id: "mv4", title: "The Shack", thumbnail: thumb(G.shack), videoUrl: hls(G.shack), category: "music-videos" },
];

export const commercialVideos: Video[] = [
  { id: "c1", title: "Haiku", thumbnail: thumb(G.haiku), videoUrl: hls(G.haiku), category: "commercials" },
  { id: "c2", title: "Meal", thumbnail: thumb(G.meal), videoUrl: hls(G.meal), category: "commercials" },
  { id: "c3", title: "Bobby", thumbnail: thumb(G.bobby), videoUrl: hls(G.bobby), category: "commercials" },
  { id: "c4", title: "Grace", thumbnail: thumb(G.grace), videoUrl: hls(G.grace), category: "commercials" },
];

export { fallbackThumbs };
