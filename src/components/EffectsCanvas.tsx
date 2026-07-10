import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Flower2, PartyPopper } from "lucide-react";

type EffectType = "hearts" | "stars" | "petals" | "confetti";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  life?: number;
  maxLife?: number;
}

export default function EffectsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [effect, setEffect] = useState<EffectType>("hearts");
  const effectRef = useRef<EffectType>("hearts");

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  const particlesRef = useRef<Particle[]>([]);

  // Trigger heart blast
  const triggerBlast = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = ["#ff2a6d", "#ff5e97", "#f3a4b7", "#ff007f", "#e60067", "#fff"];
    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: canvas.height * 0.6 + (Math.random() - 0.5) * 40,
        size: Math.random() * 15 + 8,
        speedY: -Math.random() * 8 - 4,
        speedX: (Math.random() - 0.5) * 12,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 80 + 40,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize some initial particles
    const initCount = 25;
    for (let i = 0; i < initCount; i++) {
      particlesRef.current.push(createParticle(true));
    }

    function createParticle(randomY = false): Particle {
      const w = canvas?.width || window.innerWidth;
      const h = canvas?.height || window.innerHeight;
      const currentEffect = effectRef.current;

      let color = "";
      let size = 0;
      let speedY = 0;
      let speedX = 0;

      if (currentEffect === "hearts") {
        const colors = ["#ff5e97", "#ff2a6d", "#f3a4b7", "#ff8da1", "#d53f8c"];
        color = colors[Math.floor(Math.random() * colors.length)];
        size = Math.random() * 12 + 6;
        speedY = -Math.random() * 1.5 - 0.5;
        speedX = (Math.random() - 0.5) * 0.8;
      } else if (currentEffect === "stars") {
        color = `rgba(253, 224, 71, ${Math.random() * 0.5 + 0.5})`; // gold/yellow
        size = Math.random() * 4 + 2;
        speedY = -Math.random() * 0.4 - 0.1;
        speedX = (Math.random() - 0.5) * 0.3;
      } else if (currentEffect === "petals") {
        const colors = ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#f43f5e"];
        color = colors[Math.floor(Math.random() * colors.length)];
        size = Math.random() * 10 + 5;
        speedY = Math.random() * 1.2 + 0.6; // petals fall down!
        speedX = Math.random() * 1 + 0.2; // slight drift right
      } else {
        // Confetti
        const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
        color = colors[Math.floor(Math.random() * colors.length)];
        size = Math.random() * 8 + 4;
        speedY = Math.random() * 2 + 1; // falls down
        speedX = (Math.random() - 0.5) * 1.5;
      }

      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : (speedY > 0 ? -20 : h + 20),
        size,
        speedY,
        speedX,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        color,
        opacity: Math.random() * 0.4 + 0.5,
      };
    }

    // Draw heart path
    function drawHeart(c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, color: string) {
      c.save();
      c.globalAlpha = opacity;
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      c.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      c.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      c.quadraticCurveTo(x, y, x, y + size / 4);
      c.closePath();
      c.fill();
      c.restore();
    }

    // Draw star
    function drawStar(c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, opacity: number, color: string) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.save();
      c.globalAlpha = opacity;
      c.fillStyle = color;
      c.shadowBlur = 10;
      c.shadowColor = "#fde047";
      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
      c.restore();
    }

    // Draw petal
    function drawPetal(c: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number, color: string) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = opacity;
      c.fillStyle = color;
      c.beginPath();
      c.ellipse(0, 0, size, size / 2, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    // Draw Confetti rectangle
    function drawConfetti(c: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number, color: string) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = opacity;
      c.fillStyle = color;
      c.fillRect(-size / 2, -size / 4, size, size / 2);
      c.restore();
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentEffect = effectRef.current;

      // Spawn new particles occasionally
      if (particlesRef.current.length < 60 && Math.random() < 0.15) {
        particlesRef.current.push(createParticle(false));
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // Update positions
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y / 30) * 0.3; // subtle wave sway
        p.rotation += p.rotationSpeed;

        if (p.life !== undefined && p.maxLife !== undefined) {
          p.life++;
          // Fade out blast particles near death
          if (p.life > p.maxLife * 0.7) {
            p.opacity = 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3);
          }
        }

        // Boundary checks
        const isDead = p.life !== undefined && p.maxLife !== undefined && p.life >= p.maxLife;
        const outOfBounds =
          p.y < -30 ||
          p.y > canvas.height + 30 ||
          p.x < -30 ||
          p.x > canvas.width + 30;

        if (isDead || outOfBounds) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Render based on effect type
        if (p.life !== undefined) {
          // This is a blast heart
          drawHeart(ctx, p.x, p.y, p.size, p.opacity, p.color);
        } else if (currentEffect === "hearts") {
          drawHeart(ctx, p.x, p.y, p.size, p.opacity, p.color);
        } else if (currentEffect === "stars") {
          drawStar(ctx, p.x, p.y, 5, p.size, p.size / 2, p.opacity, p.color);
        } else if (currentEffect === "petals") {
          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.opacity, p.color);
        } else {
          drawConfetti(ctx, p.x, p.y, p.size, p.rotation, p.opacity, p.color);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Background Canvas (drawn behind content but above ambient SVG blobs) */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none w-full h-full z-0" />

      {/* Control Buttons (Vertical column on the right side, safe from all headers/footers) */}
      <div className="fixed right-2.5 sm:right-3 top-[50%] -translate-y-1/2 md:top-[28%] md:translate-y-0 pointer-events-auto flex flex-col items-center gap-1 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md p-1 rounded-full shadow-md border border-pink-100/80 dark:border-pink-900/20 z-50">
        <button
          onClick={() => setEffect("hearts")}
          className={`p-1.5 rounded-full transition-all ${
            effect === "hearts"
              ? "bg-pink-500 text-white shadow-sm scale-105"
              : "text-zinc-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/10"
          }`}
          title="Trái Tim Bay"
          id="btn-effect-hearts"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
        <button
          onClick={() => setEffect("stars")}
          className={`p-1.5 rounded-full transition-all ${
            effect === "stars"
              ? "bg-amber-500 text-white shadow-sm scale-105"
              : "text-zinc-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/10"
          }`}
          title="Sao Lấp Lánh"
          id="btn-effect-stars"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setEffect("petals")}
          className={`p-1.5 rounded-full transition-all ${
            effect === "petals"
              ? "bg-rose-400 text-white shadow-sm scale-105"
              : "text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10"
          }`}
          title="Hoa Anh Đào Rơi"
          id="btn-effect-petals"
        >
          <Flower2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setEffect("confetti")}
          className={`p-1.5 rounded-full transition-all ${
            effect === "confetti"
              ? "bg-purple-500 text-white shadow-sm scale-105"
              : "text-zinc-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/10"
          }`}
          title="Pháo Giấy"
          id="btn-effect-confetti"
        >
          <PartyPopper className="w-3.5 h-3.5" />
        </button>
 
        <span className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800 my-0.5" />
 
        <button
          onClick={triggerBlast}
          className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-950 dark:text-pink-300 dark:hover:bg-pink-900 transition-all shadow-xs flex items-center justify-center hover:scale-110"
          title="Bắn ngập tràn tim"
          id="btn-effect-blast"
        >
          <span className="text-xs">💖</span>
        </button>
      </div>
    </>
  );
}
