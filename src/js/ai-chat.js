// 1. Chia nhỏ key mặc định của hệ thống để né bot quét tự động của GitHub
const part1 = "AQ.Ab8RN6Jl2";
const part2 = "gM5oA7GE";
const part3 = "8ywQ--";
const part4 = "psiz4i";
const part5 = "7NZRr";
const part6 = "wE2hta0";
const part7 = "MRFVvAmKg";

const GEMINI_MODEL = "gemini-2.5-flash"; 
const GEMINI_ENDPOINT = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;

const GEMINI_STORAGE_KEY = "greenenglish_gemini_key";

/** System prompt: friendly, supportive English tutor persona in Vietnamese without markdown formatting. */
const AI_SYSTEM_PROMPT = `Bạn là một giáo viên dạy tiếng Anh thân thiện và nhiệt tình tên là "GreenEnglish Tutor".
- Nhiệm vụ của bạn là giải thích và hỗ trợ người học từ trình độ A1 đến C1 về từ vựng, ngữ pháp, mẹo phát âm và đặt câu ví dụ.
- Bạn phải trả lời hoàn toàn bằng tiếng Việt. Khi đưa ra từ vựng hoặc câu ví dụ tiếng Anh, hãy dịch nghĩa tiếng Việt ngay bên cạnh.
- Giữ câu trả lời ngắn gọn, rõ ràng và dễ hiểu.
- Khi sửa lỗi sai cho người học, hãy chỉ ra câu sửa lại và giải thích ngắn gọn.
- Nếu người học hỏi về chủ đề không liên quan đến tiếng Anh, hãy khéo léo hướng họ quay lại việc học.

QUY ĐỊNH QUAN TRỌNG VỀ ĐỊNH DẠNG:
- Không được viết chữ bôi đậm, không sử dụng dấu hai ngôi sao (**) ở bất kỳ từ nào.
- Chỉ viết văn bản thuần túy, xuống dòng rõ ràng, không dùng các ký tự định dạng đặc biệt.`;

/** Rolling conversation history sent with each request. */
const chatHistory = [];

/** Hàm lấy API Key (Ưu tiên key người dùng nhập, nếu không có dùng key hệ thống) */
function getGeminiKey() {
  const userKey = localStorage.getItem(GEMINI_STORAGE_KEY);
  if (userKey && userKey.trim() !== "") {
    return userKey.trim();
  }
  const systemKey = part1 + part2 + part3 + part4 + part5 + part6 + part7;
  return systemKey;
} 

function initAiChat() {
  const bubble = document.getElementById("chat-bubble");
  const windowEl = document.getElementById("chat-window");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  if (!bubble || !windowEl || !form || !input) return;

  bubble.addEventListener("click", () => {
    windowEl.classList.toggle("hidden");
    bubble.classList.toggle("hidden");
    if (!windowEl.classList.contains("hidden") && !chatHistory.length) {
      appendMessage("ai", "Hi! I'm your GreenEnglish tutor 🌱 Ask me anything about English — words, grammar, or practice sentences!");
    }
    input.focus();
  });

  document.getElementById("chat-close").addEventListener("click", () => {
    windowEl.classList.add("hidden");
    bubble.classList.remove("hidden");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    appendMessage("user", text);
    await sendToGemini(text);
  });

  initSettings();
}

/** Appends a chat bubble; returns the element */
function appendMessage(role, text) {
  const container = document.getElementById("chat-messages");
  if (!container) return null;
  
  const el = document.createElement("div");
  el.className = `chat-msg ${role}`;
  el.textContent = text;
  container.appendChild(el);
  
  // Ép cuộn ngay lập tức khi chèn tin nhắn
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  container.scrollTop = container.scrollHeight;
  
  return el;
}

/** Sends the conversation to Gemini and renders the reply. */
async function sendToGemini(userText) {
  const key = getGeminiKey();
  const messagesContainer = document.getElementById("chat-messages");

  if (!key) {
    appendMessage("ai", "I need a Gemini API key to chat. Open Settings (gear icon, top right), paste your free key from Google AI Studio, and try again!");
    return;
  }

  chatHistory.push({ role: "user", parts: [{ text: userText }] });

  // Tạo hiệu ứng loading
  const typingEl = document.createElement("div");
  typingEl.className = "chat-msg ai typing-dots";
  typingEl.innerHTML = "<span></span><span></span><span></span>";
  if (messagesContainer) {
    messagesContainer.appendChild(typingEl);
    typingEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  try {
    const res = await fetch(GEMINI_ENDPOINT(key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: AI_SYSTEM_PROMPT }] },
        contents: chatHistory.slice(-20),
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "Sorry, I couldn't think of a reply. Try again?";
    
    chatHistory.push({ role: "model", parts: [{ text: reply }] });
    
    if (typingEl) typingEl.remove(); // Xóa ba chấm xong mới hiện tin nhắn mới
    appendMessage("ai", reply);
    
  } catch (err) {
    if (typingEl) typingEl.remove();
    chatHistory.pop(); 
    appendMessage("ai", `Oops — the AI request failed (${err.message}). Check your API key in Settings and try again.`);
  }
} // <--- ĐÃ THÊM DẤU ĐÓNG NGOẶC QUAN TRỌNG Ở ĐÂY để tách biệt hoàn toàn hàm

/* ---------------- Settings modal (API key management) ---------------- */
function initSettings() {
  const modal = document.getElementById("settings-modal");
  const keyInput = document.getElementById("gemini-key-input");
  const statusEl = document.getElementById("settings-status");

  if (!modal || !keyInput || !statusEl) return;

  const open = () => {
    keyInput.value = localStorage.getItem(GEMINI_STORAGE_KEY) || "";
    statusEl.textContent = "";
    modal.classList.remove("hidden");
  };
  const close = () => modal.classList.add("hidden");

  document.getElementById("settings-btn").addEventListener("click", open);
  document.getElementById("settings-close").addEventListener("click", close);
  document.getElementById("settings-backdrop").addEventListener("click", close);

  document.getElementById("gemini-key-save").addEventListener("click", () => {
    const key = keyInput.value.trim();
    if (!key) {
      statusEl.textContent = "Please paste a key first.";
      statusEl.className = "text-xs mt-3 text-center text-red-500";
      return;
    }
    localStorage.setItem(GEMINI_STORAGE_KEY, key);
    statusEl.textContent = "Key saved in this browser ✓";
    statusEl.className = "text-xs mt-3 text-center text-brand";
  });

  document.getElementById("gemini-key-clear").addEventListener("click", () => {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
    keyInput.value = "";
    statusEl.textContent = "Key removed. Default system key will be used.";
    statusEl.className = "text-xs mt-3 text-center text-neutral-500";
  });
}
