const TABS = ["home", "vocabulary", "materials", "practice"];
const THEME_STORAGE_KEY = "greenenglish_theme";

/** Switches the visible tab and moves the nav indicator. */
function switchTab(tab) {
  if (!TABS.includes(tab)) return;

  TABS.forEach((t) => {
    const page = document.getElementById(`tab-${t}`);
    page.classList.toggle("hidden", t !== tab);
    if (t === tab) {
      // Retrigger the fade-in animation
      page.classList.remove("tab-page");
      void page.offsetWidth;
      page.classList.add("tab-page");
    }
  });

  document.querySelectorAll("#bottom-nav .nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.nav === tab);
  });

  const indicator = document.getElementById("nav-indicator");
  indicator.style.transform = `translateX(${TABS.indexOf(tab) * 100}%)`;

  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", `#${tab}`);
}

function initNavigation() {
  // Any element with [data-nav] switches tabs (nav bar, CTAs, logo, cards)
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-nav]");
    if (el) {
      e.preventDefault();
      switchTab(el.dataset.nav);
    }
  });

  // Deep-link support (e.g. index.html#practice)
  const initial = location.hash.replace("#", "");
  switchTab(TABS.includes(initial) ? initial : "home");
}

function initTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  // Default: sleek dark minimalist theme
  const dark = stored ? stored === "dark" : true;
  document.documentElement.classList.toggle("dark", dark);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initDictionary();
  initMaterials();
  initPractice();
  initAiChat();
  lucide.createIcons();
});