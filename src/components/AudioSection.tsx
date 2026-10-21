import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Radio,
  Headphones,
} from 'lucide-react';
import { AUDIO_TRACKS, MEMORIAL_NAME, AudioTrack } from '../data/memorialData';

interface AudioSectionProps {
  onIncrementGlobal: (amount: number) => void;
  onShowToast: (msg: string) => void;
}

export const AudioSection: React.FC<AudioSectionProps> = ({
  onIncrementGlobal,
  onShowToast,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack: AudioTrack = AUDIO_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onIncrementGlobal(1);
          onShowToast(`يُتلى الآن: ${currentTrack.surah} بصوت ${currentTrack.reciter}`);
        })
        .catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % AUDIO_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleEnded = () => {
    if (isLooping) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section id="audio" className="py-16 sm:py-20 px-4 bg-[#fcfbf7] border-b border-amber-200/60">
      <div className="max-w-4xl mx-auto">
        {/* Hidden HTML5 Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.url}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={() => {
            setIsPlaying(false);
            onShowToast('تعذر تشغيل هذا المقطع الصوتي، جاري الانتقال للتالي...');
            setTimeout(handleNext, 1500);
          }}
        />

        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-300">
            <Headphones className="w-3.5 h-3.5 text-amber-700" />
            <span>تلاوات خاشعة وأدعية مهداة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042e22] mb-3">
            المصحف المرتل والتلاوات الصوتية
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            استمع لتلاوات عذبة مع انتقال تلقائي وتشغيل مستمر لجميع السور وإعادة تلقائية مهداة لروح {MEMORIAL_NAME}
          </p>
        </div>

        {/* Main Audio Player Card */}
        <div className="bg-gradient-to-br from-[#02241b] via-[#043828] to-[#02241b] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/50 relative overflow-hidden mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 text-right w-full sm:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                <Radio className={`w-7 h-7 ${isPlaying ? 'animate-pulse text-amber-400' : 'text-amber-200'}`} />
              </div>
              <div>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  يُتلى الآن
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-amber-100 mt-1">
                  {currentTrack.title}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200">
                  بصوت: {currentTrack.reciter}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isLooping
                    ? 'bg-amber-500 text-emerald-950 border-amber-400'
                    : 'bg-black/30 text-gray-300 border-gray-600'
                }`}
                title="إعادة التشغيل التلقائي مفعلة دائمًا"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 mb-6">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-xs text-emerald-300/80 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Playback buttons */}
            <div className="flex items-center gap-4 mx-auto sm:mx-0">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                title="السورة السابقة"
              >
                <SkipForward className="w-5 h-5 rotate-180" />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 flex items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-emerald-950" />
                ) : (
                  <Play className="w-7 h-7 fill-emerald-950 mr-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                title="السورة التالية"
              >
                <SkipBack className="w-5 h-5 rotate-180" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-full sm:w-48">
              <button onClick={toggleMute} className="text-emerald-300 hover:text-white cursor-pointer">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Playlist Tracks List */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-gray-500 mb-2">قائمة التلاوات المتوفرة:</div>
          {AUDIO_TRACKS.map((track, idx) => {
            const isCurrent = currentTrackIndex === idx;
            return (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-900/10 border-amber-500 shadow-md'
                    : 'bg-white border-gray-100 hover:border-emerald-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isCurrent
                        ? 'bg-amber-500 text-emerald-950'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Radio className="w-4 h-4 animate-pulse" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="min-w-0 text-right">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{track.title}</h4>
                    <p className="text-xs text-gray-500">{track.reciter}</p>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    {track.durationApprox}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
