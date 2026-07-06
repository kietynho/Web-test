const MATERIAL_FILTERS = ["All", ...GE_LEVELS, "Topics"];

function initMaterials() {
  const filtersEl = document.getElementById("materials-filters");
  filtersEl.innerHTML = MATERIAL_FILTERS.map(
    (f, i) =>
      `<button class="glass-chip px-4 py-2 rounded-2xl text-sm font-semibold materials-filter ${i === 0 ? "active" : ""}" data-filter="${f}">${f}</button>`
  ).join("");

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".materials-filter");
    if (!btn) return;
    filtersEl.querySelectorAll(".materials-filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderMaterials(btn.dataset.filter);
  });

  renderMaterials("All");
}

/** Builds the unified card list from level lists + topic lists. */
function getMaterialCards() {
  const levelCards = GE_LEVELS.map((level) => ({
    kind: "level",
    id: level,
    title: `CEFR ${level} Essentials`,
    icon: "graduation-cap",
    description: `Core ${level}-level words every learner should know, with meanings and examples.`,
    level,
    words: geGetWordsForLevel(level),
  }));
  const topicCards = GE_TOPICS.map((t) => ({ kind: "topic", ...t }));
  return [...levelCards, ...topicCards];
}

function renderMaterials(filter) {
  const grid = document.getElementById("materials-grid");
  let cards = getMaterialCards();

  if (filter === "Topics") cards = cards.filter((c) => c.kind === "topic");
  else if (filter !== "All") cards = cards.filter((c) => c.kind === "level" && c.id === filter);

  grid.innerHTML = cards
    .map(
      (c) => `
      <button class="glass-card p-6 rounded-3xl text-left group dict-anim" data-material="${c.id}">
        <div class="flex items-start justify-between">
          <span class="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform">
            <i data-lucide="${c.icon}" class="w-5 h-5"></i>
          </span>
          <span class="glass-chip px-3 py-1 rounded-full text-[11px] font-bold text-brand">${c.level}</span>
        </div>
        <h3 class="font-bold text-lg mt-4">${c.title}</h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">${c.description}</p>
        <p class="text-xs font-semibold text-brand mt-3 flex items-center gap-1">
          ${c.words.length} words <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </p>
      </button>`
    )
    .join("");

  grid.querySelectorAll("[data-material]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const card = getMaterialCards().find((c) => c.id === btn.dataset.material);
      if (card) openMaterialModal(card);
    })
  );
  lucide.createIcons();
}

/** Slide-up modal listing every word of a collection. */
function openMaterialModal(card) {
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 z-[60]";
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-close></div>
    <div class="absolute bottom-0 inset-x-0 max-w-lg mx-auto glass-card rounded-t-3xl p-6 modal-slide-up max-h-[80vh] flex flex-col">
      <div class="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 class="font-extrabold text-lg">${card.title}</h3>
          <p class="text-xs text-brand font-semibold">${card.level} · ${card.words.length} words</p>
        </div>
        <button class="glass-btn w-8 h-8 rounded-full flex items-center justify-center" data-close aria-label="Close">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="overflow-y-auto space-y-3 pr-1">
        ${card.words
          .map(
            (w) => `
            <div class="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-4">
              <div class="flex items-center justify-between">
                <span class="font-bold">${w.word}</span>
                <span class="text-[11px] font-bold text-brand">${w.level || card.level}</span>
              </div>
              <p class="text-sm text-neutral-600 dark:text-neutral-300 mt-1">${w.meaning}</p>
              <p class="text-sm italic text-neutral-500 dark:text-neutral-400 mt-1">“${w.example}”</p>
            </div>`
          )
          .join("")}
      </div>
    </div>`;

  overlay.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) overlay.remove();
  });
  document.body.appendChild(overlay);
  lucide.createIcons();
}