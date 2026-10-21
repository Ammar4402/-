import React, { useState, useCallback } from 'react';
import { RotateCcw, Sparkles, CheckCircle, Heart } from 'lucide-react';
import { DHIKR_LIST, MEMORIAL_NAME, DhikrItem } from '../data/memorialData';

interface TasbeehSectionProps {
  soundEnabled: boolean;
  onIncrementGlobal: (amount: number) => void;
  onPlayClick: () => void;
  onPlayChime: () => void;
  onShowToast: (msg: string) => void;
}

export const TasbeehSection: React.FC<TasbeehSectionProps> = ({
  soundEnabled,
  onIncrementGlobal,
  onPlayClick,
  onPlayChime,
  onShowToast,
}) => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(DHIKR_LIST[0]);
  const [customText, setCustomText] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [count, setCount] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const targetCount = isCustom ? 33 : selectedDhikr.targetCount;
  const progressPercent = Math.min(100, (count / targetCount) * 100);

  const handleTasbeehClick = useCallback(() => {
    // Instant visual micro-feedback
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 80);

    if (soundEnabled) {
      onPlayClick();
    }

    // Immediately and directly increment the global live counter!
    onIncrementGlobal(1);

    setCount((prev) => {
      const next = prev + 1;
      if (next >= targetCount) {
        setCompletedRounds((r) => r + 1);
        if (soundEnabled) {
          onPlayChime();
        }
        onShowToast(`أتممت دورة تسبيح (${targetCount} مرة) كصدقة جارية لروح ${MEMORIAL_NAME}`);
        return 0;
      }
      return next;
    });
  }, [soundEnabled, onPlayClick, onPlayChime, onIncrementGlobal, targetCount, onShowToast]);

  const handleReset = () => {
    setCount(0);
    onShowToast('تمت إعادة ضبط عداد الدورة الحالية');
  };

  return (
    <section id="tasbeeh" className="py-14 sm:py-18 px-4 bg-islamic-subtle border-b border-amber-200/60 select-none">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>صدقة الذكر والاستغفار</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042e22] mb-2.5">
            السبحة الإلكترونية المباركة
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            سبح واذكر الله في خلوتك، وكل تسبيحة تُسجل وتُهدى لروح المغفور له بإذن الله {MEMORIAL_NAME} مباشرةً
          </p>
        </div>

        {/* Dhikr Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {DHIKR_LIST.map((dhikr) => {
            const active = !isCustom && selectedDhikr.id === dhikr.id;
            return (
              <button
                key={dhikr.id}
                onClick={() => {
                  setIsCustom(false);
                  setSelectedDhikr(dhikr);
                  setCount(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#042e22] text-amber-300 shadow-md border border-amber-400'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200 shadow-xs'
                }`}
              >
                {dhikr.title}
              </button>
            );
          })}
          <button
            onClick={() => {
              setIsCustom(true);
              setCount(0);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isCustom
                ? 'bg-[#042e22] text-amber-300 shadow-md border border-amber-400'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200 shadow-xs'
            }`}
          >
            ذكر مخصص
          </button>
        </div>

        {/* Custom Input */}
        {isCustom && (
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="اكتب الذكر أو الدعاء الذي تود التسبيح به..."
              className="w-full text-center px-4 py-2.5 rounded-xl border-2 border-emerald-300 focus:border-emerald-600 focus:outline-none bg-white text-gray-800 text-sm shadow-sm"
            />
          </div>
        )}

        {/* Current Dhikr Display Card */}
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-md max-w-xl mx-auto mb-8 text-center relative overflow-hidden">
          <div className="text-amber-800 font-bold text-xs mb-1.5">الذكر الحالي:</div>
          <div className="font-quran text-xl sm:text-2xl md:text-3xl font-bold text-[#042e22] leading-relaxed mb-2.5">
            {isCustom ? customText || 'سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ' : selectedDhikr.fullText}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            {isCustom ? 'ذكر الله تعالى يملأ الميزان نوراً' : selectedDhikr.meaning}
          </p>
        </div>

        {/* The Digital Counter Button & Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Circular Progress Indicator */}
            <svg className="w-full h-full -rotate-90 transform pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-emerald-100"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-amber-500"
                strokeWidth="5"
                strokeDasharray={263.89}
                strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner High-Speed Touch & Click Button */}
            <button
              onClick={handleTasbeehClick}
              className={`absolute inset-5 rounded-full bg-gradient-to-br from-[#042e22] via-[#02241b] to-[#043828] text-white flex flex-col items-center justify-center shadow-xl border-4 border-amber-400 group cursor-pointer transition-transform duration-75 active:scale-95 ${
                isPressed ? 'scale-95 brightness-110' : ''
              }`}
              style={{ touchAction: 'manipulation' }}
              aria-label="تسبيح"
            >
              <span className="text-5xl sm:text-6xl font-black text-amber-300 tracking-wider font-mono">
                {count}
              </span>
              <span className="text-xs sm:text-sm text-emerald-200 font-semibold mt-1">
                الهدف: {targetCount}
              </span>
              <span className="text-[11px] text-amber-300/90 mt-1 bg-black/40 px-3 py-0.5 rounded-full">
                اضغط للتسبيح
              </span>
            </button>
          </div>

          {/* Stats & Actions under Counter */}
          <div className="flex items-center gap-3 mt-6">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 shadow-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>الدورات المكتملة: {completedRounds}</span>
            </div>

            <button
              onClick={handleReset}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 hover:text-gray-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="إعادة ضبط العداد"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير</span>
            </button>
          </div>

          {/* Live Automatic Sync Assurance Badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-emerald-950/90 text-amber-200 border border-emerald-700/60 px-5 py-2.5 rounded-2xl text-xs font-medium shadow-sm">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <span>كل تسبيحة تُضاف تلقائياً للمجموع العام في السحاب دون الحاجة لأي خطوة إضافية</span>
          </div>
        </div>
      </div>
    </section>
  );
};
