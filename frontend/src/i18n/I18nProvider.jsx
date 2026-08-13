import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import dict from "./dict";
import { publicApi as api } from "../lib/api";

const I18nContext = createContext({ lang: "tr", t: (k) => k, setLang: () => {} });

// Admin panelden düzenlenen içerikler burada tutulur: { key: { value_tr, value_en } }
const CONTENT_CACHE_KEY = "hv_content_cache";

export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "tr";
    return localStorage.getItem("hv_lang") || "tr";
  });

  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem(CONTENT_CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch { return {}; }
  });

  // Admin panelde düzenlenebilen tüm sayfa metinlerini backend'den çek.
  // Bu, dict.js'teki sabit metinlerin üzerine yazar (override) — yani
  // admin'de bir metni değiştirdiğinde site anında günceli gösterir.
  useEffect(() => {
    api.get("/content")
      .then((r) => {
        setContent(r.data || {});
        try { localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(r.data || {})); } catch {}
      })
      .catch(() => {});
  }, []);

  const setLang = useCallback((next) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("hv_lang", next);
      document.documentElement.lang = next;
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key) => {
      const override = content[key];
      const overrideVal = override ? (lang === "tr" ? override.value_tr : override.value_en) : null;
      if (overrideVal) return overrideVal;
      return dict[lang] && dict[lang][key] != null ? dict[lang][key] : key;
    },
    [lang, content]
  );

  return (
    <I18nContext.Provider value={{ lang, t, setLang, content }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
