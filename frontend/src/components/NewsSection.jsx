import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

const API = import.meta.env.VITE_BACKEND_URL;
const NewsSection = () => {
  const [current, setCurrent] = useState(0);
  const [news, setNews] = useState([]);
  const { t, lang } = useI18n();
  const perView = 3;
  const maxIndex = Math.max(0, news.length - perView);

  useEffect(() => {
    axios
      .get(`${API}/api/news`)
      .then((res) => setNews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNews([]));
  }, []);

  const next = () => setCurrent((c) => Math.min(c + 1, maxIndex));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  useEffect(() => {
    if (news.length <= perView) return;
    const timer = setInterval(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), 5000);
    return () => clearInterval(timer);
  }, [maxIndex, news.length]);

  if (news.length === 0) return null;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <section id="haberler" className="relative py-20 md:py-28 bg-white overflow-hidden" data-testid="news-section">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[80px] md:text-[160px] font-black text-gray-100 select-none pointer-events-none whitespace-nowrap tracking-tighter" aria-hidden>
        {t("news_watermark")}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 pt-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[2px] w-10 bg-[#E30613]" />
            <h6 className="text-xs font-bold tracking-[0.25em] text-[#E30613]">{t("news_kicker")}</h6>
            <span className="h-[2px] w-10 bg-[#E30613]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#14284d]">{t("news_title")}</h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out gap-6"
              style={{ transform: `translateX(calc(-${current} * (100% / ${perView} + 0px)))` }}
            >
              {news.map((item) => (
                <article key={item.id} className="group flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500">
                  <Link to={`/haberler/${item.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img loading="lazy" src={item.image} alt={lang === "tr" ? item.title_tr : item.title_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-[#E30613] text-white text-[11px] font-bold tracking-wider">
                        <Calendar size={12} /> {formatDate(item.date)}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#14284d] group-hover:text-[#E30613] transition-colors duration-300 leading-snug mb-3 line-clamp-2 min-h-[3.5rem]">
                        {lang === "tr" ? item.title_tr : item.title_en}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
                        {lang === "tr" ? item.excerpt_tr : item.excerpt_en}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#E30613] tracking-[0.15em] group-hover:gap-3 transition-all">
                        {t("read_more_arrow")} <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 mt-10">
            <button onClick={prev} disabled={current === 0} className="w-11 h-11 border border-gray-300 text-[#14284d] hover:bg-[#E30613] hover:border-[#E30613] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center" aria-label="prev">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-2 transition-all duration-300 ${current === i ? "w-8 bg-[#E30613]" : "w-2 bg-gray-300 hover:bg-gray-400"}`} />
              ))}
            </div>
            <button onClick={next} disabled={current === maxIndex} className="w-11 h-11 border border-gray-300 text-[#14284d] hover:bg-[#E30613] hover:border-[#E30613] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center" aria-label="next">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
