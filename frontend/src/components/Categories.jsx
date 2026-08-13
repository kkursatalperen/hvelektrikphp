import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const Categories = () => {
  const { t, lang } = useI18n();
  const { categories } = useSiteData();
  const isLoading = categories === undefined;
  const list = categories || [];
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section id="hizmetler" className="relative bg-[#0a1930] py-24">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">
                {t("cat_kicker")}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              {t("cat_title")}
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
            {t("cat_desc")}
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/[0.03]" style={{ minHeight: "360px" }}>
              <div className="h-full flex flex-col justify-between p-10">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="space-y-3">
                  <div className="h-6 w-2/3 bg-white/10 rounded" />
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-4/5 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : (
          list.map((cat, i) => (
          <Link
            key={cat.id}
            to={cat.link}
            data-testid={`category-card-${cat.id}`}
            onMouseEnter={() => setActiveCard(i)}
            onMouseLeave={() => setActiveCard(null)}
            className="group relative overflow-hidden bg-[#0a1930]"
            style={{ minHeight: "360px" }}
          >
            {/* Background image */}
            <img loading="lazy"
              src={cat.image}
              alt={lang === "tr" ? cat.title_tr : cat.title_en}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105"
            />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent group-hover:from-[#1a0003]/90 transition-all duration-500" />

            {/* Red corner accent */}
            <div className="absolute top-0 left-0 w-1 h-0 bg-[#E30613] group-hover:h-full transition-all duration-500 ease-out" />

            {/* Number — top right */}
            <div className="absolute top-8 right-8 font-black text-[80px] leading-none text-white/5 group-hover:text-[#E30613]/10 transition-colors duration-500 select-none">
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-10" style={{ minHeight: "360px" }}>
              {/* Top: sub label */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.3em] text-[#E30613] font-bold uppercase">
                  {lang === "tr" ? cat.sub_tr : cat.sub_en}
                </span>
              </div>

              {/* Bottom: title + detail */}
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-white transition-colors duration-300">
                  {lang === "tr" ? cat.title_tr : cat.title_en}
                </h3>

                {/* Description — slides up on hover */}
                <p className="text-white/0 group-hover:text-white/70 text-sm leading-relaxed max-w-sm transition-all duration-500 mb-6 translate-y-3 group-hover:translate-y-0">
                  {lang === "tr" ? cat.desc_tr : cat.desc_en}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-0 group-hover:w-12 bg-[#E30613] transition-all duration-500" />
                  <span className="flex items-center gap-2 text-xs font-bold text-[#E30613] tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    {t("discover")}
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default Categories;