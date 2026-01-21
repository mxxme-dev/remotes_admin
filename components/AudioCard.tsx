
import React from 'react';
/* Fix: Use TikTokMediaResult as TikTokAudioResult is not exported from types */
import { TikTokMediaResult } from '../types';

interface Props {
  data: TikTokMediaResult;
  onReset: () => void;
}

const AudioCard: React.FC<Props> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="md:flex">
        <div className="md:w-2/5 relative aspect-square md:aspect-auto">
          <img src={data.thumbnail} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
             <span className="px-2 py-1 bg-[#ff0050] text-xs font-bold rounded uppercase">TikTok Audio</span>
          </div>
        </div>
        <div className="md:w-3/5 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold line-clamp-2">{data.title}</h2>
              <button onClick={onReset} className="text-white/40 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-[#00f2ea] font-medium mb-4">{data.author}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {data.tags?.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/60">{tag}</span>
              ))}
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/5">
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform">
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                    <div className="flex-1">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ff0050] w-1/3"></div>
                        </div>
                    </div>
                    <span className="text-xs font-mono opacity-60">0:12 / {data.duration}</span>
                </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a 
              href={data.audioUrl} 
              download={`${data.title}.mp3`}
              className="flex-1 py-4 bg-gradient-to-r from-[#ff0050] to-[#ff0050]/80 rounded-2xl text-center font-bold text-lg hover:shadow-[0_0_20px_rgba(255,0,80,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download MP3
            </a>
            <button className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;
