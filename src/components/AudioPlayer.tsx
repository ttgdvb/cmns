import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  fallbackUrl?: string;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: "local-track-1",
    name: "Bài nhạc số 1",
    artist: "Giai điệu Lãng mạn 🎵",
    url: "/nhac_1.mp3",
    fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "local-track-2",
    name: "Bài nhạc số 2",
    artist: "Giai điệu Ngọt ngào 💕",
    url: "/nhac_2.mp3",
    fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showPlayerPanel, setShowPlayerPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = tracks[currentTrackIndex];

  // Load custom tracks from localStorage on mount (skip blob URLs from previous sessions)
  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem("birthday_custom_track");
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (parsed && parsed.url && !parsed.url.startsWith("blob:")) {
          setTracks([...DEFAULT_TRACKS, parsed]);
        }
      }
    } catch (e) {
      console.error("Error loading custom track", e);
    }
  }, []);

  // Auto-play workaround for browsers (triggers on first click/tap/scroll)
  useEffect(() => {
    const attemptPlay = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            removeListeners();
          })
          .catch((err) => {
            console.log("Auto-play deferred until user interaction", err);
          });
      }
    };

    const removeListeners = () => {
      window.removeEventListener("click", attemptPlay);
      window.removeEventListener("touchstart", attemptPlay);
      window.removeEventListener("scroll", attemptPlay);
    };

    // Attempt immediately
    setTimeout(attemptPlay, 500);

    // Add fallback interaction listeners
    window.addEventListener("click", attemptPlay);
    window.addEventListener("touchstart", attemptPlay);
    window.addEventListener("scroll", attemptPlay);

    return () => {
      removeListeners();
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Audio play deferred until user interaction", err);
        });
      }
    }
  }, [currentTrackIndex, currentTrack.url]);

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.currentTarget;
    console.warn("Audio playback error:", audio.error?.message || "unsupported format or empty file");
    
    const track = tracks[currentTrackIndex];
    if (track && track.fallbackUrl && track.url !== track.fallbackUrl) {
      console.log(`Track "${track.name}" failed to load. Swapping to online fallback url.`);
      
      // Update tracks state to swap the failed url with fallbackUrl
      setTracks(prevTracks => 
        prevTracks.map((t, idx) => 
          idx === currentTrackIndex 
            ? { ...t, url: t.fallbackUrl!, artist: t.artist + " (Dự phòng 🎵)" }
            : t
        )
      );
      
      // Wait for React to apply state update, then load and play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          if (isPlaying) {
            audioRef.current.play().catch(err => {
              console.log("Play failed for fallback track", err);
            });
          }
        }
      }, 150);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback error:", err);
          audioRef.current?.load();
          audioRef.current?.play().then(() => setIsPlaying(true));
        });
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newTrack: Track = {
      id: "custom-track-" + Date.now(),
      name: customName.trim() || "Nhạc nền tùy chỉnh của bạn",
      artist: "Yêu Thích 🎵",
      url: customUrl.trim(),
    };

    const updatedTracks = [...DEFAULT_TRACKS, newTrack];
    setTracks(updatedTracks);
    localStorage.setItem("birthday_custom_track", JSON.stringify(newTrack));
    setCurrentTrackIndex(updatedTracks.length - 1);
    setCustomUrl("");
    setCustomName("");
    setShowCustomInput(false);
    setIsPlaying(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const newTrack: Track = {
      id: "local-track-" + Date.now(),
      name: file.name.replace(/\.[^/.]+$/, ""), // strip extension
      artist: "Nhạc từ máy của bạn 📱",
      url: objectUrl,
    };

    const updatedTracks = [...tracks, newTrack];
    setTracks(updatedTracks);
    setCurrentTrackIndex(updatedTracks.length - 1);
    setIsPlaying(true);
    setShowCustomInput(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
      />

      {/* Mini Floating Button & Controller */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => setShowPlayerPanel(!showPlayerPanel)}
          className="relative w-14 h-14 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-xl border-2 border-white dark:border-zinc-800 cursor-pointer z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="btn-music-toggle-panel"
        >
          {/* Spinning Vinyl Visual */}
          <motion.div
            className={`absolute inset-0.5 rounded-full border border-dashed border-white/40 bg-zinc-950 flex items-center justify-center overflow-hidden`}
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 6, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          >
            <div className="w-4 h-4 rounded-full bg-brand-accent border border-white flex items-center justify-center z-10">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
            {/* Vinyl groove lines */}
            <div className="absolute inset-2 rounded-full border border-zinc-800" />
            <div className="absolute inset-4 rounded-full border border-zinc-800" />
          </motion.div>

          <Music className="w-5 h-5 text-white/90 z-20 absolute" />

          {/* Soundwave Bars Floating Around */}
          {isPlaying && (
            <div className="absolute -top-1 -right-1 bg-brand-accent text-white rounded-full p-1 border border-white shadow-md flex items-end gap-[2px] h-5 px-1.5 justify-center">
              <span className="w-[2px] bg-white rounded-full animate-[bounce_0.6s_infinite_alternate]" style={{ height: "40%" }} />
              <span className="w-[2px] bg-white rounded-full animate-[bounce_0.6s_infinite_alternate_0.2s]" style={{ height: "80%" }} />
              <span className="w-[2px] bg-white rounded-full animate-[bounce_0.6s_infinite_alternate_0.1s]" style={{ height: "50%" }} />
            </div>
          )}
        </motion.button>

        {/* Dynamic Status Label */}
        <AnimatePresence>
          {!showPlayerPanel && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md py-1 px-3.5 rounded-full shadow-md text-xs font-medium text-brand-accent dark:text-pink-300 border border-brand-ink/10 dark:border-pink-900/30 flex items-center gap-1.5"
            >
              <span>{isPlaying ? "Đang phát:" : "Nhạc nền lãng mạn"}</span>
              <span className="max-w-[120px] truncate text-brand-ink dark:text-zinc-300 font-semibold">{currentTrack.name}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Music Player Panel */}
      <AnimatePresence>
        {showPlayerPanel && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-16 left-0 w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border-2 border-brand-ink/10 dark:border-pink-900/40 z-40"
          >
            {/* Playing Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-xl bg-brand-bg dark:bg-pink-950/40 flex items-center justify-center flex-shrink-0 text-brand-accent">
                <Music className="w-6 h-6" />
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center gap-[3px] bg-black/10 dark:bg-black/30 rounded-xl">
                    <span className="w-[3px] h-6 bg-brand-accent rounded-full animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: "0s" }} />
                    <span className="w-[3px] h-4 bg-brand-accent rounded-full animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: "0.15s" }} />
                    <span className="w-[3px] h-5 bg-brand-accent rounded-full animate-[bounce_0.5s_infinite_alternate]" style={{ animationDelay: "0.3s" }} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-brand-ink dark:text-zinc-100 truncate">{currentTrack.name}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Audio Wave Animation */}
            <div className="h-4 flex items-end justify-center gap-1 mb-4 overflow-hidden px-4">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-[4px] bg-brand-accent rounded-t-full transition-all duration-300`}
                  style={{
                    height: isPlaying ? `${Math.floor(Math.random() * 100) + 10}%` : "15%",
                    transitionDelay: isPlaying ? `${i * 30}ms` : "0ms",
                    animation: isPlaying ? `bounce 0.6s infinite alternate ${i * 40}ms` : "none",
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-brand-accent hover:bg-brand-bg dark:hover:bg-pink-950/20 transition-all cursor-pointer"
                  id="btn-music-mute"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-brand-accent text-white hover:bg-brand-accent-hover transition-all cursor-pointer shadow-md flex items-center justify-center"
                  id="btn-music-play-pause"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-[2px]" />}
                </button>
                <button
                  onClick={handleNext}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-bg text-brand-accent hover:bg-brand-bg/80 dark:bg-pink-950 dark:text-pink-300 dark:hover:bg-pink-900 transition-all cursor-pointer border border-brand-accent/20"
                  id="btn-music-next"
                >
                  Đổi bài
                </button>
              </div>
            </div>

            {/* Playlist Select */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 mb-2 max-h-28 overflow-y-auto space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold block mb-1 px-1">Danh sách phát</span>
              {tracks.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left px-2 py-1 rounded-md text-xs flex items-center justify-between transition-all ${
                    idx === currentTrackIndex
                      ? "bg-brand-bg dark:bg-pink-950/30 text-brand-accent dark:text-pink-300 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <span className="truncate">{track.name}</span>
                  {idx === currentTrackIndex && <Check className="w-3 h-3 text-brand-accent" />}
                </button>
              ))}
            </div>

            {/* Custom URL & Upload Option */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-file-uploader"
              />

              {!showCustomInput ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1.5 px-3 rounded-lg text-xs bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/40 text-brand-accent dark:text-pink-300 flex items-center justify-center gap-1.5 font-semibold cursor-pointer border border-pink-100/50 dark:border-pink-900/30 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tải nhạc của bạn từ máy (MP3, M4A)
                  </button>
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="text-[11px] text-zinc-500 hover:text-brand-accent dark:text-zinc-400 dark:hover:text-pink-300 flex items-center justify-center gap-1 font-medium cursor-pointer transition-all mx-auto"
                  >
                    Hoặc thêm bằng đường link nhạc URL
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddCustomTrack} className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Thêm nhạc từ URL bên ngoài</span>
                  <input
                    type="text"
                    placeholder="Tên bài hát..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                  <input
                    type="url"
                    required
                    placeholder="Nhập đường link trực tiếp (đuôi .mp3)..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                  <div className="flex justify-end gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-2 py-1 rounded bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold cursor-pointer"
                    >
                      Xác nhận
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
