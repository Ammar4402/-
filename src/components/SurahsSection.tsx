import React, { useState } from 'react';
import { BookOpen, CheckCircle, Sparkles, Plus, Minus } from 'lucide-react';
import { SURAH_MULK, SURAH_YASEEN, MEMORIAL_NAME } from '../data/memorialData';

interface SurahsSectionProps {
  onIncrementGlobal: (amount: number) => void;
  onIncrementSurah: () => void;
  onPlayChime: () => void;
  onShowToast: (msg: string) => void;
}

export const SurahsSection: React.FC<SurahsSectionProps> = ({
  onIncrementGlobal,
  onIncrementSurah,
  onPlayChime,
  onShowToast,
}) => {
  const [selectedSurahId, setSelectedSurahId] = useState<'mulk' | 'yaseen'>('mulk');
  const [fontSize, setFontSize] = useState<number>(24);

  const activeSurah = selectedSurahId === 'mulk' ? SURAH_MULK : SURAH_YASEEN;

  const handleFinishReading = () => {
    onIncrementSurah();
    onIncrementGlobal(10);
    onPlayChime();
    onShowToast(`تقبل الله تلاوتك! أُهدي ثواب قراءة ${activeSurah.name} لروح المرحوم ${MEMORIAL_NAME}`);
  };

  return (
    <section id="surahs" className="py-16 sm:py-20 px-4 bg-islamic-subtle border-b border-amber-200/60">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>تلاوة القرآن الكريم وإهداء الأجر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042e22] mb-3">
            قراءة السور المباركة للمتوفى
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            اقرأ سورة الملك المنجية من عذاب القبر أو سورة يس بخشوع، واهدِ أجر هذه الحروف الطاهرة لروح المرحوم {MEMORIAL_NAME}
          </p>
        </div>

        {/* Controls: Surah Switcher & Font Size */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-md mb-6">
          {/* Surah Switcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedSurahId('mulk')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedSurahId === 'mulk'
                  ? 'bg-[#042e22] text-amber-300 shadow-md border border-amber-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              سورة الملك (المنجية)
            </button>
            <button
              onClick={() => setSelectedSurahId('yaseen')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedSurahId === 'yaseen'
                  ? 'bg-[#042e22] text-amber-300 shadow-md border border-amber-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              سورة يس (قلب القرآن)
            </button>
          </div>

          {/* Font Size controls */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <span>حجم الخط:</span>
            <button
              onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              title="تصغير الخط"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-gray-800">{fontSize}</span>
            <button
              onClick={() => setFontSize((prev) => Math.min(36, prev + 2))}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              title="تكبير الخط"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Surah Reading Paper Container */}
        <div className="bg-[#fffef9] border-2 border-amber-300/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
          {/* Header of Surah */}
          <div className="text-center mb-8 border-b-2 border-dashed border-amber-200 pb-6">
            <h3 className="font-quran text-2xl sm:text-3xl font-bold text-[#042e22] mb-1">
              {activeSurah.name}
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              {activeSurah.placeOfRevelation} • {activeSurah.numberOfAyahs} آية
            </p>
            <div className="mt-3 bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 max-w-lg mx-auto text-xs text-amber-900 leading-relaxed font-medium">
              {activeSurah.benefit}
            </div>

            {/* Basmalah */}
            <div className="mt-6 font-quran text-xl sm:text-2xl text-emerald-950 font-bold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* Verses Text */}
          <div
            className="font-quran text-[#042e22] text-justify leading-loose space-y-4"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
          >
            {activeSurah.verses.map((v) => (
              <span key={v.number} className="inline font-normal">
                {v.text}{' '}
                <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-500/50 bg-amber-50/80 text-amber-800 text-xs sm:text-sm font-bold mx-1 align-middle select-none">
                  {v.number.toLocaleString('ar-EG')}
                </span>{' '}
              </span>
            ))}
          </div>

          {/* Completion Button */}
          <div className="mt-10 pt-6 border-t-2 border-dashed border-amber-200 text-center">
            <button
              onClick={handleFinishReading}
              className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-800 text-amber-300 font-bold px-8 py-4 rounded-2xl text-base shadow-xl border border-amber-400 flex items-center gap-2.5 mx-auto active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle className="w-5 h-5 text-amber-300" />
              <span>أتممت القراءة وأهديت ثوابها لـ {MEMORIAL_NAME}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
