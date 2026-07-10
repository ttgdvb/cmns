import React, { useState } from "react";
import { Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PolaroidPhoto } from "../types";

const DEFAULT_PHOTOS: PolaroidPhoto[] = [
  {
    id: "photo-1",
    url: "/HC1.jpg",
    caption: "Cứ phải \"thơ\" như thế này thì mới ối anh xin chết 🌿",
  },
  {
    id: "photo-2",
    url: "/HC2.jpeg",
    caption: "Góc nghiêng thần thánh á, e có cái góc nghiêng chết người ấy🍛",
  },
  {
    id: "photo-3",
    url: "/HC3.jpg",
    caption: "Chill girl hả ✨",
  },
  {
    id: "photo-4",
    url: "/HC4.jpeg",
    caption: " OK, ảnh này ko dám nhìn nhiều nên không biết viết cap gì 📸",
  },
];

export default function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Get rotation classes for realistic scatter effect
  const getRotationClass = (index: number) => {
    const rotations = [
      "-rotate-1 sm:-rotate-2 hover:rotate-0",
      "rotate-2 sm:rotate-1 hover:rotate-0",
      "-rotate-2 sm:rotate-2 hover:rotate-0",
      "rotate-1 sm:-rotate-1 hover:rotate-0",
    ];
    return rotations[index % rotations.length];
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12" id="section-gallery">
      <div className="text-center mb-10">
        <h2 className="display-text text-brand-ink dark:text-zinc-50 text-4xl sm:text-5xl uppercase tracking-tighter mb-2">
          ALBUM ẢNH HUYỀN CHANG 🌸
        </h2>
        <p className="text-xs tracking-widest font-sans uppercase text-brand-accent font-bold mb-4">
          —— HUYEN CHANG'S SHINING ALBUM ——
        </p>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
          Nơi lưu giữ những góc hình rạng rỡ, xinh xắn nhất của em và những khoảnh khắc vui tươi bên mọi người.
        </p>
      </div>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        {DEFAULT_PHOTOS.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`bg-[#fdfbf7] p-4 pb-6 rounded shadow-xl border-2 border-brand-ink/10 relative group transition-all duration-300 transform ${getRotationClass(
              index
            )}`}
          >
            {/* Cute Vintage tape at top */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-7 bg-amber-150/40 border border-dashed border-amber-200/50 backdrop-blur-xs rotate-[-2deg] pointer-events-none" />

            {/* Photo Frame Container */}
            <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-850 overflow-hidden relative shadow-inner border border-zinc-150/40">
              <img
                src={photo.url}
                alt="Memory Photo"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Overlay tools */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setLightboxIndex(index)}
                  className="p-2 bg-white/95 text-brand-accent hover:text-white hover:bg-brand-accent rounded-full shadow-lg transition-all cursor-pointer"
                  title="Phóng to xem nét"
                >
                  <Maximize2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Caption Text styled like handwritten pen */}
            <div className="mt-4 text-center font-serif text-sm text-amber-950 px-1 font-semibold min-h-[40px] flex items-center justify-center italic">
              {photo.caption}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150] flex flex-col items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-pink-400 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing lightbox when clicking image
              className="bg-white p-4 pb-8 rounded-sm shadow-2xl border border-amber-50 relative w-full max-w-2xl text-zinc-800 cursor-auto"
            >
              {/* Tape visual inside lightbox too */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-8 bg-amber-150/40 border border-dashed border-amber-200/50 backdrop-blur-xs rotate-[-1deg]" />

              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900 border border-zinc-150/20">
                <img
                  src={DEFAULT_PHOTOS[lightboxIndex].url}
                  alt="Zoomed memory"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Caption text */}
              <p className="mt-5 text-center font-serif text-lg text-amber-950 font-bold italic px-2">
                {DEFAULT_PHOTOS[lightboxIndex].caption}
              </p>

              {/* Navigation arrows */}
              <div className="absolute inset-y-1/2 left-0 right-0 flex justify-between px-2 sm:-mx-16 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : DEFAULT_PHOTOS.length - 1));
                  }}
                  className="p-3 bg-black/60 hover:bg-pink-500 text-white rounded-full transition-all shadow-md cursor-pointer pointer-events-auto"
                >
                  ◀
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev !== null && prev < DEFAULT_PHOTOS.length - 1 ? prev + 1 : 0));
                  }}
                  className="p-3 bg-black/60 hover:bg-pink-500 text-white rounded-full transition-all shadow-md cursor-pointer pointer-events-auto"
                >
                  ▶
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
