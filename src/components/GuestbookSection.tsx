import React, { useState } from 'react';
import { MessageSquare, Send, Heart, Sparkles, User, Clock } from 'lucide-react';
import { MEMORIAL_NAME } from '../data/memorialData';
import { VisitorMessageData } from '../lib/firestoreSync';

interface GuestbookSectionProps {
  messages: VisitorMessageData[];
  onAddMessage: (name: string, text: string) => Promise<void>;
  onIncrementAmen: (messageId: string) => void;
  onPlayChime: () => void;
  onShowToast: (msg: string) => void;
}

const PRESET_PRAYERS = [
  'اللهم اجعل قبره روضة من رياض الجنة ولا تجعله حفرة من حفر النار.',
  'اللهم أبدله داراً خيراً من داره وأهلاً خيراً من أهله واجمعه بالنبيين في الفردوس.',
  'اللهم انزل على قبره الضياء والنور والفسحة والسرور واغفر له كل ذنب.',
  'اللهم اربط على قلوب أهله ومحبيه وأنزل عليهم سكينة وصبرًا جميلاً.',
];

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  messages,
  onAddMessage,
  onIncrementAmen,
  onPlayChime,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenClickedMap, setAmenClickedMap] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      onShowToast('يرجى كتابة نص الدعاء أولاً');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddMessage(name, text);
      setText('');
      setName('');
      onPlayChime();
      onShowToast(`جزاك الله خيراً! تم نشر دعائك للمرحوم ${MEMORIAL_NAME} في السجل المبارك`);
    } catch {
      onShowToast('حدث خطأ أثناء إرسال الدعاء، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmen = (id: string) => {
    if (amenClickedMap[id]) {
      onShowToast('لقد أمّنت على هذا الدعاء بالفعل، تقبل الله منا ومنكم');
      return;
    }
    setAmenClickedMap((prev) => ({ ...prev, [id]: true }));
    onIncrementAmen(id);
    onPlayChime();
    onShowToast('آمين يا رب العالمين، تقبل الله منا ومنكم');
  };

  const formatMessageDate = (date: Date) => {
    try {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 2) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;

      return date.toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'long',
      });
    } catch {
      return 'حديثاً';
    }
  };

  return (
    <section id="guestbook" className="py-16 sm:py-20 px-4 bg-islamic-subtle border-b border-amber-200/60">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-300">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            <span>كلمات الوفاء والدعاء</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042e22] mb-3">
            سجل دعوات وكلمات المحبين
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            اترك دعاءً طيباً أو كلمة صادقة لروح المغفور له بإذن الله {MEMORIAL_NAME} لتبقى أثراً مستمراً وصدقة جارية.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-100 mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 text-right">
                اسم الداعي (اختياري):
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="مثال: فاعل خير، زميل، صديق، أو اسمك الكريم"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-right bg-[#fbfaf5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 text-right">
                دعاؤك وكلمتك الطيبة لـ {MEMORIAL_NAME}:
              </label>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1000}
                placeholder="اكتب دعاءك الخالص له بالمغفرة والرحمة..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-right bg-[#fbfaf5] leading-relaxed resize-none"
              />
            </div>

            {/* Quick preset chips */}
            <div>
              <span className="block text-[11px] font-bold text-amber-800 mb-1.5 text-right">
                أدعية مقترحة بنقرة زر:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PRAYERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setText(preset)}
                    className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1 rounded-lg transition-colors cursor-pointer text-right"
                  >
                    + {preset.slice(0, 35)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#042e22] via-[#033627] to-[#042e22] hover:from-[#02241b] hover:to-[#043828] text-amber-300 font-bold py-3.5 px-6 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg border border-amber-400 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-amber-300 rotate-180" />
                <span>
                  {isSubmitting
                    ? 'جارٍ تثبيت الدعاء في السحاب...'
                    : 'نشر وتثبيت الدعاء في السجل المبارك'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2 px-1">
            <span>دعوات الزوار الحية ({messages.length}):</span>
            <span>ترتيب حسب الأحدث</span>
          </div>

          {messages.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center text-gray-500">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-sm text-gray-700">السجل جاهز وخالٍ تماماً لاستقبال دعواتكم</p>
              <p className="text-xs text-gray-500 mt-1">
                كن أول من يكتب دعاءً طيباً لروح المغفور له بإذن الله {MEMORIAL_NAME} ليبقى أثراً ونوراً مستمراً.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAmend = amenClickedMap[msg.id];
              return (
                <div
                  key={msg.id}
                  className="bg-white border border-emerald-100 hover:border-amber-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-right"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-bold text-[#042e22]">{msg.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatMessageDate(msg.createdAt)}</span>
                    </div>
                  </div>

                  <p className="font-quran text-base sm:text-lg text-gray-800 leading-relaxed my-3 bg-[#faf9f4] p-3.5 rounded-xl border border-gray-100">
                    &ldquo;{msg.text}&rdquo;
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleAmen(msg.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAmend
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isAmend ? 'fill-white' : 'text-emerald-700'}`} />
                      <span>آمِين</span>
                      <span className="text-[11px] bg-white/40 px-1.5 py-0.2 rounded-md font-normal">
                        ({msg.amenCount})
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
