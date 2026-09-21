import React, { useState } from "react";
import { X, QrCode } from "lucide-react";

export default function AppDownloadToast() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Evia Wealth Mobile App"
      className="fixed bottom-5 right-5 z-40 w-[310px] bg-[#0f0f12]/95 backdrop-blur-xl border border-white/12 rounded-2xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group"
    >
      {/* Close button overlapping top-right */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#18181b] border border-white/20 text-neutral-400 hover:text-white flex items-center justify-center transition-colors shadow-md hover:scale-105 cursor-pointer"
        title="Dismiss notice"
        aria-label="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3">
        {/* QR Code White Tile */}
        <div className="shrink-0 w-[56px] h-[56px] bg-white rounded-xl p-1.5 flex flex-col items-center justify-center shadow-inner">
          {/* Stylized QR representation */}
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-0.5 p-0.5 bg-neutral-900 rounded-[6px]">
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
            <div className="bg-black" />
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
            <div className="bg-black" />
            <div className="bg-white rounded-xs" />
            <div className="bg-black" />
            <div className="bg-black" />
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
            <div className="bg-black" />
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[12px] font-semibold text-white leading-tight mb-0.5 line-clamp-2">
            Track all your investments in one place
          </h4>
          <p className="text-[10px] text-neutral-400 mb-2">
            Download Evia Wealth App
          </p>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-medium tracking-wide text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-sm border border-white/5">
              Google Play
            </span>
            <span className="text-[9px] font-medium tracking-wide text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-sm border border-white/5">
              App Store
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
