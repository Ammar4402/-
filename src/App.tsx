import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TasbeehSection } from './components/TasbeehSection';
import { DuaSection } from './components/DuaSection';
import { SurahsSection } from './components/SurahsSection';
import { AudioSection } from './components/AudioSection';
import { TimesSection } from './components/TimesSection';
import { GuestbookSection } from './components/GuestbookSection';
import { ShareModal } from './components/ShareModal';
import { Footer } from './components/Footer';
import { playTasbeehClick, playChimeSuccess } from './lib/sound';
import {
  subscribeToGlobalStats,
  subscribeToMessages,
  subscribeToDuaStats,
  incrementGlobalPrayers,
  incrementGlobalSurahsRead,
  recordUserActionParticipation,
  addVisitorMessage,
  incrementMessageAmen,
  incrementDuaCounter,
  GlobalStatsData,
  VisitorMessageData,
} from './lib/firestoreSync';
import { MEMORIAL_NAME } from './data/memorialData';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firestore Real-Time State - starting strictly at 0
  const [stats, setStats] = useState<GlobalStatsData>({
    totalPrayers: 0,
    totalSurahsRead: 0,
    uniqueSupporters: 0,
  });
  const [messages, setMessages] = useState<VisitorMessageData[]>([]);
  const [duaStatsMap, setDuaStatsMap] = useState<Record<string, number>>({});

  // Setup Firestore real-time listeners
  useEffect(() => {
    const unsubStats = subscribeToGlobalStats((newStats) => {
      setStats(newStats);
    });

    const unsubMessages = subscribeToMessages((newMessages) => {
      setMessages(newMessages);
    });

    const unsubDua = subscribeToDuaStats((map) => {
      setDuaStatsMap(map);
    });

    return () => {
      unsubStats();
      unsubMessages();
      unsubDua();
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Mark this user as an active supporter on their first interaction
  const markActiveSupporter = useCallback(() => {
    const isNew = recordUserActionParticipation();
    if (isNew) {
      setStats((prev) => ({
        ...prev,
        uniqueSupporters: prev.uniqueSupporters + 1,
      }));
    }
  }, []);

  // Instant optimistic counter increments
  const handleIncrementPrayers = useCallback((amount: number = 1) => {
    markActiveSupporter();
    // 1. Instant local update for 0ms lag
    setStats((prev) => ({
      ...prev,
      totalPrayers: prev.totalPrayers + amount,
    }));
    // 2. Queue Firestore sync
    incrementGlobalPrayers(amount);
  }, [markActiveSupporter]);

  const handleIncrementSurahs = useCallback(() => {
    markActiveSupporter();
    setStats((prev) => ({
      ...prev,
      totalSurahsRead: prev.totalSurahsRead + 1,
      totalPrayers: prev.totalPrayers + 10,
    }));
    incrementGlobalSurahsRead();
  }, [markActiveSupporter]);

  const handleHeroSendPrayer = useCallback(() => {
    handleIncrementPrayers(1);
    if (soundEnabled) {
      playChimeSuccess();
    }

    const affirmations = [
      `تقبل الله دعاءك للمرحوم ${MEMORIAL_NAME} وكتب لك الأجر والمثوبة`,
      'اللهم استجب واجعل دعاءك نوراً في قبره وضياءً لروحه',
      'جزاك الله خيراً، الدعاء بظهر الغيب مستجاب وله ملك يقول ولك بمثل',
      'اللهم اغفر له وارحمه وأكرم نزله واجعل مثواه الجنة',
    ];
    const picked = affirmations[Math.floor(Math.random() * affirmations.length)];
    showToast(picked);
  }, [handleIncrementPrayers, soundEnabled, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf7] text-gray-800 relative selection:bg-amber-200 selection:text-emerald-950 scroll-smooth">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto bg-[#042e22] text-amber-300 border border-amber-400 px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold text-center transition-all animate-fade-in">
          <span className="text-sm">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        totalPrayers={stats.totalPrayers}
      />

      {/* Hero Section */}
      <HeroSection
        totalPrayers={stats.totalPrayers}
        totalSurahsRead={stats.totalSurahsRead}
        uniqueSupporters={stats.uniqueSupporters}
        onSendPrayer={handleHeroSendPrayer}
      />

      {/* Digital Subha / Tasbeeh */}
      <TasbeehSection
        soundEnabled={soundEnabled}
        onIncrementGlobal={handleIncrementPrayers}
        onPlayClick={playTasbeehClick}
        onPlayChime={playChimeSuccess}
        onShowToast={showToast}
      />

      {/* Prophetic Memorial Duas */}
      <DuaSection
        duaStatsMap={duaStatsMap}
        onIncrementDua={(duaId) => {
          markActiveSupporter();
          incrementDuaCounter(duaId);
        }}
        onIncrementGlobal={handleIncrementPrayers}
        onPlayChime={playChimeSuccess}
        onShowToast={showToast}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Quran Surahs (Al-Mulk & Ya-Sin) */}
      <SurahsSection
        onIncrementGlobal={handleIncrementPrayers}
        onIncrementSurah={handleIncrementSurahs}
        onPlayChime={playChimeSuccess}
        onShowToast={showToast}
      />

      {/* Full Quran Audio Recitations */}
      <AudioSection
        onIncrementGlobal={handleIncrementPrayers}
        onShowToast={showToast}
      />

      {/* Virtuous Times for Prayer */}
      <TimesSection />

      {/* Memorial Prayer Wall / Guestbook with Live Cloud Sync */}
      <GuestbookSection
        messages={messages}
        onAddMessage={async (name, text) => {
          markActiveSupporter();
          await addVisitorMessage(name, text);
        }}
        onIncrementAmen={(messageId) => {
          markActiveSupporter();
          handleIncrementPrayers(1);
          incrementMessageAmen(messageId);
        }}
        onPlayChime={playChimeSuccess}
        onShowToast={showToast}
      />

      {/* Footer */}
      <Footer />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
