import React from 'react';
import { Heart, ArrowUp, Cloud } from 'lucide-react';
import { MEMORIAL_NAME } from '../data/memorialData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#02241b] via-[#011a13] to-[#01140f] text-white py-12 px-4 border-t-2 border-amber-500/40 text-center relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-radial from-amber-500/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Islamic Ornament Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-950 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-lg mx-auto mb-5">
          <Heart className="w-6 h-6 fill-amber-400 text-amber-400" />
        </div>

        <h3 className="font-quran text-2xl sm:text-3xl font-black text-amber-300 mb-2">
          صدقة جارية عن روح المرحوم {MEMORIAL_NAME}
        </h3>

        <p className="font-quran text-emerald-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-6 font-normal">
          &ldquo;اللَّهُمَّ اجْعَلْ هَذَا الْعَمَلَ خَالِصاً لِوَجْهِكَ الْكَرِيمِ، وَتَقَبَّلْهُ صَدَقَةً جَارِيَةً
          وَنُوراً فِي قَبْرِهِ إِلَى يَوْمِ الدِّينِ، وَارْحَمْ أَمْوَاتَنَا وَأَمْوَاتَ الْمُسْلِمِينَ
          أَجْمَعِينَ.&rdquo;
        </p>

        {/* Cloud Connection Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs text-emerald-300 mb-8 shadow-inner">
          <Cloud className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>مربوط سحابياً بقاعدة بيانات Google Cloud Firestore الحية ومحدث للجميع فوراً</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-emerald-900/60 text-xs text-emerald-300/80">
          <div>
            جميع الحقوق محفوظة لكل من ساهم بالدعاء والنشر • الدال على الخير كفاعله
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl transition-colors text-amber-200 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>العودة للأعلى</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
