import { useState, useRef, useEffect } from "react";
import { Gift, Sparkles, AlertCircle, BookmarkCheck, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Coupon } from "../types";

const COUPONS: Coupon[] = [
  {
    id: "c-1",
    text: "Mát-xa vai gáy 30 phút 💆‍♀️",
    color: "#fecdd3", // rose-200
    description: "Nhấn nút kích hoạt là ông anh này sẽ có mặt ngay lập tức để giúp em xua tan đi mọi mệt mỏi và đau nhức vai gáy.",
  },
  {
    id: "c-2",
    text: "Một ly trà sữa full topping 🥤",
    color: "#fde047", // yellow-300
    description: "Bất kể khi nào thèm trà sữa, chỉ cần gửi tín hiệu là ly trà sữa full topping yêu thích sẽ được ship tận tay em gái ngay lập tức!",
  },
  {
    id: "c-3",
    text: "Một ngày chiều chuộng em gái 👸",
    color: "#c084fc", // purple-400
    description: "Hôm nay em là ưu tiên số một, muốn đi ăn gì, đi đâu chơi anh cũng sẽ chiều theo ý muốn của em hết nấc!",
  },
  {
    id: "c-4",
    text: "Bao ăn một bữa hoành tráng 🍔",
    color: "#fda4af", // rose-300
    description: "Hôm nay thèm ăn món gì cứ nói, anh bao trọn gói một bữa no nê hoành tráng tại quán ruột của hai anh em!",
  },
  {
    id: "c-5",
    text: "Một buổi xem phim tùy ý chọn 🎬",
    color: "#6ee7b7", // emerald-300
    description: "Cùng đi xem bộ phim bom tấn em tự lựa chọn, vé và bắp rang bơ vị phô mai cứ để anh lo trọn gói nhé.",
  },
  {
    id: "c-6",
    text: "Món quà bất ngờ tự chọn 🎁",
    color: "#93c5fd", // blue-300
    description: "Một phần quà nhỏ xinh xắn do chính em tự lựa chọn và anh sẽ chịu trách nhiệm quẹt thẻ thanh toán tặng em!",
  },
  {
    id: "c-7",
    text: "Tài xế & Shipper riêng 1 ngày 🚗",
    color: "#f9a8d4", // pink-300
    description: "Em muốn đi lượn phố, đi học, đi làm hay cần chuyển đồ gì cứ gọi, anh xách xe làm tài xế kiêm shipper liền.",
  },
  {
    id: "c-8",
    text: "Nghe tâm sự & gỡ rối 100% 💬",
    color: "#a7f3d0", // emerald-200
    description: "Bất cứ khi nào em có chuyện buồn hay đau đầu, anh sẵn sàng lắng nghe chân thành, gỡ rối và bao trà đá tâm sự cùng em.",
  },
];

export default function CouponWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningCoupon, setWinningCoupon] = useState<Coupon | null>(null);
  const [claimedCoupons, setClaimedCoupons] = useState<Coupon[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Load claimed coupons from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("birthday_claimed_coupons");
      if (saved) {
        setClaimedCoupons(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningCoupon(null);

    // Generate random extra spins (at least 5-8 full rotations) + random degrees
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + extraSpins * 360 + randomAngle;

    setRotation(totalRotation);

    // Sector angle is 360 / 8 = 45 degrees
    // Calculate winning index based on the final angle (offset by 270 degrees to point to the top pin)
    setTimeout(() => {
      setIsSpinning(false);

      const finalAngle = totalRotation % 360;
      // top marker is at 270 deg of trigonometric coordinate
      // Wheel spins clockwise, so sector that stops at top (270 deg) is calculated as:
      const sectorAngle = 45;
      const index = Math.floor((360 - finalAngle + 270) % 360 / sectorAngle);
      const coupon = COUPONS[index];

      setWinningCoupon(coupon);
      setShowWinnerModal(true);
    }, 4000); // Spin lasts 4 seconds
  };

  const claimWinner = () => {
    if (!winningCoupon) return;

    // Check if already claimed in wallet to prevent duplication
    if (claimedCoupons.some((c) => c.id === winningCoupon.id)) {
      setShowWinnerModal(false);
      return;
    }

    const updated = [...claimedCoupons, winningCoupon];
    setClaimedCoupons(updated);
    localStorage.setItem("birthday_claimed_coupons", JSON.stringify(updated));
    setShowWinnerModal(false);
  };

  const handleClearWallet = () => {
    if (confirm("Xóa ví các coupon đã nhận?")) {
      setClaimedCoupons([]);
      localStorage.removeItem("birthday_claimed_coupons");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12" id="section-coupons">
      <div className="text-center mb-10">
        <h2 className="display-text text-brand-ink dark:text-zinc-50 text-4xl sm:text-5xl uppercase tracking-tighter mb-2">
          VÒNG QUAY MAY MẮN
        </h2>
        <p className="text-xs tracking-widest font-sans uppercase text-brand-accent font-bold mb-4">
          —— THE LUCKY COUPON WHEEL ——
        </p>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
          Món quà tinh thần đặc biệt của anh dành tặng em. Quay vòng quay may mắn để rút những coupon đặc quyền vô cùng đáng yêu nhé!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-center font-sans">
        {/* Left: The Spinning Wheel */}
        <div className="col-span-12 lg:col-span-7 flex flex-col items-center justify-center relative">
          
          {/* Top Pointer Pin */}
          <div className="absolute top-0 w-8 h-8 bg-brand-accent clip-path-polygon rounded-t shadow-lg z-30 transform translate-y-[28px]" 
               style={{ 
                 clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                 filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))"
               }} 
          />

          {/* Glowing Outer Wheel Rim */}
          <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] rounded-full border-8 border-brand-accent bg-brand-accent shadow-2xl flex items-center justify-center overflow-hidden p-1.5 z-20">
            
            {/* Spinning inner disc */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden transition-all ease-out duration-[4000ms] shadow-inner"
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center",
              }}
              id="lucky-wheel-disc"
            >
              {COUPONS.map((coupon, i) => {
                const angle = 45; // 360 / 8
                const rotateDeg = i * angle;
                return (
                  <div
                    key={coupon.id}
                    className="absolute inset-0 origin-center overflow-hidden"
                    style={{
                      transform: `rotate(${rotateDeg}deg)`,
                      clipPath: "polygon(50% 50%, 30.5% 0%, 69.5% 0%)",
                    }}
                  >
                    {/* Background sector */}
                    <div
                      className="w-full h-full absolute inset-0"
                      style={{ backgroundColor: coupon.color }}
                    />
                    
                    {/* Sector Text */}
                    <div 
                      className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-black text-amber-950 tracking-wider text-center leading-tight max-w-[80px]"
                      style={{
                        transform: "rotate(0deg) translateY(20px)",
                        writingMode: "vertical-rl",
                        textOrientation: "upright"
                      }}
                    >
                      {coupon.text.slice(0, 14)}...
                    </div>
                  </div>
                );
              })}

              {/* Decorative dotted lights inside wheel */}
              <div className="absolute inset-4 rounded-full border border-dashed border-white/40 pointer-events-none" />
            </div>

            {/* Central Pin button to launch */}
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`absolute w-16 h-16 rounded-full bg-white dark:bg-zinc-850 text-brand-accent font-black text-sm flex items-center justify-center shadow-2xl border-4 border-brand-accent cursor-pointer z-30 transition-transform active:scale-90 select-none ${
                isSpinning ? "opacity-75 cursor-not-allowed animate-pulse" : "hover:scale-105"
              }`}
              id="btn-spin-wheel"
            >
              QUAY!
            </button>
          </div>

          <p className="text-xs text-zinc-500 mt-6 dark:text-zinc-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <AlertCircle className="w-4.5 h-4.5 text-brand-accent" /> BẤM "QUAY!" ĐỂ RÚT COUPON ĐẶC QUYỀN!
          </p>
        </div>

        {/* Right: The Claims Wallet (Claimed Coupons) */}
        <div className="col-span-12 lg:col-span-5 bg-white dark:bg-zinc-900 border-2 border-brand-ink/10 dark:border-zinc-800/80 p-6 rounded shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-brand-ink/10 dark:border-zinc-800 pb-3">
            <h3 className="display-text text-brand-ink dark:text-zinc-100 text-lg uppercase tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-brand-accent" />
              Túi Coupon Đã Nhận ({claimedCoupons.length})
            </h3>
            {claimedCoupons.length > 0 && (
              <button
                onClick={handleClearWallet}
                className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer uppercase tracking-wider"
                id="btn-clear-wallet"
              >
                Xóa hết
              </button>
            )}
          </div>

          {claimedCoupons.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 dark:text-zinc-500">
              <Gift className="w-10 h-10 mx-auto mb-2 opacity-30 text-brand-accent" />
              <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Chưa có coupon nào được rút.</p>
              <p className="text-[10px] mt-1 text-zinc-450">Hãy quay vòng quay may mắn bên cạnh để nhận quà nhé!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {claimedCoupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3.5 rounded border-2 border-dashed border-brand-accent/25 flex items-start gap-3 bg-gradient-to-r from-brand-bg/40 to-white dark:from-pink-950/10 dark:to-zinc-900"
                >
                  <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-md" style={{ backgroundColor: coupon.color }}>
                    💝
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-brand-ink dark:text-zinc-100">{coupon.text}</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{coupon.description}</p>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-green-50 text-green-700 border border-green-200/50 rounded mt-2.5 inline-block">
                      ✓ Đã lưu vào túi coupon
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Winner Overlay Modal */}
      <AnimatePresence>
        {showWinnerModal && winningCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-150 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded shadow-2xl border-2 border-brand-accent text-center w-full max-w-sm max-h-[90vh] overflow-y-auto font-sans"
            >
              <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mx-auto mb-4 border-2 border-brand-accent/30">
                <Sparkles className="w-8 h-8 text-brand-accent animate-[spin_5s_infinite_linear]" />
              </div>

              <span className="text-xs text-brand-accent font-black uppercase tracking-widest block mb-1">Món Quà Trúng Thưởng! 🎉</span>
              <h3 className="text-xl font-black text-brand-ink dark:text-zinc-100 px-2 mb-2 leading-snug">
                {winningCoupon.text}
              </h3>

              <div className="p-4 rounded border border-brand-accent/20 bg-brand-bg/30 text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed mb-5">
                {winningCoupon.description}
              </div>

              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-5 leading-normal">
                ✨ Mẹo dễ thương: Hãy chụp màn hình tấm thẻ coupon này lại làm bằng chứng để đòi ông anh đổi quà bất cứ lúc nào nhé! ✨
              </p>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
                  id="btn-winner-modal-cancel"
                >
                  Quay lại
                </button>
                <button
                  onClick={claimWinner}
                  className="flex-1 py-3 text-xs font-black uppercase tracking-widest rounded bg-brand-accent text-white hover:bg-brand-accent-hover transition-all cursor-pointer shadow flex items-center justify-center gap-1"
                  id="btn-winner-modal-claim"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" /> Lưu túi quà
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
