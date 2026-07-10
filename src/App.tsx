import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ArrowDown, MapPin, Sparkles, Navigation } from "lucide-react";
import EffectsCanvas from "./components/EffectsCanvas";
import AudioPlayer from "./components/AudioPlayer";
import EnvelopeLetter from "./components/EnvelopeLetter";
import PhotoGallery from "./components/PhotoGallery";
import CuteMascot from "./components/CuteMascot";

const blob1 = "M45,-60C58.3,-53,69.2,-40,73.5,-25.2C77.8,-10.3,75.5,6.3,69.5,21.5C63.6,36.7,54,50.3,41,58.3C28,66.3,14,68.7,-0.7,69.7C-15.3,70.7,-30.7,70.3,-43.3,62.7C-56,55,-66,40.1,-71.4,24.1C-76.8,8,-77.7,-9.2,-72.1,-24.1C-66.5,-39,-54.5,-51.7,-40.8,-58.5C-27.1,-65.3,-13.5,-66.3,1.1,-67.8C15.7,-69.3,31.5,-71.2,45,-60Z";
const blob2 = "M48.2,-61.8C61.3,-52.3,69.9,-36.8,72.6,-20.5C75.3,-4.2,72.1,12.8,65.3,28.2C58.5,43.6,48.1,57.3,34.4,65.4C20.6,73.4,3.5,75.8,-13.2,72.4C-30,69,-46.3,59.8,-57.4,46.9C-68.5,34.1,-74.3,17,-73.4,1.1C-72.5,-14.8,-64.8,-29.6,-54,-39.3C-43.2,-49,-29.3,-53.7,-14.8,-59C-0.3,-64.3,14.8,-70.2,30.3,-71.5C45.8,-72.8,35.1,-71.3,48.2,-61.8Z";
const blob3 = "M42.1,-58.6C54.4,-50.2,64.2,-37.8,68.1,-23.4C72,-9,70.1,7.5,65,22.9C59.9,38.3,51.7,52.6,39.1,60.8C26.5,69,9.5,71.1,-6.6,68.8C-22.7,66.5,-37.9,59.8,-49,49.4C-60.1,39,-67.1,24.9,-69.8,9.7C-72.6,-5.5,-71.2,-21.8,-63.9,-34.7C-56.6,-47.6,-43.5,-57.2,-29.9,-64.5C-16.3,-71.8,-2.2,-76.8,11.2,-74.7C24.6,-72.6,29.8,-67,42.1,-58.6Z";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink transition-colors duration-500 font-sans">
      
      {/* 1. INITIAL SURPRISE OVERLAY (Interactive Gate) */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-gradient-to-tr from-brand-accent via-rose-500 to-amber-300 flex flex-col items-center justify-center text-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-sm border-2 border-brand-ink/15 relative"
            >
              {/* Cute visual gift details */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center shadow-lg animate-bounce text-3xl text-white">
                🎁
              </div>

              <h2 className="font-serif font-black text-brand-accent mt-8 mb-3 uppercase tracking-tight" style={{ fontSize: "19px" }}>
                Món Quà Sinh Nhật Bí Mật ✨
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed mb-6 font-sans">
                Nhế nhô nhem, ấn vào nút dưới nhé !!!
              </p>

              <button
                onClick={() => {
                  setIsUnlocked(true);
                  // Play dynamic sound or wake up audio player
                  setTimeout(() => {
                    // Try to trigger audio play button programmatically
                    const playBtn = document.getElementById("btn-music-play-pause");
                    if (playBtn) playBtn.click();
                  }, 1000);
                }}
                className="w-full py-3 bg-brand-accent text-white font-black rounded-lg hover:bg-brand-accent-hover shadow-md transform hover:scale-[1.03] active:scale-95 transition-all cursor-pointer text-sm animate-heartbeat flex items-center justify-center gap-2 uppercase tracking-widest"
                id="btn-unlock-gate"
              >
                <Sparkles className="w-4 h-4" />
                Mở Hộp Quà Ngay ✨
              </button>
            </motion.div>

            {/* Cute sleeping mascot under the gift dialog */}
            <CuteMascot />
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER APP ONLY ONCE UNLOCKED */}
      {isUnlocked && (
        <div className="relative">
          {/* EFFECTS & MUSIC (Global layers) */}
          <EffectsCanvas />
          <AudioPlayer />

          {/* MORPHING BACKGROUND BLOBS */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 dark:opacity-15 z-0 min-h-full">
            <div className="sticky top-0 w-full h-screen overflow-hidden">
              <svg viewBox="-100 -100 200 200" className="w-[600px] h-[600px] absolute -top-48 -left-48 text-brand-accent/30 fill-current filter blur-xl">
                <motion.path
                  animate={{
                    d: [blob1, blob2, blob3, blob1],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </svg>
              <svg viewBox="-100 -100 200 200" className="w-[500px] h-[500px] absolute top-1/3 -right-36 text-amber-200/30 fill-current filter blur-xl">
                <motion.path
                  animate={{
                    d: [blob3, blob1, blob2, blob3],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </svg>
              <svg viewBox="-100 -100 200 200" className="w-[450px] h-[450px] absolute bottom-10 left-1/3 text-rose-200/25 fill-current filter blur-xl">
                <motion.path
                  animate={{
                    d: [blob2, blob3, blob1, blob2],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </div>
          </div>

          {/* FLOATING QUICK NAV RAIL */}
          <div className="fixed top-1/2 -translate-y-1/2 right-4 z-40 hidden md:flex flex-col gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-2.5 rounded-full shadow-xl border border-brand-ink/10">
            <button
              onClick={() => scrollToSection("section-love-letter")}
              className="w-10 h-10 rounded-full flex items-center justify-center text-brand-accent hover:bg-brand-bg dark:hover:bg-zinc-800 cursor-pointer transition-all font-bold text-lg"
              title="Lá Thư Gửi Em"
              id="nav-to-letter"
            >
              ✉
            </button>
            <button
              onClick={() => scrollToSection("section-gallery")}
              className="w-10 h-10 rounded-full flex items-center justify-center text-brand-accent hover:bg-brand-bg dark:hover:bg-zinc-800 cursor-pointer transition-all font-bold text-lg"
              title="Album Ảnh"
              id="nav-to-gallery"
            >
              🖼
            </button>
          </div>

          {/* VINTAGE TOP BAR */}
          <div className="max-w-6xl mx-auto pt-8 px-4 flex justify-between items-baseline border-b border-brand-ink/10 dark:border-zinc-800/60 pb-4 mb-4">
            <div className="text-xs tracking-widest uppercase font-semibold text-brand-ink/80 dark:text-zinc-400">
              For: Huyền Chang • Birthday 11/07
            </div>
            <div className="text-[10px] tracking-widest uppercase font-bold text-brand-accent animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-accent inline-block animate-ping"></span>
              Celebratory Ambient
            </div>
          </div>

          {/* 2. HERO HEADER SECTION */}
          <header className="relative w-full py-16 px-4 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Visual glow background spheres */}
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-200/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl w-full mx-auto text-center relative z-20 space-y-6">
              
              <div className="relative">
                {/* Elegant floating vertical text */}
                <div className="absolute right-0 top-0 vertical-rail opacity-5 hidden xl:block select-none pointer-events-none">
                  <span className="text-[120px] font-black leading-none text-brand-ink dark:text-white">L'AMOUR</span>
                </div>

                <span className="text-brand-accent dark:text-pink-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase block mb-3">
                  Happy Birthday, Huyền Chang 🎈
                </span>

                <h1 className="display-text text-brand-accent text-6xl sm:text-8xl md:text-9xl leading-none">
                  HAPPY
                </h1>
                <h1 className="display-text text-brand-ink dark:text-white text-5xl sm:text-7xl md:text-8xl leading-none -mt-3 sm:-mt-5 flex flex-wrap items-center justify-center gap-4">
                  BIRTHDAY 
                  <span className="text-[10px] sm:text-xs font-semibold font-sans tracking-widest bg-brand-ink dark:bg-white text-white dark:text-brand-ink px-3 py-1.5 ml-1 italic uppercase align-middle rounded-sm">
                    11 / 07 🌸
                  </span>
                </h1>

                <p className="mt-8 max-w-xl mx-auto text-base sm:text-lg italic font-serif text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  "Chúc mừng sinh nhật em !!! Ngày hôm nay là ngày của em, yêu quý bản thân, mở lòng và thật thoải mái, chill hơn nữa nhé "
                </p>
              </div>

            </div>

            <div className="pt-10 animate-bounceslow flex justify-center w-full">
              <button
                onClick={() => scrollToSection("section-love-letter")}
                className="p-3 rounded-full bg-white dark:bg-zinc-900 shadow-md border-2 border-brand-ink/10 dark:border-zinc-800 hover:text-brand-accent cursor-pointer transition-colors"
              >
                <ArrowDown className="w-5 h-5 text-brand-accent" />
              </button>
            </div>
          </header>

          {/* 3. INTERACTIVE MODULES SECTIONS */}
          <main className="space-y-16 pb-24 relative z-20">
            {/* ENVELOPE & AI LETTER */}
            <section className="scroll-mt-20">
              <EnvelopeLetter />
            </section>

            {/* PHOTO ALBUM */}
            <section className="scroll-mt-20 bg-gradient-to-b from-transparent via-pink-50/10 to-transparent dark:via-pink-950/5">
              <PhotoGallery />
            </section>
          </main>

          {/* 4. CELEBRATORY FOOTER */}
          <footer className="w-full py-16 px-4 text-center border-t border-pink-100/50 dark:border-zinc-900/50 bg-white/30 dark:bg-zinc-950/40 backdrop-blur-md relative z-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center mx-auto text-lg shadow-lg">
                ✨
              </div>
              <h3 className="font-serif text-xl italic text-rose-600 dark:text-rose-400 font-bold">
                Chúc em tuổi mới luôn vui vẻ và ngập tràn niềm vui!
              </h3>
              <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 pt-6">
                © {new Date().getFullYear()} • Sweet Birthday Surprise Crafted made by Hưng
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
