import { createContext, useContext, useEffect, useState } from "react";
import { publicApi as api } from "../lib/api";

export const DataContext = createContext({ loading: true });

const ENDPOINTS = {
  slides: "/hero-slides",
  categories: "/categories",
  counters: "/counters",
  projects: "/projects",
  footer: "/footer",
  partners: "/partners",
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem("hv_site_data");
      return cached ? JSON.parse(cached) : {};
    } catch { return {}; }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem("hv_site_data");
    } catch { return true; }
  });

  useEffect(() => {
    let pending = Object.keys(ENDPOINTS).length;
    const collected = {};

    Object.entries(ENDPOINTS).forEach(([key, path]) => {
      api.get(path)
        .then((res) => {
          collected[key] = res.data;
          setData((prev) => ({ ...prev, [key]: res.data }));
        })
        .catch(() => {})
        .finally(() => {
          pending -= 1;
          if (pending === 0) {
            setLoading(false);
            try { localStorage.setItem("hv_site_data", JSON.stringify(collected)); } catch {}
          }
        });
    });
  }, []);

  return <DataContext.Provider value={{ ...data, loading }}>{children}</DataContext.Provider>;
};

export const useSiteData = () => useContext(DataContext);