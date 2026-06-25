// Map of intro skip start times (seconds) for specific videos.
// Keyed by either Vimeo ID or a substring that identifies the video URL.

const VIMEO_START_TIMES: Record<string, number> = {
  "234761802": 32, // RYBA
  "1096545256": 39, // FLOOD
  "1096566683": 113, // CĆCĆ
  "67522255": 53, // KJÖT
};

const URL_SUBSTRING_START_TIMES: Array<{ match: string; start: number }> = [
  { match: "The%20Bride", start: 4 },
  { match: "The Bride", start: 4 },
  { match: "3cf46997-d5e3-44bb-9eb0-aef9474d9f67", start: 31 }, // Shack
  { match: "dd3ebf2e-c4d1-45aa-b2f4-28555c3612f9", start: 15 }, // Pleśn
];

export const getStartTime = (
  videoUrl?: string,
  vimeoId?: string,
): number | undefined => {
  if (vimeoId && VIMEO_START_TIMES[vimeoId]) return VIMEO_START_TIMES[vimeoId];
  if (videoUrl) {
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch && VIMEO_START_TIMES[vimeoMatch[1]]) {
      return VIMEO_START_TIMES[vimeoMatch[1]];
    }
    for (const { match, start } of URL_SUBSTRING_START_TIMES) {
      if (videoUrl.includes(match)) return start;
    }
  }
  return undefined;
};

export const appendVimeoStart = (url: string, start?: number) => {
  if (!start) return url;
  // Vimeo accepts #t=Ns in URL fragment for player start time
  return `${url}#t=${start}s`;
};
