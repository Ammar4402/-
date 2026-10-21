import React from 'react';
import { Moon, Clock, Bell, Sparkles, CloudRain } from 'lucide-react';
import { ANSWER_TIMES, MEMORIAL_NAME } from '../data/memorialData';

export const TimesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Moon':
        return <Moon className="w-5 h-5 text-amber-500" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Bell':
        return <Bell className="w-5 h-5 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-amber-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section className="py-14 sm:py-16 px-4 bg-[#fcfbf7] border-b border-amber-200/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-300">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>اغتنام مواطن الإجابة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#042e22] mb-3">
            أوقات مباركة يُرجى فيها استجابة الدعاء
          </h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            تذكر فقيدنا المرحوم {MEMORIAL_NAME} في هذه الأوقات الفاضلة التي وعد الله فيها عباده بالإجابة والمغفرة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ANSWER_TIMES.map((time, idx) => (
            <div
              key={idx}
              className="bg-white border border-emerald-100 hover:border-amber-400 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {getIcon(time.iconName)}
              </div>
              <h3 className="text-base font-bold text-[#042e22] mb-2">{time.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{time.description}</p>
            </div>
          ))}

          {/* Special Hadith Card */}
          <div className="bg-gradient-to-br from-[#02241b] to-[#043828] text-white p-5 rounded-2xl border border-amber-400/50 shadow-md flex flex-col justify-center text-center sm:col-span-2 lg:col-span-1">
            <span className="text-amber-300 text-xs font-bold mb-1">حديث الصدقة الجارية والولد الصالح</span>
            <p className="font-quran text-sm text-emerald-100 leading-relaxed">
              &ldquo;إِذَا مَاتَ الإنْسَانُ انْقَطَعَ عنْه عَمَلُهُ إِلَّا مِن ثَلَاثَةٍ: إِلَّا مِن صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو له&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
