import React from 'react';
import { Volume2, VolumeX, Share2, Heart, Sparkles } from 'lucide-react';
import { MEMORIAL_NAME } from '../data/memorialData';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShareModal: () => void;
  totalPrayers: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenShareModal,
  totalPrayers,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#02241b] via-[#043828] to-[#02241b] text-white border-b border-amber-500/30 sticky top-0 z-40 shadow-xl backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-950 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md shrink-0">
            <svg className="w-5 h-5 text-amber-300 drop-shadow" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2l2.3 2.7 3.5-.6.7 3.5 3.3 1.5-1.5 3.3 2.7 2.3-2.7 2.3 1.5 3.3-3.3 1.5-.7 3.5-3.5-.6L12 22l-2.3-2.7-3.5.6-.7-3.5-3.3-1.5 1.5-3.3L1 9.3l2.7-2.3-1.5-3.3 3.3-1.5.7-3.5 3.5.6L12 2z"
                opacity="0.9"
              />
              <circle cx="12" cy="12" r="3" fill="#02241b" />
              <circle cx="12" cy="12" r="1.5" fill="#fcd34d" />
            </svg>
          </div>
          <div className="flex flex-col text-right justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base md:text-lg font-black text-amber-100 tracking-normal leading-tight truncate">
                صدقة جارية
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                دعاء مستمر
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200/95 font-medium leading-tight mt-0.5 truncate">
              عن روح المرحوم {MEMORIAL_NAME}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-emerald-100">
          <a href="#hero" className="hover:text-amber-300 transition-colors">
            الرئيسية
          </a>
          <a href="#tasbeeh" className="hover:text-amber-300 transition-colors">
            السبحة
          </a>
          <a href="#duaa" className="hover:text-amber-300 transition-colors">
            الأدعية
          </a>
          <a href="#surahs" className="hover:text-amber-300 transition-colors">
            قراءة السور
          </a>
          <a href="#audio" className="hover:text-amber-300 transition-colors">
            التلاوات
          </a>
          <a href="#guestbook" className="hover:text-amber-300 transition-colors">
            سجل الدعوات
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Live counter pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-700/50 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 shadow-inner">
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{totalPrayers.toLocaleString('ar-EG')}</span>
            <span className="text-[10px] text-emerald-300 font-normal">دعوة</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'كتم الصوت التفاعلي' : 'تفعيل الصوت التفاعلي'}
            title={soundEnabled ? 'الصوت التفاعلي مفعّل' : 'الصوت التفاعلي مكتوم'}
            className={`p-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              soundEnabled
                ? 'bg-emerald-900/80 border-emerald-600 text-amber-300 hover:bg-emerald-800'
                : 'bg-black/40 border-gray-700 text-gray-400 hover:bg-black/60'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-amber-300/40 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">مشاركة الأجر</span>
            <span className="xs:hidden">مشاركة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
