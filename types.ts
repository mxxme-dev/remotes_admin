
export interface TikTokMediaResult {
  title: string;
  author: string;
  thumbnail: string;
  audioUrl: string;
  videoUrl: string;
  duration?: string;
  description?: string;
  tags?: string[];
  url?: string; // Original URL for history reference
}

export interface ExtractionState {
  loading: boolean;
  error: string | null;
  result: TikTokMediaResult | null;
}
