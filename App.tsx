
import React, { useState, useEffect, useCallback } from 'react';
import { TikTokService } from './services/tiktokService';
import { ExtractionState, TikTokMediaResult } from './types';
import Header from './components/Header';
import MediaCard from './components/MediaCard';
import ParticleBackground from './components/ParticleBackground';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<TikTokMediaResult[]>([]);
  const [state, setState] = useState<ExtractionState>({
    loading: false,
    error: null,
    result: null
  });

  const tiktokService = new TikTokService();

  useEffect(() => {
    const saved = localStorage.getItem('tickletools_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const saveToHistory = (item: TikTokMediaResult) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.url !== item.url);
      const updated = [item, ...filtered].slice(0, 5);
      localStorage.setItem('tickletools_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleExtract = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || url;
    
    if (!targetUrl || !targetUrl.includes('tiktok.com')) {
      setState(prev => ({ ...prev, error: "Please enter a valid TikTok link." }));
      return;
    }

    setState({ loading: true, error: null, result: null });

    try {
      const result = await tiktokService.extractMedia(targetUrl);
      setState({ loading: false, error: null, result });
      saveToHistory(result);
    } catch (err: any) {
      setState({ loading: false, error: err.message || "Extraction failed.", result: null });
    }
  };

  const handleReset = useCallback(() => {
    setState({ loading: false, error: null, result: null });
    setUrl('');
  }, []);

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center relative overflow-x-hidden">
      <ParticleBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-5xl px-6 pt-32 pb-20 flex flex-col items-center justify-center relative z-10">
        {!state.result && (
          <div className="text-center mb-12 animate-in slide-in-from-bottom-8 duration-700 w-full">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              Tickle<span className="text-[#8b5cf6]">Tools</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium">
              The professional TikTok downloader for HD video and HQ audio.
            </p>

            <form onSubmit={handleExtract} className="relative w-full max-w-2xl mx-auto group mb-16">
              <div className="absolute -inset-2 bg-[#8b5cf6] rounded-[2.5rem] blur-2xl opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
              <div className="relative flex items-center bg-white/[0.02] backdrop-blur-3xl rounded-[2.2rem] p-2.5 border border-white/10 group-focus-within:border-[#8b5cf6]/30 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste TikTok link here..." 
                  className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-white py-4 px-6 text-lg placeholder:text-white/10 font-medium"
                />
                <button 
                  disabled={state.loading}
                  type="submit"
                  className="relative overflow-hidden bg-[#8b5cf6]/10 backdrop-blur-xl border border-[#8b5cf6]/30 text-white px-10 py-4 rounded-[1.8rem] font-bold transition-all hover:bg-[#8b5cf6]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {state.loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="tracking-wide">DOWNLOAD</span>
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
              {state.error && <p className="text-[#ef4444] mt-4 text-sm font-semibold tracking-wide uppercase italic">{state.error}</p>}
            </form>

            {history.length > 0 && (
              <div className="w-full max-w-2xl mx-auto">
                <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 text-center">Recent Downloads</h3>
                <div className="grid grid-cols-1 gap-3">
                  {history.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleExtract(undefined, item.url)}
                      className="flex items-center gap-5 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all text-left group"
                    >
                      <div className="relative">
                        <img src={item.thumbnail} className="w-12 h-12 rounded-xl object-cover opacity-40 group-hover:opacity-100 transition-all duration-500" alt="" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-bold text-white/80 group-hover:text-white truncate transition-colors">{item.title}</div>
                        <div className="text-[11px] text-[#8b5cf6]/60 font-semibold tracking-wide">{item.author}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {state.loading && (
          <div className="w-full max-w-2xl mx-auto glass-panel rounded-[2.5rem] p-16 text-center border border-white/10 relative">
            <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-[#8b5cf6]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Fetching Video</h3>
            <p className="text-white/30 text-sm font-medium tracking-wide">Connecting to TikTok servers...</p>
          </div>
        )}

        {state.result && !state.loading && (
          <MediaCard data={state.result} onReset={handleReset} />
        )}
      </main>

      <footer className="w-full py-12 px-6 text-center text-white/10 text-[11px] font-bold tracking-[0.5em] uppercase relative z-10">
        TickleTools • TikTok Downloader Tool
      </footer>
    </div>
  );
};

export default App;
