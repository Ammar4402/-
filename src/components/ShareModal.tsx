import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Share2, Sparkles } from 'lucide-react';
import { MEMORIAL_NAME } from '../data/memorialData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://bahaa-elfeki.ai.studio';
  const shareText = `موقع صدقة جارية ودعاء مستمر عن روح المغفور له بإذن الله تعالى (${MEMORIAL_NAME}). ادعُ له واقرأ القرآن واهدِه ثواب التسبيح: ${currentUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    onShowToast('تم نسخ رابط الصدقة الجارية بنجاح، جزاك الله خيراً');
    setTimeout(() => setCopied(false), 2500);
  };

  const openShare = (platform: 'whatsapp' | 'telegram' | 'twitter' | 'facebook') => {
    let url = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(currentUrl);

    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodedText}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`صدقة جارية عن روح المرحوم ${MEMORIAL_NAME}`)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-300 relative text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-[#042e22]">ساهم في نشر الصدقة الجارية</h3>
          <p className="text-xs text-gray-500 mt-1">الدال على الخير كفاعله</p>
        </div>

        {/* Card Preview */}
        <div className="bg-gradient-to-br from-[#02241b] to-[#043828] text-white p-4 rounded-2xl border border-amber-400/40 mb-6 text-center">
          <Sparkles className="w-4 h-4 text-amber-300 mx-auto mb-1 opacity-80" />
          <div className="font-quran text-lg font-bold text-amber-200">
            صدقة جارية عن روح المرحوم {MEMORIAL_NAME}
          </div>
          <div className="text-xs text-emerald-200 mt-1">
            نسألكم الدعاء له بالرحمة والمغفرة ونور القبور
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            رابط الموقع المباشر:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-600 truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#042e22] hover:bg-[#02241b] text-amber-300'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => openShare('whatsapp')}
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>مشاركة عبر واتساب (WhatsApp)</span>
          </button>
          <button
            onClick={() => openShare('telegram')}
            className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>مشاركة عبر تيليجرام (Telegram)</span>
          </button>
          <button
            onClick={() => openShare('twitter')}
            className="w-full bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة عبر منصة X (تويتر)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
