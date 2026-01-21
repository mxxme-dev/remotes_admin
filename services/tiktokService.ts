
import { GoogleGenAI, Type } from "@google/genai";
import { TikTokMediaResult } from "../types";

export class TikTokService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async extractMedia(url: string): Promise<TikTokMediaResult> {
    const videoId = this.parseVideoId(url);
    if (!videoId) throw new Error("Invalid TikTok URL.");

    try {
      const geminiPromise = this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze TikTok URL: ${url}. Return metadata (title, author, tags) as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "author"]
          }
        }
      });

      const apiResponse = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const apiData = await apiResponse.json();

      if (apiData.code !== 0 || !apiData.data) {
        throw new Error(apiData.msg || "Server error. Try again.");
      }

      const info = apiData.data;
      const metaResponse = await geminiPromise;
      const meta = JSON.parse(metaResponse.text || '{}');

      return {
        title: meta.title || info.title || "TikTok Video",
        author: meta.author || `@${info.author.unique_id}`,
        thumbnail: info.cover,
        audioUrl: info.music,
        videoUrl: info.play, // Direct HD Playback link
        duration: `${info.duration}s`,
        tags: meta.tags || ["#tiktok"],
        description: info.title,
        url: url
      };
    } catch (err: any) {
      console.error("Extraction failed:", err);
      throw new Error(err.message || "Failed to communicate with extraction servers.");
    }
  }

  private parseVideoId(url: string): string | null {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  }
}
