import React, { useEffect, useRef } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const PartnersSlider = () => {
  const { lang } = useI18n();
  const { partners = [] } = useSiteData();
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let raf;
    const step = () => {
      x -= 0.5;
      if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (partners.length === 0) return null;
  const items = [...partners, ...partners];

  return (
    <section className="relative bg-white border-y border-gray-100 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="h-[1px] w-12 bg-[#E30613]" />
          <span className="text-[#E30613] text-xs font-bold tracking-[0.3em]">
            {lang === "tr" ? "İŞ ORTAKLARIMIZ" : "OUR PARTNERS"}
          </span>
          <span className="h-[1px] w-12 bg-[#E30613]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#14284d]">
          {lang === "tr" ? "Güvenilir İş Ortakları" : "Trusted Business Partners"}
        </h2>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-8 w-max items-center">
          {items.map((p, i) => {
            const content = p.logo ? (
              <img loading="lazy" src={p.logo} alt={p.name} className="max-h-10 max-w-[140px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
            ) : (
              <span className="text-lg font-black text-gray-400 group-hover:text-[#14284d] transition-colors duration-300">{p.name}</span>
            );
            const box = (
              <div className="flex flex-col items-center justify-center w-48 h-24 border border-gray-100 hover:border-[#E30613] hover:shadow-lg transition-all duration-300 group shrink-0 px-6 gap-2">
                {content}
              </div>
            );
            return p.link ? (
              <a key={`${p.id}-${i}`} href={p.link} target="_blank" rel="noopener noreferrer">{box}</a>
            ) : (
              <div key={`${p.id}-${i}`}>{box}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersSlider;