const practiceState = {
  mode: "flashcards",
  level: "A1",
  // Flashcards
  deck: [],
  index: 0,
  // Game
  gameWord: null,
  guessed: new Set(),
  lives: 6,
  gameOver: false,
};

function initPractice() {
  // Mode switch (flashcards / game)
  document.querySelectorAll(".practice-mode-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".practice-mode-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      practiceState.mode = btn.dataset.mode;
      document.getElementById("practice-flashcards").classList.toggle("hidden", practiceState.mode !== "flashcards");
      document.getElementById("practice-game").classList.toggle("hidden", practiceState.mode !== "game");
      if (practiceState.mode === "game" && !practiceState.gameWord) newGameRound();
    })
  );

  // CEFR level switch
  const levelEl = document.getElementById("practice-level-switch");
  levelEl.innerHTML = GE_LEVELS.map(
    (l, i) =>
      `<button class="glass-chip px-4 py-2 rounded-2xl text-sm font-semibold practice-level-btn ${i === 0 ? "active" : ""}" data-level="${l}">${l}</button>`
  ).join("");
  levelEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".practice-level-btn");
    if (!btn) return;
    levelEl.querySelectorAll(".practice-level-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    practiceState.level = btn.dataset.level;
    loadDeck();
    newGameRound();
  });

  initFlashcards();
  initGame();
  loadDeck();
}

/* ---------------- Flashcards ---------------- */

function initFlashcards() {
  const card = document.getElementById("flashcard");
  const flip = () => card.classList.toggle("flipped");
  card.addEventListener("click", flip);
  card.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flip();
    }
  });

  document.getElementById("fc-prev").addEventListener("click", () => stepCard(-1));
  document.getElementById("fc-next").addEventListener("click", () => stepCard(1));
  document.getElementById("fc-shuffle").addEventListener("click", () => {
    practiceState.deck.sort(() => Math.random() - 0.5);
    practiceState.index = 0;
    renderCard();
  });
}

function loadDeck() {
  practiceState.deck = geGetWordsForLevel(practiceState.level);
  practiceState.index = 0;
  renderCard();
}

function stepCard(dir) {
  const n = practiceState.deck.length;
  practiceState.index = (practiceState.index + dir + n) % n;
  renderCard();
}

function renderCard() {
  const entry = practiceState.deck[practiceState.index];
  if (!entry) return;
  const card = document.getElementById("flashcard");
  card.classList.remove("flipped");

  // Swap content mid-transition so the back never shows the wrong word
  setTimeout(() => {
    document.getElementById("fc-level").textContent = entry.level;
    document.getElementById("fc-word").textContent = entry.word;
    document.getElementById("fc-meaning").textContent = entry.meaning;
    document.getElementById("fc-example").textContent = `“${entry.example}”`;
  }, 150);

  document.getElementById("fc-counter").textContent = `${practiceState.index + 1} / ${practiceState.deck.length}`;
}

/* ---------------- Word-guessing game ---------------- */

const GAME_MAX_LIVES = 6;

function initGame() {
  document.getElementById("game-new").addEventListener("click", newGameRound);

  // Physical keyboard support while the game is visible
  document.addEventListener("keydown", (e) => {
    const gameVisible = practiceState.mode === "game" && !document.getElementById("tab-practice").classList.contains("hidden");
    if (!gameVisible || practiceState.gameOver) return;
    const letter = e.key.toLowerCase();
    if (/^[a-z]$/.test(letter)) guessLetter(letter);
  });
}

function newGameRound() {
  const words = geGetWordsForLevel(practiceState.level).filter((w) => /^[a-z]+$/i.test(w.word));
  practiceState.gameWord = words[Math.floor(Math.random() * words.length)];
  practiceState.guessed = new Set();
  practiceState.lives = GAME_MAX_LIVES;
  practiceState.gameOver = false;
  renderGame();
}

function guessLetter(letter) {
  const { gameWord, guessed } = practiceState;
  if (!gameWord || guessed.has(letter) || practiceState.gameOver) return;
  guessed.add(letter);
  if (!gameWord.word.toLowerCase().includes(letter)) practiceState.lives--;

  const letters = new Set(gameWord.word.toLowerCase().split(""));
  const won = [...letters].every((l) => guessed.has(l));
  const lost = practiceState.lives <= 0;
  if (won || lost) practiceState.gameOver = true;

  renderGame(won, lost);
}

function renderGame(won = false, lost = false) {
  const { gameWord, guessed, lives } = practiceState;
  if (!gameWord) return;
  const wordLower = gameWord.word.toLowerCase();

  document.getElementById("game-level-badge").textContent = `Level ${practiceState.level}`;
  document.getElementById("game-lives").innerHTML =
    "❤".repeat(lives) + `<span class="opacity-25">${"❤".repeat(GAME_MAX_LIVES - lives)}</span>`;
  document.getElementById("game-hint").textContent = `Hint: ${gameWord.meaning}`;

  // Word slots
  document.getElementById("game-word").innerHTML = wordLower
    .split("")
    .map((l) => {
      const show = guessed.has(l) || practiceState.gameOver;
      return `<span class="game-letter ${guessed.has(l) ? "revealed" : ""} ${lost && !guessed.has(l) ? "text-red-500" : ""}">${show ? l : ""}</span>`;
    })
    .join("");

  // On-screen keyboard
  document.getElementById("game-keyboard").innerHTML = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map((l) => {
      const used = guessed.has(l);
      const cls = used ? (wordLower.includes(l) ? "correct" : "wrong") : "";
      return `<button class="glass-btn game-key ${cls}" data-key="${l}" ${used || practiceState.gameOver ? "disabled" : ""}>${l}</button>`;
    })
    .join("");
  document.getElementById("game-keyboard").querySelectorAll("[data-key]").forEach((btn) =>
    btn.addEventListener("click", () => guessLetter(btn.dataset.key))
  );

  // Status message
  const statusEl = document.getElementById("game-status");
  if (won) {
    statusEl.innerHTML = `<p class="font-bold text-brand">Well done! 🎉</p><p class="text-sm italic text-neutral-500 mt-1">“${gameWord.example}”</p>`;
  } else if (lost) {
    statusEl.innerHTML = `<p class="font-bold text-red-500">Out of lives!</p><p class="text-sm text-neutral-500 mt-1">The word was <span class="font-bold text-brand">${gameWord.word}</span>.</p>`;
  } else {
    statusEl.innerHTML = "";
  }
}