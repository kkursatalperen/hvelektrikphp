import React, { useEffect, useRef } from "react";
import { useI18n } from "../i18n/I18nProvider";

/* Gerçek logo görseliniz olduğunda, aşağıdaki her öğeye
   `logo: "/path/to/logo.png"` alanı ekleyin — otomatik olarak
   metin yerine görsel gösterilecektir (PartnersSlider ile aynı mantık). */
const standards = [
  { id: 1, label: "TEİAŞ / TEDAŞ", sub: { tr: "Mühendislik ve SCADA Uyumluluğu", en: "Engineering & SCADA Compliance" }, logo: null },
  { id: 2, label: "EPC", sub: { tr: "Anahtar Teslim Proje Gücü", en: "Turnkey Project Execution" }, logo: null },
  { id: 3, label: "CE", sub: { tr: "Avrupa Standartlarına Uygunluk", en: "European Conformity Standards" }, logo: null },
];

const StandardsSlider = () => {
  const { lang } = useI18n();
  const trackRef = useRef(null);
  const items = [...standards, ...standards];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let raf;
    const step = () => {
      x -= 0.4;
      if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative bg-white border-b border-gray-100 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="h-[1px] w-12 bg-[#E30613]" />
          <span className="text-[#E30613] text-xs font-bold tracking-[0.3em]">
            {lang === "tr" ? "STANDARTLAR & UYGUNLUK" : "STANDARDS & COMPLIANCE"}
          </span>
          <span className="h-[1px] w-12 bg-[#E30613]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#14284d]">
          {lang === "tr" ? "Mühendislik Standartlarımız" : "Our Engineering Standards"}
        </h2>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-8 w-max items-center">
          {items.map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              className="flex flex-col items-center justify-center w-56 h-28 border border-gray-100 hover:border-[#E30613] hover:shadow-lg transition-all duration-300 group shrink-0 px-6 gap-2 text-center"
            >
              {s.logo ? (
                <img loading="lazy" src={s.logo} alt={s.label} className="max-h-10 max-w-[140px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
              ) : (
                <span className="text-lg font-black text-[#14284d]">{s.label}</span>
              )}
              <span className="text-[10px] text-gray-400 leading-tight">{lang === "tr" ? s.sub.tr : s.sub.en}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StandardsSlider;