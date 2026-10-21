import React, { useState } from 'react';
import { BookOpen, Copy, Check, Heart, Sparkles, Share2 } from 'lucide-react';
import { DUAS, MEMORIAL_NAME, DuaItem } from '../data/memorialData';

interface DuaSectionProps {
  duaStatsMap: Record<string, number>;
  onIncrementDua: (duaId: string) => void;
  onIncrementGlobal: (amount: number) => void;
  onPlayChime: () => void;
  onShowToast: (msg: string) => void;
  onOpenShareModal: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'جميع الأدعية' },
  { id: 'mercy', label: 'المغفرة والرحمة' },
  { id: 'grave', label: 'نور القبر وتثبيته' },
  { id: 'paradise', label: 'الفردوس والنعيم' },
  { id: 'friday', label: 'أدعية الجمعة' },
  { id: 'patience', label: 'الصبر والسلوان' },
];

export const DuaSection: React.FC<DuaSectionProps> = ({
  duaStatsMap,
  onIncrementDua,
  onIncrementGlobal,
  onPlayChime,
  onShowToast,
  onOpenShareModal,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas =
    selectedCat === 'all' ? DUAS : DUAS.filter((d) => d.category === selectedCat);

  const handleCopy = (dua: DuaItem) => {
    navigator.clipboard.writeText(dua.text);
    setCopiedId(dua.id);
    onShowToast('تم نسخ نص الدعاء بنجاح وجعله الله في ميزان حسناتك');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrayDua = (dua: DuaItem) => {
    onIncrementDua(dua.id);
    onIncrementGlobal(1);
    onPlayChime();
    onShowToast(`تقبل الله دعاءك للمرحوم ${MEMORIAL_NAME} وكتب لك الأجر والمثوبة`);
  };

  return (
    <section id="duaa" className="py-16 sm:py-20 px-4 bg-[#fcfbf7] border-b border-amber-200/60">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>رياض الصالحين والدعاء المستجاب</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042e22] mb-3">
            موسوعة الأدعية المأثورة للمتوفى
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            أدعية نبوية ومأثورة مخرجة ومحققة من السنة النبوية الشريفة، ادعُ بها واهدِ ثوابها لروحه الطاهرة.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#042e22] text-amber-300 shadow-md border border-amber-400'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Duas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDuas.map((dua) => {
            const recitations = duaStatsMap[dua.id] || 0;
            const isCopied = copiedId === dua.id;

            return (
              <div
                key={dua.id}
                className="bg-white border-2 border-emerald-100 hover:border-amber-300 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-bl-full pointer-events-none" />

                <div>
                  {/* Title & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-[#042e22] group-hover:text-amber-800 transition-colors">
                      {dua.title}
                    </h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold shrink-0">
                      {CATEGORIES.find((c) => c.id === dua.category)?.label}
                    </span>
                  </div>

                  {/* Dua Text */}
                  <div className="bg-[#fbfaf5] border border-amber-200/80 rounded-2xl p-5 mb-4 text-center">
                    <p className="font-quran text-lg sm:text-xl text-[#042e22] leading-loose font-normal">
                      &ldquo;{dua.text}&rdquo;
                    </p>
                  </div>

                  {/* Source & Benefit */}
                  <div className="space-y-1 mb-6 text-xs">
                    <p className="text-gray-500 font-medium">
                      <span className="text-amber-800 font-bold">تخريج الدعاء: </span>
                      {dua.source}
                    </p>
                    <p className="text-emerald-800 font-medium">
                      <span className="text-amber-800 font-bold">فضله: </span>
                      {dua.benefit}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
                  {/* Pray button */}
                  <button
                    onClick={() => handlePrayDua(dua)}
                    className="flex-1 bg-gradient-to-r from-[#042e22] to-[#064e3b] hover:from-[#02241b] hover:to-[#043828] text-amber-300 font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-amber-300" />
                    <span>دعوت بهذا الدعاء</span>
                    <span className="bg-emerald-950/60 px-1.5 py-0.5 rounded-md text-[11px] font-normal text-emerald-200">
                      ({recitations.toLocaleString('ar-EG')})
                    </span>
                  </button>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(dua)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                    title="نسخ نص الدعاء"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Share button */}
                  <button
                    onClick={onOpenShareModal}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                    title="مشاركة"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
