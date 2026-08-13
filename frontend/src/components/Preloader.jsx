import React, { useEffect, useRef, useState } from "react";

// ─── session-guard ────────────────────────────────────────────────────────────
// NOT: module scope'ta okuma yapma — Next.js SSR'da window yoktur,
// ve F5'te module cache'den eski değer gelir. useState lazy init kullan.
const seenKey = "hv_seen";
const readSeenFlag = () => {
  // Sadece client'ta, gerçek zamanlı oku
  try {
    return typeof window !== "undefined"
      ? window.sessionStorage.getItem(seenKey) === "1"
      : false; // SSR'da her zaman göster (hydration sonrası düzelir)
  } catch {
    return false;
  }
};
const writeSeenFlag = () => {
  try {
    if (typeof window !== "undefined") window.sessionStorage.setItem(seenKey, "1");
  } catch { /* ignore */ }
};

// ─── animation styles ─────────────────────────────────────────────────────────
const keyframes = `
  @keyframes hv-fade-up { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes hv-bar     { from { transform: scaleX(0) } to { transform: scaleX(1) } }
  @keyframes hv-dot     { 0%,100% { opacity: 0.15 } 50% { opacity: 1 } }
  @keyframes hv-exit    { from { opacity: 1 } to { opacity: 0 } }
  @keyframes hv-pop     { from { opacity: 0; transform: scale(0.85) } to { opacity: 1; transform: scale(1) } }
  @keyframes hv-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.045) } }

  .hv-logo-pop { animation: hv-pop 0.5s 0.1s cubic-bezier(0.23,1,0.32,1) both; }
  .hv-tag     { animation: hv-fade-up 0.55s 0.42s cubic-bezier(0.23,1,0.32,1) both; }
  .hv-counter { animation: hv-fade-up 0.40s 0.55s both; }
  .hv-bar     { animation: hv-bar     2.6s  0.35s cubic-bezier(0.4,0,0.2,1) both; transform-origin: left; }
  .hv-dot-1   { animation: hv-dot 1.2s 0.75s infinite; }
  .hv-dot-2   { animation: hv-dot 1.2s 0.95s infinite; }
  .hv-dot-3   { animation: hv-dot 1.2s 1.15s infinite; }
  .hv-exit    { animation: hv-exit 0.45s ease-in forwards; }
  .hv-breathe { animation: hv-breathe 2.4s ease-in-out infinite; }
`;

// ─── component ────────────────────────────────────────────────────────────────
const Preloader = () => {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  // lazy init: useState callback sadece ilk render'da çalışır, her seferinde sessionStorage'ı gerçek zamanlı okur
  const [gone, setGone] = useState(() => readSeenFlag());
  const ivRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (gone) return;
    writeSeenFlag(); // hemen yaz, çift mount'ta tekrar çalışmasın

    ivRef.current = setInterval(() => {
      setPct((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 8) + 2, 100);
        if (next >= 100) {
          clearInterval(ivRef.current);
          setTimeout(() => setExiting(true), 350);
        }
        return next;
      });
    }, 80);

    return () => clearInterval(ivRef.current);
  }, []); // gone'a bağımlı değil — sadece mount'ta çalışsın

  // Exit animasyonu bittikten sonra DOM'dan kaldır.
  // animationend güvenilmez olabilir (display:none, visibility vs.) → timeout fallback ekle.
  useEffect(() => {
    if (!exiting) return;
    const node = wrapRef.current;
    const remove = () => setGone(true);
    // animasyonun süresinden (~450ms) biraz fazla bekle
    const fallback = setTimeout(remove, 600);
    node?.addEventListener("animationend", remove, { once: true });
    return () => {
      clearTimeout(fallback);
      node?.removeEventListener("animationend", remove);
    };
  }, [exiting]);

  if (gone) return null;

  return (
    <>
      <style>{keyframes}</style>

      <div
        ref={wrapRef}
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a1930] ${exiting ? "hv-exit" : ""}`}
        aria-hidden="true"
        data-testid="preloader"
      >
        {/* corner accents */}
        <span className="absolute top-6 left-6 w-5 h-5 border-t border-l border-[#E30613]/40 pointer-events-none" />
        <span className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-[#E30613]/40 pointer-events-none" />

        {/* logo — sade, nefes alır gibi büyüyüp küçülen tek bir görsel */}
        <div className="hv-logo-pop flex items-center justify-center" data-hv-anim>
          <img
            src="/logo/hv-elektrik-logo-full.png"
            alt="HV Elektrik"
            className="hv-breathe w-auto"
            style={{ height: "clamp(70px, 15vw, 120px)" }}
            data-hv-anim
          />
        </div>


        {/* tagline + dots */}
        <div className="hv-tag absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5" data-hv-anim>
          <span className="hv-dot-1 w-1.5 h-1.5 rounded-full bg-[#E30613]" />
          <span className="hv-dot-2 w-1.5 h-1.5 rounded-full bg-[#E30613]" />
          <span className="hv-dot-3 w-1.5 h-1.5 rounded-full bg-[#E30613]" />
          <span className="ml-2 text-[10px] tracking-[0.3em] uppercase text-white/30 font-light">
            Enerji · Mühendislik · Üretim
          </span>
        </div>

        {/* percent counter */}
        <div
          className="hv-counter absolute bottom-11 right-10 text-[11px] tracking-widest text-white/20 tabular-nums"
          aria-live="off"
          data-hv-anim
        >
          {pct}%
        </div>

        {/* progress bar */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/5">
          <div className="hv-bar h-full bg-[#E30613]" data-hv-anim />
        </div>
      </div>
    </>
  );
};

export default Preloader;