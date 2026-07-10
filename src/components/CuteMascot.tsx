import { useState } from "react";
import { motion } from "motion/react";

const IMAGE_CANDIDATES = [
  "/sleeping_mascot.png",
  "/sleeping_mascot.jpg",
  "/sleeping_mascot.jpeg",
  "/mascot.png",
  "/mascot.jpg",
  "/mascot.jpeg",
  "/sleeping.png",
  "/sleeping.jpg",
  "/sleeping.jpeg",
];

export default function CuteMascot() {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    if (candidateIndex < IMAGE_CANDIDATES.length - 1) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setHasImageError(true);
    }
  };

  const currentImageSrc = IMAGE_CANDIDATES[candidateIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mt-8 flex flex-col items-center justify-center select-none"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-48 h-48 sm:w-56 sm:h-56 relative"
      >
        {!hasImageError ? (
          <img
            src={currentImageSrc}
            alt="Món quà bất ngờ"
            onError={handleImageError}
            className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* SVG Fallback if no uploaded image is found */
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
              </filter>
              <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3cc" />
                <stop offset="60%" stopColor="#fce49d" />
                <stop offset="100%" stopColor="#ebd285" />
              </linearGradient>
              <linearGradient id="hatInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dcc477" />
                <stop offset="100%" stopColor="#b39d52" />
              </linearGradient>
              <pattern id="khranPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#ffffff" />
                <rect width="8" height="16" fill="#8c92ac" fillOpacity="0.4" />
                <rect width="16" height="8" fill="#8c92ac" fillOpacity="0.4" />
                <rect width="8" height="8" fill="#585e78" fillOpacity="0.6" />
              </pattern>
              <radialGradient id="blush" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffa6b9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffa6b9" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Mascot Body */}
            <g filter="url(#soft-shadow)">
              <path
                d="M 150 330 C 140 240, 360 215, 390 300 C 415 370, 380 435, 320 440 C 250 445, 160 425, 150 330 Z"
                fill="#ffffff"
                stroke="#433b32"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Blush cheeks */}
            <ellipse cx="190" cy="355" rx="20" ry="12" fill="url(#blush)" transform="rotate(-5, 190, 355)" />
            <ellipse cx="340" cy="335" rx="20" ry="12" fill="url(#blush)" transform="rotate(10, 340, 335)" />

            {/* Sleeping Eyes */}
            <path d="M 198 335 Q 218 348 238 332" fill="none" stroke="#433b32" strokeWidth="6" strokeLinecap="round" />
            <path d="M 298 316 Q 318 328 338 312" fill="none" stroke="#433b32" strokeWidth="6" strokeLinecap="round" />

            {/* Sleeping Mouth */}
            <g transform="rotate(8, 275, 345)">
              <path
                d="M 268 342 C 265 352, 285 352, 282 342 Z"
                fill="#522020"
                stroke="#433b32"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M 271 346 C 271 350, 279 350, 279 346 Z" fill="#ff9ebb" />
            </g>

            {/* Drool */}
            <ellipse cx="295" cy="360" rx="4" ry="6" fill="#a4e4fc" opacity="0.8" stroke="#433b32" strokeWidth="1.5" />

            {/* Scarf */}
            <path
              d="M 162 382 C 175 370, 310 338, 338 358 C 350 368, 332 390, 310 395 C 240 405, 175 405, 162 382 Z"
              fill="url(#khranPattern)"
              stroke="#433b32"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 180 395 C 175 410, 185 450, 210 475 C 225 485, 235 480, 230 460 C 220 440, 215 415, 210 395 Z"
              fill="url(#khranPattern)"
              stroke="#433b32"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 210 475 L 208 488 M 215 477 L 214 490 M 220 478 L 221 491 M 225 477 L 227 489" stroke="#433b32" strokeWidth="4" strokeLinecap="round" />

            {/* Arm */}
            <path
              d="M 132 355 C 118 360, 110 380, 125 395 C 135 405, 150 405, 155 385"
              fill="#ffffff"
              stroke="#433b32"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Conical Hat */}
            <path
              d="M 52 268 Q 235 348 438 198 C 438 198, 380 250, 235 250 C 90 250, 52 268, 52 268 Z"
              fill="url(#hatInnerGrad)"
              stroke="#433b32"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <path
              d="M 52 268 L 228 108 L 438 198 Q 235 348 52 268 Z"
              fill="url(#hatGrad)"
              stroke="#433b32"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 191 123 L 398 212 Q 225 315 72 250 Z" fill="none" stroke="#e0ca86" strokeWidth="3" />
            <path d="M 154 139 L 358 226 Q 215 295 92 232 Z" fill="none" stroke="#e0ca86" strokeWidth="3" />
            <path d="M 117 155 L 318 240 Q 205 275 112 214 Z" fill="none" stroke="#e0ca86" strokeWidth="3" />
            <path d="M 228 108 L 52 268 M 228 108 L 100 280 M 228 108 L 160 295 M 228 108 L 220 305 M 228 108 L 280 295 M 228 108 L 340 265 M 228 108 L 390 230 M 228 108 L 438 198" stroke="#d5bd71" strokeWidth="1.5" opacity="0.6" />

            {/* Stickers on Hat */}
            <g transform="translate(135, 175) rotate(-22) scale(0.6)">
              <ellipse cx="50" cy="50" rx="36" ry="34" fill="#ffffff" stroke="#433b32" strokeWidth="4" />
              <path d="M 24 55 Q 20 18 50 18 Q 80 18 76 55 Z" fill="#69564f" />
              <ellipse cx="50" cy="52" rx="22" ry="20" fill="#ffe2d1" />
              <circle cx="42" cy="50" r="3" fill="#433b32" />
              <circle cx="58" cy="50" r="3" fill="#433b32" />
              <path d="M 40 44 Q 42 42 44 44" fill="none" stroke="#433b32" strokeWidth="2" strokeLinecap="round" />
              <path d="M 56 44 Q 58 42 60 44" fill="none" stroke="#433b32" strokeWidth="2" strokeLinecap="round" />
              <path d="M 47 58 Q 50 61 53 58" fill="none" stroke="#433b32" strokeWidth="2" strokeLinecap="round" />
              <path d="M 28 42 C 32 30, 42 32, 45 38 C 48 32, 58 30, 72 42" fill="none" stroke="#69564f" strokeWidth="8" strokeLinecap="round" />
              <path d="M 22 50 Q 10 56 12 70" fill="none" stroke="#69564f" strokeWidth="7" strokeLinecap="round" />
              <path d="M 78 50 Q 90 56 88 70" fill="none" stroke="#69564f" strokeWidth="7" strokeLinecap="round" />
              <circle cx="36" cy="54" r="4" fill="#ff9ebb" opacity="0.6" />
              <circle cx="64" cy="54" r="4" fill="#ff9ebb" opacity="0.6" />
            </g>
            <g transform="translate(210, 142) rotate(15) scale(0.62)">
              <path d="M 12 40 C 12 20, 88 20, 88 40 C 88 65, 68 75, 50 75 C 32 75, 12 65, 12 40 Z" fill="#ffffff" stroke="#433b32" strokeWidth="4" strokeLinejoin="round" />
              <path d="M 22 40 Q 50 15 78 40" fill="none" stroke="#b0b5bc" strokeWidth="12" strokeLinecap="round" />
              <rect x="32" y="36" width="36" height="28" rx="10" fill="#fce4d6" stroke="#433b32" strokeWidth="4" />
              <path d="M 36 41 L 46 39 M 54 39 L 64 41" stroke="#433b32" strokeWidth="3" strokeLinecap="round" />
              <circle cx="42" cy="47" r="6" fill="none" stroke="#433b32" strokeWidth="3.5" />
              <circle cx="58" cy="47" r="6" fill="none" stroke="#433b32" strokeWidth="3.5" />
              <line x1="48" y1="47" x2="52" y2="47" stroke="#433b32" strokeWidth="3.5" />
              <path d="M 48 46 Q 50 54 52 46" fill="none" stroke="#433b32" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 34 57 Q 50 53 66 57" fill="none" stroke="#7f8c8d" strokeWidth="7" strokeLinecap="round" />
              <path d="M 34 57 Q 50 53 66 57" fill="none" stroke="#433b32" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
        )}

        {/* Floating ZZzz sleep text */}
        <motion.span
          animate={{
            opacity: [0, 1, 0],
            x: [30, 45, 60],
            y: [-40, -65, -90],
            scale: [0.8, 1.2, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0,
          }}
          className="absolute right-2 top-12 font-mono font-bold text-lg text-rose-500 select-none"
        >
          Zzz...
        </motion.span>

        <motion.span
          animate={{
            opacity: [0, 1, 0],
            x: [40, 60, 75],
            y: [-20, -45, -70],
            scale: [0.7, 1.1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.5,
          }}
          className="absolute right-0 top-20 font-mono font-bold text-sm text-amber-500 select-none"
        >
          Zz
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
