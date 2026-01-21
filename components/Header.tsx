
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 glass-panel border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#4c1d95] rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-[#8b5cf6]/20">T</div>
        <span className="text-2xl font-black tracking-tighter uppercase">Tickle<span className="text-[#8b5cf6]">Tools</span></span>
      </div>
      {/* Navigation and API access buttons removed for a cleaner UI */}
    </header>
  );
};

export default Header;