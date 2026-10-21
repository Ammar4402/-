import React, { useState } from 'react';
import { Heart, BookOpen, Users, Sparkles, Send } from 'lucide-react';
import { MEMORIAL_NAME } from '../data/memorialData';

interface HeroSectionProps {
  totalPrayers: number;
  totalSurahsRead: number;
  uniqueSupporters: number;
  onSendPrayer: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface FloatingAmen {
  id: number;
  x: number;
  y: number;
  text: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalPrayers,
  totalSurahsRead,
  uniqueSupporters,
  onSendPrayer,
}) => {
  const [floatingAmens, setFloatingAmens] = useState<FloatingAmen[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  const handlePrayerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    const phrases = ['آمين يا رب', 'رحمه الله وغفر له', 'تقبل الله', 'في ميزان حسناته', 'اللهم استجب'];
    const text = phrases[Math.floor(Math.random() * phrases.length)];

    const id = Date.now() + Math.random();
    setFloatingAmens((prev) => [...prev.slice(-8), { id, x, y, text }]);

    setTimeout(() => {
      setFloatingAmens((prev) => prev.filter((item) => item.id !== id));
    }, 1800);

    onSendPrayer(e);
  };

  return (
    <section
      id="hero"
      className="bg-islamic-pattern text-white py-14 sm:py-20 px-4 relative overflow-hidden border-b-4 border-amber-500/50"
    >
      {/* Background radial glowing effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Amen elements */}
      {floatingAmens.map((amen) => (
        <div
          key={amen.id}
          className="fixed z-50 pointer-events-none font-bold text-amber-300 text-sm sm:text-base drop-shadow-md animate-float-fade"
          style={{ left: `${amen.x}px`, top: `${amen.y}px` }}
        >
          {amen.text} ✨
        </div>
      ))}

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Quran Verse */}
        <div className="inline-block mb-6 px-6 sm:px-8 py-3 rounded-full bg-black/40 border border-amber-400/40 backdrop-blur-md shadow-lg">
          <p className="font-quran text-lg sm:text-2xl text-amber-200 tracking-wide font-normal leading-relaxed">
            ﴿وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ﴾
          </p>
        </div>

        <h2 className="text-sm sm:text-base md:text-lg font-medium text-emerald-200 mb-3 tracking-wide">
          موقع صدقة جارية ودعاء مستمر عن روح المغفور له بإذن الله تعالى
        </h2>

        {/* Memorial Name Gold Box */}
        <div className="my-6 inline-block relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 rounded-3xl blur opacity-35 group-hover:opacity-75 transition duration-500" />
          <div className="relative bg-[#022c22]/95 border-2 border-amber-400 px-8 sm:px-14 py-6 rounded-3xl shadow-2xl gold-glow backdrop-blur-md">
            <span className="block text-amber-300/80 font-quran text-sm mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <span className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-300 font-quran tracking-wider block drop-shadow-md">
              المرحوم / {MEMORIAL_NAME}
            </span>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-3" />
          </div>
        </div>

        {/* Main Prophetic Dua */}
        <p className="text-emerald-100 max-w-2xl mx-auto text-base sm:text-xl leading-relaxed mb-8 font-quran text-center px-4 font-normal">
          &ldquo;اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ،
          وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ
          الأَبْيَضُ مِنَ الدَّنَسِ.&rdquo;
        </p>

        {/* 3 Real-time Live Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10 text-right">
          {/* Card 1: Prayers */}
          <div className="bg-[#02241b]/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg flex items-center gap-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Heart className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {totalPrayers.toLocaleString('ar-EG')}
              </div>
              <div className="text-xs text-emerald-200 font-semibold">إجمالي الدعوات والتسبيحات</div>
              <div className="text-[10px] text-emerald-400/80">دعوة مسجلة طمعاً في الأجر</div>
            </div>
          </div>

          {/* Card 2: Surahs */}
          <div className="bg-[#02241b]/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg flex items-center gap-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-200">
                {totalSurahsRead.toLocaleString('ar-EG')}
              </div>
              <div className="text-xs text-emerald-200 font-semibold">ختمات وقراءات السور</div>
              <div className="text-[10px] text-emerald-400/80">سورة مهداة لروحه الطاهرة</div>
            </div>
          </div>

          {/* Card 3: Supporters */}
          <div className="bg-[#02241b]/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg flex items-center gap-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {uniqueSupporters.toLocaleString('ar-EG')}
              </div>
              <div className="text-xs text-emerald-200 font-semibold">المحبون والداعون</div>
              <div className="text-[10px] text-emerald-400/80">قلب صادق يدعو له</div>
            </div>
          </div>
        </div>

        {/* Big Interactive Prayer Button */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={handlePrayerClick}
            className={`relative group bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-amber-200 flex items-center gap-3 transition-all duration-200 cursor-pointer ${
              isPressed ? 'scale-95' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <Sparkles className="w-6 h-6 text-emerald-950 animate-pulse" />
            <span className="text-lg sm:text-xl md:text-2xl font-black font-quran">
              آمِين .. ادعُ لـ {MEMORIAL_NAME} بنقرة
            </span>
            <Send className="w-5 h-5 text-emerald-950 rotate-180" />
          </button>
          <span className="text-xs sm:text-sm text-emerald-300/90 mt-3 font-medium">
            كل ضغطة تُحتسب في الميزان كدعوة صادقة وتُهدي نوراً لروحه بإذن الله
          </span>
        </div>
      </div>
    </section>
  );
};
