const DICT_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

/** Quick-search suggestions shown under the search bar (A1 → C1). */
const DICT_SUGGESTIONS = ["hello", "journey", "environment", "sustainable", "ubiquitous"];

function initDictionary() {
  const form = document.getElementById("dict-form");
  const input = document.getElementById("dict-input");
  const suggestionsEl = document.getElementById("dict-suggestions");

  // Render suggestion chips
  suggestionsEl.innerHTML = DICT_SUGGESTIONS.map(
    (w) => `<button type="button" class="glass-chip px-4 py-1.5 rounded-full text-sm font-medium" data-word="${w}">${w}</button>`
  ).join("");
  suggestionsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-word]");
    if (!btn) return;
    input.value = btn.dataset.word;
    searchWord(btn.dataset.word);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const word = input.value.trim();
    if (word) searchWord(word);
  });
}

/** Fetches a word from the API and renders the result. */
async function searchWord(word) {
  const resultEl = document.getElementById("dict-result");
  resultEl.innerHTML = `
    <div class="glass-card rounded-3xl p-8 text-center dict-anim">
      <span class="typing-dots text-brand"><span></span><span></span><span></span></span>
      <p class="text-sm text-neutral-500 mt-2">Looking up “${escapeHtml(word)}”…</p>
    </div>`;

  try {
    const res = await fetch(DICT_API + encodeURIComponent(word.toLowerCase()));
    if (!res.ok) throw new Error("not-found");
    const data = await res.json();
    renderDictResult(data[0]);
  } catch {
    resultEl.innerHTML = `
      <div class="glass-card rounded-3xl p-8 text-center dict-anim">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto text-neutral-400"></i>
        <p class="font-semibold mt-3">No results for “${escapeHtml(word)}”</p>
        <p class="text-sm text-neutral-500 mt-1">Check the spelling or try another word.</p>
      </div>`;
    lucide.createIcons();
  }
}

/** Renders one dictionary entry into the result container. */
function renderDictResult(entry) {
  const resultEl = document.getElementById("dict-result");
  const phonetic = entry.phonetics?.find((p) => p.text) || {};
  const audio = entry.phonetics?.find((p) => p.audio)?.audio || "";

  const meaningsHtml = entry.meanings
    .map((m) => {
      const defs = m.definitions
        .slice(0, 3)
        .map(
          (d) => `
          <li class="mt-3">
            <p class="text-sm md:text-base">${escapeHtml(d.definition)}</p>
            ${d.example ? `<p class="text-sm italic text-neutral-500 dark:text-neutral-400 mt-1">“${escapeHtml(d.example)}”</p>` : ""}
          </li>`
        )
        .join("");
      return `
        <div class="mt-6">
          <span class="glass-chip px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-brand">${escapeHtml(m.partOfSpeech)}</span>
          <ol class="list-decimal list-inside mt-1 marker:text-brand marker:font-bold">${defs}</ol>
          ${
            m.synonyms?.length
              ? `<p class="text-xs text-neutral-500 mt-3"><span class="font-semibold text-brand">Synonyms:</span> ${m.synonyms.slice(0, 6).map(escapeHtml).join(", ")}</p>`
              : ""
          }
        </div>`;
    })
    .join("");

  resultEl.innerHTML = `
    <div class="glass-card rounded-3xl p-6 md:p-8 dict-anim">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 class="text-3xl md:text-4xl font-black tracking-tight">${escapeHtml(entry.word)}</h3>
          ${phonetic.text ? `<p class="text-brand font-medium mt-1">${escapeHtml(phonetic.text)}</p>` : ""}
        </div>
        ${
          audio
            ? `<button id="dict-audio-btn" class="glass-btn-primary w-12 h-12 rounded-2xl flex items-center justify-center" aria-label="Play pronunciation">
                 <i data-lucide="volume-2" class="w-5 h-5"></i>
               </button>`
            : ""
        }
      </div>
      ${meaningsHtml}
    </div>`;

  if (audio) {
    const player = new Audio(audio);
    document.getElementById("dict-audio-btn").addEventListener("click", () => player.play());
  }
  lucide.createIcons();
}

/** Basic HTML escaping to keep API strings safe to inject. */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}