// Auto translation system with cache + Arabic manual fixes

const CACHE_KEY = "auto-translations-v3";

const ENDPOINT = "https://api.mymemory.translated.net/get";

// =========================
// Ignore words (never translate)
// =========================

const IGNORE_WORDS = ["English", "Français", "العربية", "🇸🇦", "🇫🇷", "🇬🇧"];

// =========================
// Arabic manual corrections
// =========================

const AR_FIXES = {
  Login: "تسجيل الدخول",
  Register: "إنشاء حساب",
  Logout: "تسجيل الخروج",
  Teacher: "الأستاذ",
  Student: "التلميذ",
  Dashboard: "لوحة التحكم",
  Courses: "الدروس",
  Exercises: "التمارين",
  Results: "النتائج",
  Notifications: "الإشعارات",
  Profile: "الملف الشخصي",
  Settings: "الإعدادات",
  Save: "حفظ",
  Cancel: "إلغاء",
  Delete: "حذف",
  Update: "تحديث",
  Quiz: "اختبار",
  Quizzes: "الاختبارات",
  Language: "اللغة",
  Theme: "السمة",
  Username: "اسم المستخدم",
  Password: "كلمة المرور",
  Welcome: "مرحباً",
  Home: "الرئيسية",
  Next: "التالي",
  Previous: "السابق",
  Level: "المستوى",
  Beginner: "مبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
  Expert: "خبير",
  Announcement: "إعلان",
  Announcements: "الإعلانات",
  Score: "النقطة",
  Progress: "التقدم",
  Search: "بحث",
  Submit: "إرسال",
  Continue: "متابعة",
  Back: "رجوع",
};

// =========================
// Cache
// =========================

let cache = (() => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
})();

const pending = new Map();

let saveTimer = null;

function persist() {
  if (saveTimer) return;

  saveTimer = setTimeout(() => {
    saveTimer = null;

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      // ignore storage quota errors
    }
  }, 400);
}

export function clearTranslationsCache() {
  cache = {};
  localStorage.removeItem(CACHE_KEY);
}

// =========================
// Utils
// =========================

function normalizeText(text) {
  return text.replace(/\s+/g, " ").replace(/\n/g, " ").trim();
}

export function getCached(text, lang) {
  if (lang === "en") return null;

  const trimmed = normalizeText(text);

  if (!trimmed) return null;

  // never cache ignored words
  if (IGNORE_WORDS.includes(trimmed)) {
    return trimmed;
  }

  return cache?.[lang]?.[trimmed] ?? null;
}

function shouldTranslate(text) {
  const t = normalizeText(text);

  if (!t) return false;

  // ignore words
  if (IGNORE_WORDS.includes(t)) {
    return false;
  }

  // too short
  if (t.length < 2) return false;

  // numbers only
  if (/^[\d\s.,:%+\-/$€()]+$/.test(t)) return false;

  // url
  if (/^https?:\/\//i.test(t)) return false;

  // image/video names
  if (/\.(png|jpg|jpeg|gif|svg|webp|mp4|mp3)$/i.test(t)) {
    return false;
  }

  // code detection
  if (
    /const |let |function |=>|import |export |className=|return |<div|<\/|{.*}/i.test(
      t,
    )
  ) {
    return false;
  }

  // symbols only
  if (/^[^\w]+$/.test(t)) return false;

  // must contain letters
  if (!/[A-Za-zÀ-ÿ\u0600-\u06FF]/.test(t)) return false;

  return true;
}

function cleanTranslation(text) {
  if (!text) return null;

  return text
    .replace(/\s+/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// =========================
// Main Translation Function
// =========================

export async function fetchTranslation(text, lang) {
  if (lang === "en") return null;

  const trimmed = normalizeText(text);

  // =========================
  // Ignore words
  // =========================

  if (IGNORE_WORDS.includes(trimmed)) {
    return trimmed;
  }

  // =========================
  // Should translate
  // =========================

  if (!shouldTranslate(trimmed)) {
    return null;
  }

  // =========================
  // Arabic manual corrections
  // =========================

  if (lang === "ar" && AR_FIXES[trimmed]) {
    return AR_FIXES[trimmed];
  }

  // =========================
  // Cache
  // =========================

  const cached = getCached(trimmed, lang);

  if (cached) return cached;

  // =========================
  // Pending request
  // =========================

  const key = `${lang}::${trimmed}`;

  if (pending.has(key)) {
    return pending.get(key);
  }

  // =========================
  // API target language
  // =========================

  const target = lang === "ar" ? "ar" : "fr";

  const url =
    `${ENDPOINT}?q=${encodeURIComponent(trimmed)}` + `&langpair=en|${target}`;

  // =========================
  // Fetch translation
  // =========================

  const promise = (async () => {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 6000);

      const res = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) return null;

      const data = await res.json();

      let translated = data?.responseData?.translatedText;

      translated = cleanTranslation(translated);

      if (!translated) return null;

      // invalid api responses
      if (
        /MYMEMORY WARNING|INVALID|PLEASE SELECT TWO DISTINCT LANGUAGES/i.test(
          translated,
        )
      ) {
        return null;
      }

      // avoid same translation
      if (translated.toLowerCase() === trimmed.toLowerCase() && lang !== "en") {
        return null;
      }

      // =========================
      // Save cache
      // =========================

      if (!cache[lang]) {
        cache[lang] = {};
      }

      // don't cache ignored words
      if (!IGNORE_WORDS.includes(trimmed)) {
        cache[lang][trimmed] = translated;
      }

      persist();

      return translated;
    } catch {
      return null;
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, promise);

  return promise;
}

// =========================
// Preserve spaces
// =========================

export function withWhitespace(original, replacement) {
  const lead = original.match(/^\s*/)?.[0] ?? "";

  const tail = original.match(/\s*$/)?.[0] ?? "";

  return lead + replacement + tail;
}
