import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

let injected = false;

const injectGA = (id) => {
  if (injected || !id || id.startsWith("G-XXXX")) return;
  injected = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
};

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    injectGA(GA_ID);
  }, []);

  useEffect(() => {
    if (typeof window.gtag !== "function" || !GA_ID || GA_ID.startsWith("G-XXXX")) return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;
