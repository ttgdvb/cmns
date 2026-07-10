import React, { useState, useEffect } from "react";
import { Heart, Calendar, Plus, Trash2, Milestone, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Memory } from "../types";

const DEFAULT_MEMORIES: Memory[] = [
  {
    id: "mem-1",
    date: "05/09/2024",
    title: "Ngày đầu tiên biết nhau",
    description: "Lần đầu tiên hai anh em gặp nhau qua một hoạt động/dự án chung. Tuy lúc đầu có chút bỡ ngỡ nhưng sau vài câu nói chuyện thì thấy cực kỳ hợp cạ và thoải mái.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "mem-2",
    date: "14/10/2024",
    title: "Buổi hẹn cà phê tán dóc đầu tiên",
    description: "Buổi đi cà phê vỉa hè tám đủ thứ chuyện trên đời, từ phim ảnh, cuộc sống đến những thói quen dở khóc dở cười. Hóa ra hai anh em lại hợp tính đến thế!",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "mem-3",
    date: "28/12/2024",
    title: "Chuyến đi chơi dã ngoại",
    description: "Kỷ niệm đi dã ngoại cùng nhóm bạn thân. Chụp cho nhau hàng tá bức ảnh dìm hàng tinh nghịch nhưng ngập tràn tiếng cười sảng khoái.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80",
  },
];

export default function MemoryTimeline() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImg, setNewImg] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("birthday_memories_list");
      if (saved) {
        setMemories(JSON.parse(saved));
      } else {
        setMemories(DEFAULT_MEMORIES);
      }
    } catch (e) {
      console.error(e);
      setMemories(DEFAULT_MEMORIES);
    }
  }, []);

  const saveMemories = (newMemories: Memory[]) => {
    setMemories(newMemories);
    localStorage.setItem("birthday_memories_list", JSON.stringify(newMemories));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTitle || !newDesc) return;

    const newMem: Memory = {
      id: "mem-" + Date.now(),
      date: newDate,
      title: newTitle,
      description: newDesc,
      image: newImg.trim() || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80",
    };

    const updated = [newMem, ...memories].sort((a, b) => {
      // Simple date comparison for custom display order if needed, but we keep latest added on top or simple order
      return 0;
    });

    saveMemories(updated);
    setNewDate("");
    setNewTitle("");
    setNewDesc("");
    setNewImg("");
    setShowAddForm(false);
  };

  const handleDeleteMemory = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa kỷ niệm đáng nhớ này không?")) {
      const filtered = memories.filter((m) => m.id !== id);
      saveMemories(filtered);
    }
  };

  const handleResetDefault = () => {
    if (confirm("Khôi phục danh sách kỷ niệm mặc định ban đầu?")) {
      saveMemories(DEFAULT_MEMORIES);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12" id="section-timeline">
      <div className="text-center mb-10">
        <h2 className="display-text text-brand-ink dark:text-zinc-50 text-4xl sm:text-5xl uppercase tracking-tighter mb-2">
          HÀNH TRÌNH ĐỒNG HÀNH
        </h2>
        <p className="text-xs tracking-widest font-sans uppercase text-brand-accent font-bold mb-4">
          —— OUR MEMORABLE CHRONOLOGY ——
        </p>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
          Cột mốc thời gian ghi dấu những mảnh ghép hạnh phúc và đáng nhớ trong suốt thời gian quen biết nhau.
        </p>
      </div>

      {/* Vertical Timeline container */}
      <div className="relative border-l-2 border-dashed border-brand-accent ml-4 sm:ml-32 md:ml-40 space-y-12 pb-6">
        
        <AnimatePresence initial={false}>
          {memories.map((mem, index) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 sm:pl-12 group"
            >
              {/* Floating Heart Pin on the axis */}
              <div className="absolute -left-[11px] top-1 bg-white dark:bg-zinc-900 border-2 border-brand-accent rounded-full p-1 shadow-md z-10 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>

              {/* Date Box on left side of axis (on screens larger than sm) */}
              <div className="hidden sm:block absolute left-[-165px] md:left-[-185px] w-32 text-right top-1">
                <span className="text-xs font-black font-sans px-3 py-1 bg-brand-bg text-brand-accent dark:bg-pink-950 dark:text-pink-300 rounded-sm shadow border-2 border-brand-accent/20">
                  {mem.date}
                </span>
              </div>

              {/* Memory Card */}
              <div className="bg-white dark:bg-zinc-900 rounded shadow-lg border-2 border-brand-ink/10 dark:border-zinc-800/60 p-5 md:p-6 hover:shadow-xl transition-all duration-355 flex flex-col md:flex-row gap-5 items-start">
                
                {/* Date for Mobile (small screen) */}
                <span className="sm:hidden text-[11px] font-black font-mono px-2.5 py-1 bg-brand-bg text-brand-accent rounded mb-1">
                  {mem.date}
                </span>

                {mem.image && (
                  <div className="w-full md:w-44 h-28 rounded overflow-hidden flex-shrink-0 shadow border border-brand-ink/10 dark:border-zinc-800">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-brand-ink dark:text-zinc-100 truncate group-hover:text-brand-accent transition-colors">
                      {mem.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                      title="Xóa mốc kỷ niệm"
                      id={`btn-delete-mem-${mem.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans">
                    {mem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-3 mt-8 font-sans">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2.5 rounded bg-brand-accent text-white hover:bg-brand-accent-hover transition-all text-xs font-black cursor-pointer shadow-md flex items-center gap-1.5 uppercase tracking-widest"
            id="btn-timeline-add-toggle"
          >
            <Plus className="w-4 h-4" /> Viết Thêm Kỷ Niệm Mới
          </button>
        ) : (
          <button
            onClick={() => setShowAddForm(false)}
            className="px-6 py-2.5 rounded bg-zinc-200 text-zinc-750 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all text-xs font-black cursor-pointer uppercase tracking-widest"
            id="btn-timeline-add-cancel"
          >
            Đóng Biểu Mẫu
          </button>
        )}

        {memories !== DEFAULT_MEMORIES && (
          <button
            onClick={handleResetDefault}
            className="px-5 py-2.5 rounded border-2 border-brand-ink/10 text-brand-ink/70 hover:bg-white dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            id="btn-timeline-reset"
          >
            Khôi phục mặc định
          </button>
        )}
      </div>

      {/* Add Memory Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6 p-6 bg-white dark:bg-zinc-900 border-2 border-brand-ink/10 dark:border-zinc-800 rounded shadow-2xl max-w-lg mx-auto font-sans"
          >
            <h3 className="display-text text-brand-ink dark:text-zinc-50 text-xl uppercase tracking-tight flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-brand-accent" />
              Thêm mốc kỷ niệm mới
            </h3>

            <form onSubmit={handleAddMemory} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-brand-ink dark:text-zinc-400 uppercase tracking-widest mb-1.5">Ngày kỷ niệm</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: 14/02/2025"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-brand-ink/15 dark:border-zinc-700 rounded text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand-ink dark:text-zinc-400 uppercase tracking-widest mb-1.5">Tiêu đề</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Lần đi xem phim đầu..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-brand-ink/15 dark:border-zinc-700 rounded text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-brand-ink dark:text-zinc-400 uppercase tracking-widest mb-1.5">Mô tả kỷ niệm đáng nhớ</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Kể lại chi tiết kỷ niệm vui vẻ lúc đó nhé..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-brand-ink/15 dark:border-zinc-700 rounded text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-brand-ink dark:text-zinc-400 uppercase tracking-widest mb-1.5">Đường link ảnh minh họa (tùy chọn)</label>
                <input
                  type="url"
                  placeholder="ví dụ: https://images.unsplash.com/... hoặc link bất kỳ"
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                  className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-brand-ink/15 dark:border-zinc-700 rounded text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
                <span className="text-[10px] text-zinc-450 dark:text-zinc-550 mt-1.5 block flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-brand-accent" /> Mẹo: Có thể dán một link ảnh bất kỳ từ Facebook, Pinterest hoặc Unsplash.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded bg-brand-accent text-white font-black text-xs hover:bg-brand-accent-hover transition-all shadow-md cursor-pointer uppercase tracking-widest"
                id="btn-timeline-submit"
              >
                Lưu Kỷ Niệm Đáng Nhớ ✨
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
