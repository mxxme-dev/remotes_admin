
import React, { useState } from 'react';
import { TikTokMediaResult } from '../types';

interface Props {
  data: TikTokMediaResult;
  onReset: () => void;
}

const MediaCard: React.FC<Props> = ({ data, onReset }) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = async (type: 'mp3' | 'mp4', url: string) => {
    try {
      setDownloading(type);
      setProgress(10);
      
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error("Stream blocked by CDN");
      
      setProgress(30);
      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') ?? 0);
      
      let receivedLength = 0;
      let chunks = [];
      
      if (reader) {
        while(true) {
          const {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          if (contentLength) {
            setProgress(Math.round((receivedLength / contentLength) * 100));
          }
        }
      }

      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = `${data.author.replace('@','')}_${Date.now()}.${type}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      window.open(url, '_blank');
    } finally {
      setTimeout(() => {
        setDownloading(null);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-700 border border-white/10">
      <div className="md:flex">
        <div className="md:w-5/12 relative aspect-[3/4] md:aspect-auto bg-[#0a0a0a]">
          <img src={data.thumbnail} alt={data.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-transparent to-transparent p-10 flex flex-col justify-end">
            <h2 className="text-3xl font-black text-white mb-2 line-clamp-2 leading-tight">{data.title}</h2>
            <p className="text-[#8b5cf6] font-extrabold text-lg tracking-tight">{data.author}</p>
          </div>
        </div>

        <div className="md:w-7/12 p-12 bg-[#08070b] flex flex-col justify-between">
          <div className="relative">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"></div>
                <span className="text-white/20 text-[11px] font-black uppercase tracking-[0.4em]">Secure Link Decrypted</span>
              </div>
              <button onClick={onReset} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-5">
              <button 
                onClick={() => handleDownload('mp4', data.videoUrl)}
                disabled={!!downloading}
                className="w-full group relative flex items-center justify-between p-7 rounded-[2rem] bg-gradient-to-br from-[#8b5cf6]/10 to-transparent border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/60 transition-all shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#8b5cf6] text-white flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="text-left">
                    <div className="text-base font-black text-white uppercase tracking-wider">Stream Video</div>
                    <div className="text-[11px] text-[#8b5cf6]/60 font-bold uppercase tracking-widest">MP4 • 1080P • RAW</div>
                  </div>
                </div>
                {downloading === 'mp4' ? (
                  <span className="text-sm font-black text-[#8b5cf6]">{progress}%</span>
                ) : (
                  <svg className="w-6 h-6 text-white/10 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                )}
                {downloading === 'mp4' && (
                  <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-[#8b5cf6]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8b5cf6] transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </button>

              <button 
                onClick={() => handleDownload('mp3', data.audioUrl)}
                disabled={!!downloading}
                className="w-full group relative flex items-center justify-between p-7 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black text-lg">HI</div>
                  <div className="text-left">
                    <div className="text-base font-black text-white uppercase tracking-wider">Master Audio</div>
                    <div className="text-[11px] text-white/30 font-bold uppercase tracking-widest">MP3 • 320KBPS • HQ</div>
                  </div>
                </div>
                {downloading === 'mp3' ? (
                  <span className="text-sm font-black text-white/60">{progress}%</span>
                ) : (
                  <svg className="w-6 h-6 text-white/10 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                )}
              </button>
            </div>
          </div>
          <div className="mt-12 text-[10px] text-white/5 text-center uppercase tracking-[0.5em] font-black">TickleTools Encryption Layer Active</div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;