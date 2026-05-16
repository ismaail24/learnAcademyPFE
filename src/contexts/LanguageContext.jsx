import { createContext, useContext, useEffect, useRef, useState } from "react";

import { DICT, translate } from "@/lib/translations";

const LanguageContext = createContext(undefined);

// Attributes to translate
const ATTRS = ["placeholder", "title", "aria-label", "alt"];

// Ignore these tags
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "TEXTAREA",
]);

// Store original content
const ORIGINAL_TEXT = new WeakMap();
const ORIGINAL_ATTRS = new WeakMap();

function getOriginalText(node) {
  let original = ORIGINAL_TEXT.get(node);

  if (original === undefined) {
    original = node.nodeValue || "";
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
    map[name] = el.getAttribute(name) || "";
  }

  return map[name];
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

  const translated = translate(original, lang);
  const next = translated || original;

  if (node.nodeValue !== next) {
    node.nodeValue = next;
  }
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

    const translated = translate(original, lang);
    const next = translated || original;

    if (el.getAttribute(attr) !== next) {
      el.setAttribute(attr, next);
    }
  }
}

function walkAndTranslate(root, lang) {
  // Text node
  if (root.nodeType === Node.TEXT_NODE) {
    applyToTextNode(root, lang);
    return;
  }

  // Ignore invalid nodes
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

  // Translate root attrs
  if (root.nodeType === Node.ELEMENT_NODE && !SKIP_TAGS.has(root.tagName)) {
    applyToElementAttrs(root, lang);
  }

  let current = walker.nextNode();

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      applyToElementAttrs(current, lang);
    } else {
      applyToTextNode(current, lang);
    }

    current = walker.nextNode();
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

    // Initial translation
    walkAndTranslate(document.body, lang);

    // Observe DOM changes
    const observer = new MutationObserver((mutations) => {
      const currentLang = langRef.current;

      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          applyToTextNode(mutation.target, currentLang);
        }

        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            walkAndTranslate(node, currentLang);
          });
        }

        if (
          mutation.type === "attributes" &&
          mutation.target.nodeType === Node.ELEMENT_NODE
        ) {
          applyToElementAttrs(mutation.target, currentLang);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });

    return () => observer.disconnect();
  }, [lang]);

  const setLang = (newLang) => {
    setLangState(newLang);
  };

  const t = (key) => {
    if (lang === "en") {
      return key;
    }

    return DICT[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
