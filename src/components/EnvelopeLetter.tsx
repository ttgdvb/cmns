import React, { useState } from "react";
import { Mail, Edit3, Heart, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function EnvelopeLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [letterContent, setLetterContent] = useState<string>(`Sinh nhật vui vẻ nhé, cô em gái thân thiết! 

Chúc em luôn an nhiên, vui vẻ và tìm thấy hạnh phúc trong từng điều nhỏ bé mỗi ngày. 

Đừng tự tạo áp lực cho mình quá, cứ làm tốt công việc và sống trọn vẹn từng khoảnh khắc là trọn vẹn rồi.

Hãy cứ rực rỡ theo cách riêng của em nhé!`);

  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(letterContent);

  const handleSaveEdit = () => {
    setLetterContent(tempContent);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12" id="section-love-letter">
      <div className="text-center mb-10">
        <h2 className="display-text text-brand-ink dark:text-zinc-50 text-4xl sm:text-5xl uppercase tracking-tighter mb-2">
          LÁ THƯ GỬI EM
        </h2>
        <p className="text-xs tracking-widest font-sans uppercase text-brand-accent font-bold mb-4">
          —— CELEBRATORY HANDWRITTEN NOTES ——
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[440px] relative transition-all duration-500">
        
        <div className="relative w-full max-w-md h-[340px] flex items-center justify-center">
          {/* The Envelope wrapper */}
          <div 
            className={`relative w-96 h-64 bg-rose-100 dark:bg-zinc-800 rounded-lg shadow-2xl cursor-pointer transition-all duration-700 select-none z-20 ${
              isOpen ? "translate-y-16" : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
            id="envelope-wrapper"
          >
            {/* Back side of envelope */}
            <div className="absolute inset-0 bg-rose-200 dark:bg-zinc-800 rounded-lg border-b border-rose-300 dark:border-zinc-700 overflow-hidden">
              {/* Triangular shadow inside */}
              <div className="absolute top-0 inset-x-0 h-0 border-t-[128px] border-t-transparent border-x-[192px] border-x-rose-300/20 pointer-events-none" />
            </div>

            {/* The Letter Paper sliding up */}
            <motion.div
              className="absolute left-4 right-4 bg-[#fdfbf7] text-zinc-800 p-6 rounded-md shadow-lg border border-amber-100 font-serif max-h-[360px] overflow-y-auto cursor-auto z-10 scrollbar-thin scrollbar-thumb-pink-200"
              initial={{ y: 20, scale: 0.9, opacity: 0 }}
              animate={isOpen ? { y: -190, scale: 1, opacity: 1, zIndex: 30 } : { y: 20, scale: 0.9, opacity: 0, zIndex: 10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing envelope when clicking inside paper
              id="parchment-letter"
            >
              {/* Custom Heart Seal Header */}
              <div className="flex justify-center mb-4 border-b border-rose-100 pb-2">
                <div className="w-7 h-7 rounded-full bg-brand-accent flex items-center justify-center text-white text-xs shadow">
                  ❤
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    rows={8}
                    className="w-full text-sm font-sans p-2 border border-brand-ink/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-accent bg-white text-zinc-800"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setTempContent(letterContent);
                        setIsEditing(false);
                      }}
                      className="px-2.5 py-1 text-xs rounded bg-zinc-200 text-zinc-700 cursor-pointer font-bold"
                      id="btn-edit-letter-cancel"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-2.5 py-1 text-xs rounded bg-brand-accent hover:bg-brand-accent-hover text-white font-black cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                      id="btn-edit-letter-save"
                    >
                      <Check className="w-3.5 h-3.5" /> Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => {
                      setTempContent(letterContent);
                      setIsEditing(true);
                    }}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full hover:bg-rose-50 text-brand-accent transition-all cursor-pointer"
                    title="Sửa thư chúc mừng"
                    id="btn-edit-letter-start"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-zinc-700 font-serif">
                    {letterContent}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Envelope Flaps (drawn on top of background but below paper unless closed) */}
            {/* Left flap */}
            <div className="absolute inset-y-0 left-0 w-0 border-l-[192px] border-l-rose-250 dark:border-l-zinc-750 border-y-[128px] border-y-transparent z-25" />
            {/* Right flap */}
            <div className="absolute inset-y-0 right-0 w-0 border-r-[192px] border-r-rose-250 dark:border-r-zinc-750 border-y-[128px] border-y-transparent z-25" />
            {/* Bottom flap */}
            <div className="absolute inset-x-0 bottom-0 h-0 border-b-[128px] border-b-rose-300 dark:border-b-zinc-700 border-x-[192px] border-x-transparent z-25" />

            {/* Envelope Top Flap (flips 180 degrees using transformOrigin) */}
            <div 
              className="absolute inset-x-0 top-0 h-0 border-t-[128px] border-t-rose-350 dark:border-t-zinc-600 border-x-[192px] border-x-transparent z-25 transition-transform duration-700 origin-top"
              style={{
                transform: isOpen ? "rotateX(180deg) translateY(2px)" : "rotateX(0deg)",
                transformOrigin: "top",
                zIndex: isOpen ? 5 : 26,
              }}
            />

            {/* Red Wax Seal Sticker in center (when closed) */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-brand-accent flex items-center justify-center shadow-lg border border-red-700 z-30 animate-pulse"
                >
                  <Heart className="w-6 h-6 text-white fill-current" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Prompt below envelope */}
        <p className="mt-4 text-xs font-bold text-brand-accent uppercase tracking-widest animate-bounce cursor-pointer flex items-center gap-1.5" onClick={() => setIsOpen(!isOpen)}>
          <Mail className="w-4 h-4" /> {isOpen ? "Phong thư đang mở • Click để đóng" : "Click để khui thư chúc mừng"}
        </p>
      </div>
    </div>
  );
}
