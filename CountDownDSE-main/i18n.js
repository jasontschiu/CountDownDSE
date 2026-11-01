(() => {
  const STORAGE_KEY = "wscss-lang";
  const DEFAULT_LANGUAGE = "en";
  const LANGUAGES = ["en", "zh-Hant"];

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The toggle still works for this page when storage is blocked.
    }
  }

  function updateTranslatedAttributes(language) {
    const key = language === "en" ? "en" : "zh";

    document.querySelectorAll("[data-en]").forEach((element) => {
      const text = element.dataset[key];

      if (element.tagName === "TITLE") {
        document.title = text;
      } else if (element.tagName === "META") {
        element.content = text;
      } else {
        element.setAttribute("aria-label", text);
      }
    });
  }

  function setLanguage(language) {
    document.documentElement.lang = language;
    updateTranslatedAttributes(language);

    document.querySelectorAll("[data-set-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLang === language));
    });

    document.dispatchEvent(new CustomEvent("site-language-change"));
  }

  // Runs in <head> so the page never flashes the wrong language.
  document.documentElement.lang = getSavedLanguage();

  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(document.documentElement.lang);

    document.querySelectorAll("[data-set-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        saveLanguage(button.dataset.setLang);
        setLanguage(button.dataset.setLang);
      });
    });
  });
})();
