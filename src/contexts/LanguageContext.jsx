import { createContext, useContext, useEffect, useRef, useState } from "react";

import { DICT, translate } from "@/lib/translations";
import {
  fetchTranslation,
  getCached,
  withWhitespace,
} from "@/lib/autoTranslate";

const LanguageContext = createContext(undefined);

const ATTRS = ["placeholder", "title", "aria-label", "alt"];

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "TEXTAREA",
]);

const ORIGINAL_TEXT = new WeakMap();
const ORIGINAL_ATTRS = new WeakMap();

function getOriginalText(node) {
  let original = ORIGINAL_TEXT.get(node);

  if (original === undefined) {
    original = node.nodeValue ?? "";
    ORIGINAL_TEXT.set(node, original);
  }

  return original;
}

function getOriginalAttr(el, name) {
  let map = ORIGINAL_ATTRS.get(el);

  if (!map) {
    map = {};
    ORIGINAL_ATTRS.set(el, map);
  }

  if (!(name in map)) {
    map[name] = el.getAttribute(name) ?? "";
  }

  return map[name];
}

const pendingTextNodes = new Map();
const pendingAttrTargets = new Map();

function schedulePending(map, key, value) {
  let set = map.get(key);

  if (!set) {
    set = new Set();
    map.set(key, set);
  }

  set.add(value);
}

function applyToTextNode(node, lang) {
  const original = getOriginalText(node);

  if (!original.trim()) return;

  if (lang === "en") {
    if (node.nodeValue !== original) {
      node.nodeValue = original;
    }
    return;
  }

  const fromDict = translate(original, lang);

  if (fromDict !== null) {
    if (node.nodeValue !== fromDict) {
      node.nodeValue = fromDict;
    }
    return;
  }

  const cached = getCached(original, lang);

  if (cached) {
    const next = withWhitespace(original, cached);

    if (node.nodeValue !== next) {
      node.nodeValue = next;
    }

    return;
  }

  const key = `${lang}::${original.trim()}`;

  schedulePending(pendingTextNodes, key, node);

  fetchTranslation(original, lang).then((res) => {
    if (!res) return;

    const targets = pendingTextNodes.get(key);

    if (!targets) return;

    pendingTextNodes.delete(key);

    const next = withWhitespace(original, res);

    targets.forEach((n) => {
      if (n.isConnected && document.documentElement.lang === lang) {
        if (n.nodeValue !== next) {
          n.nodeValue = next;
        }
      }
    });
  });
}

function applyToElementAttrs(el, lang) {
  for (const attr of ATTRS) {
    if (!el.hasAttribute(attr) && !ORIGINAL_ATTRS.get(el)?.[attr]) {
      continue;
    }

    const original = getOriginalAttr(el, attr);

    if (!original) continue;

    if (lang === "en") {
      if (el.getAttribute(attr) !== original) {
        el.setAttribute(attr, original);
      }
      continue;
    }

    const fromDict = translate(original, lang);

    if (fromDict !== null) {
      if (el.getAttribute(attr) !== fromDict) {
        el.setAttribute(attr, fromDict);
      }
      continue;
    }

    const cached = getCached(original, lang);

    if (cached) {
      const next = withWhitespace(original, cached);

      if (el.getAttribute(attr) !== next) {
        el.setAttribute(attr, next);
      }

      continue;
    }

    const key = `${lang}::${original.trim()}`;

    schedulePending(pendingAttrTargets, key, { el, attr });

    fetchTranslation(original, lang).then((res) => {
      if (!res) return;

      const targets = pendingAttrTargets.get(key);

      if (!targets) return;

      pendingAttrTargets.delete(key);

      const next = withWhitespace(original, res);

      targets.forEach(({ el: target, attr: a }) => {
        if (target.isConnected && document.documentElement.lang === lang) {
          if (target.getAttribute(a) !== next) {
            target.setAttribute(a, next);
          }
        }
      });
    });
  }
}

function walkAndTranslate(root, lang) {
  if (root.nodeType === Node.TEXT_NODE) {
    applyToTextNode(root, lang);
    return;
  }

  if (
    root.nodeType !== Node.ELEMENT_NODE &&
    root.nodeType !== Node.DOCUMENT_NODE
  ) {
    return;
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (SKIP_TAGS.has(node.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }

        const parent = node.parentElement;

        if (parent && SKIP_TAGS.has(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  if (root.nodeType === Node.ELEMENT_NODE && !SKIP_TAGS.has(root.tagName)) {
    applyToElementAttrs(root, lang);
  }

  let cur = walker.nextNode();

  while (cur) {
    if (cur.nodeType === Node.ELEMENT_NODE) {
      applyToElementAttrs(cur, lang);
    } else {
      applyToTextNode(cur, lang);
    }

    cur = walker.nextNode();
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("lang") : null;

    return stored || "en";
  });

  const langRef = useRef(lang);

  langRef.current = lang;

  useEffect(() => {
    document.documentElement.lang = lang;

    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    localStorage.setItem("lang", lang);

    pendingTextNodes.clear();
    pendingAttrTargets.clear();

    walkAndTranslate(document.body, lang);

    const observer = new MutationObserver((mutations) => {
      const currentLang = langRef.current;

      for (const m of mutations) {
        if (m.type === "characterData") {
          applyToTextNode(m.target, currentLang);
        } else if (m.type === "childList") {
          m.addedNodes.forEach((n) => walkAndTranslate(n, currentLang));
        } else if (
          m.type === "attributes" &&
          m.target.nodeType === Node.ELEMENT_NODE
        ) {
          applyToElementAttrs(m.target, currentLang);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRS],
    });

    return () => observer.disconnect();
  }, [lang]);

  const setLang = (l) => setLangState(l);

  const t = (key) => {
    if (lang === "en") return key;

    return DICT[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return ctx;
}
