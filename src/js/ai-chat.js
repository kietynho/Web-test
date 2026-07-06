// 1. XÓA KEY DÁN CỨNG ĐỂ TRÁNH LỘ TRÊN GITHUB PAGES. Web sẽ dùng key từ ô Settings.
const GEMINI_API_KEY = ""; 

// 2. CẬP NHẬT LÊN MODEL 2.5-FLASH ĐỂ SỬA LỖI QUOTA (LIMIT 0)
const GEMINI_MODEL = "gemini-2.5-flash"; 
const GEMINI_ENDPOINT = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;

const GEMINI_STORAGE_KEY = "greenenglish_gemini_key";

/** System prompt: friendly, supportive English tutor persona. */
const AI_SYSTEM_PROMPT = `You are "GreenEnglish Tutor", a friendly, patient and supportive English teacher.
- Help learners from CEFR level A1 to C1 with vocabulary, grammar, pronunciation tips and example sentences.
- Keep answers concise, clear and encouraging. Use simple English for lower levels.
- When correcting mistakes, be gentle: show the corrected sentence and briefly explain why.
- If asked something unrelated to learning English, politely steer the conversation back to English learning.`;

/** Rolling conversation history sent with each request. */
const chatHistory = [];

function getGeminiKey() {
  return GEMINI_API_KEY || localStorage.getItem(GEMINI_STORAGE_KEY) || "";
}

function initAiChat() {
  const bubble = document.getElementById("chat-bubble");
  const windowEl = document.getElementById("chat-window");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  if (!bubble || !windowEl || !form || !input) return; // Bảo vệ nếu thiếu phần tử HTML

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

/** Appends a chat bubble; returns the element (for streaming/typing updates). */
function appendMessage(role, text) {
  const container = document.getElementById("chat-messages");
  if (!container) return null;
  
  const el = document.createElement("div");
  el.className = `chat-msg ${role}`;
  el.textContent = text;
  container.appendChild(el);
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

  // Đưa tin nhắn user vào lịch sử theo cấu trúc chuẩn của Gemini API
  chatHistory.push({ role: "user", parts: [{ text: userText }] });

  // Tạo hiệu ứng ba dấu chấm đang chạy (Typing indicator)
  const typingEl = document.createElement("div");
  typingEl.className = "chat-msg ai typing-dots";
  typingEl.innerHTML = "<span></span><span></span><span></span>";
  if (messagesContainer) {
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  try {
    const res = await fetch(GEMINI_ENDPOINT(key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: AI_SYSTEM_PROMPT }] },
        contents: chatHistory.slice(-20), // Giữ lại tối đa 10 cặp hội thoại gần nhất
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "Sorry, I couldn't think of a reply. Try again?";
    
    // Lưu phản hồi của AI vào lịch sử
    chatHistory.push({ role: "model", parts: [{ text: reply }] });
    
    typingEl.remove(); // Xóa hiệu ứng ba chấm
    appendMessage("ai", reply);
  } catch (err) {
    typingEl.remove();
    chatHistory.pop(); // Xóa câu chat lỗi của user để không làm hỏng chuỗi hội thoại sau này
    appendMessage("ai", `Oops — the AI request failed (${err.message}). Check your API key in Settings and try again.`);
  }
}

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
    statusEl.textContent = "Key removed.";
    statusEl.className = "text-xs mt-3 text-center text-neutral-500";
  });
}

// Gọi hàm này khi file script được tải hoặc lồng vào sự kiện DOMContentLoaded ở app.js chính
// document.addEventListener("DOMContentLoaded", initAiChat);