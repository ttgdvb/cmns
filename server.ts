import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
}

// API endpoint for AI letter generation
app.post("/api/generate-letter", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "Gemini API key is not configured on the server." });
  }

  try {
    const { senderName, receiverName, relationshipLength, girlTraits, memoriesToInclude, tone, format } = req.body;

    let systemInstruction = `Bạn là một người anh, người bạn thân thiết, biết viết những lời chúc mừng sinh nhật vô cùng ý nghĩa, ấm áp và pha chút hóm hỉnh. 
Nhiệm vụ của bạn là viết một lá thư chúc mừng sinh nhật hoặc một bài thơ chúc mừng sinh nhật vui tươi, ấm áp bằng tiếng Việt để người dùng (vai "Anh", là người anh/bạn thân thiết) gửi tặng cho một người em gái/bạn nữ thân thiết (vai "Em") nhân ngày sinh nhật cô ấy.
Tránh viết theo kiểu yêu đương đôi lứa (tuyệt đối KHÔNG dùng các cụm từ như 'yêu em', 'vợ yêu', 'bạn gái của anh', 'người tình', 'ôm hôn lãng mạn'). Thay vào đó, hãy dùng giọng văn thân thiết, quan tâm quý mến, chúc em tuổi mới rực rỡ, luôn vui tươi, hạnh phúc, xinh đẹp và gặt hái nhiều thành công.
Sử dụng các thông tin chi tiết được cung cấp một cách khéo léo để bức thư/bài thơ mang tính cá nhân cao nhất.`;

    let userPrompt = `
Thông tin chi tiết:
- Tên người gửi (người anh/bạn thân): ${senderName || "Anh"}
- Tên người nhận (em gái/bạn nữ): ${receiverName || "Em"}
- Thời gian quen biết/đồng hành: ${relationshipLength || "một thời gian"}
- Đặc điểm/Tính cách của cô ấy: ${girlTraits || "vui vẻ, đáng yêu"}
- Kỷ niệm đáng nhớ muốn nhắc tới: ${memoriesToInclude || "những buổi cà phê tán dóc, kỷ niệm đi chơi vui vẻ"}
- Tông giọng chủ đạo: ${tone} (ấm áp, chân thành, hài hước, sâu sắc)
- Định dạng yêu cầu: ${format === "poem" ? "Một bài thơ chúc mừng sinh nhật vui vẻ, ý nghĩa" : "Một bức thư chúc mừng sinh nhật ấm áp, thân tình"}

Yêu cầu:
1. Viết hoàn toàn bằng tiếng Việt, ngôn từ trau chuốt, giàu hình ảnh, nhịp điệu.
2. Nếu là bức thư, hãy viết dưới dạng các đoạn văn mượt mà, chân tình, bắt đầu bằng lời chào thân ái và kết thúc bằng lời chúc tốt đẹp nhất của một người anh/người bạn thân thiết.
3. Nếu là bài thơ, hãy sáng tác bài thơ gồm 4-6 khổ (mỗi khổ 4 câu) có vần điệu vui tươi, ý nghĩa, đong đầy sự quý mến.
4. KHÔNG sử dụng các định dạng markdown quá phức tạp, hãy dùng các dấu xuống dòng tự nhiên để lá thư hiển thị đẹp mắt. Tránh viết lời mở đầu giới thiệu của AI, hãy đi thẳng vào bức thư hoặc bài thơ luôn.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.95,
      },
    });

    const generatedText = response.text || "Không thể tạo được nội dung thư. Hãy thử lại!";
    res.json({ content: generatedText });
  } catch (error: any) {
    console.error("Error generating letter:", error);
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi trong quá trình tạo lời chúc mừng." });
  }
});

// Vite middleware for development vs static files for production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
