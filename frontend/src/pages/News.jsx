import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const API = import.meta.env.VITE_BACKEND_URL;

const formatDate = (iso, lang) => {
  try {
    return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
};

export const NewsList = () => {
  const { t, lang } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/news`)
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main data-testid="news-list-page">
        <SEO path="/haberler" title={t("news")} />

        {/* Hero — jenerik stok fotoğraf yerine hafif ikon imzası */}
        <section className="relative bg-[#0a1930] overflow-hidden pt-44 pb-20">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.05] flex items-center justify-center overflow-hidden">
            <Calendar size={360} strokeWidth={0.6} className="text-white" />
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">{t("news_kicker")}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
              {t("news_title")}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 bg-[#f7f8fa]">
          <div className="max-w-7xl mx-auto px-6">

            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white animate-pulse">
                    <div className="aspect-[16/9] bg-gray-100" />
                    <div className="p-8 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-5 bg-gray-100 rounded" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && items.length === 0 && (
              <p className="text-center text-gray-400 py-20 tracking-widest text-sm uppercase">
                {lang === "tr" ? "Henüz haber yok." : "No news yet."}
              </p>
            )}

            {!loading && items.length > 0 && (
              <div className="space-y-px bg-gray-200">
                {/* Featured */}
                {items[0] && (
                  <article className="bg-white group">
                    <Link to={`/haberler/${items[0].id}`} className="flex flex-col lg:flex-row">
                      <div className="relative lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden bg-gray-100" style={{ minHeight: 360 }}>
                        <img loading="lazy"
                          src={items[0].image} alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-6 left-6 bg-[#E30613] text-white text-[9px] font-black tracking-[0.2em] px-3 py-1.5">
                          {lang === "tr" ? "ÖNE ÇIKAN" : "FEATURED"}
                        </div>
                      </div>
                      <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative">
                        <div className="absolute top-0 left-0 w-1 h-0 bg-[#E30613] group-hover:h-full transition-all duration-500" />
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 tracking-widest uppercase">
                          <Calendar size={11} className="text-[#E30613]" />
                          {formatDate(items[0].date, lang)}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#0a1930] group-hover:text-[#E30613] transition-colors duration-300 leading-tight mb-5">
                          {lang === "tr" ? items[0].title_tr : items[0].title_en}
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                          {lang === "tr" ? items[0].excerpt_tr : items[0].excerpt_en}
                        </p>
                        <span className="inline-flex items-center gap-2 text-[#E30613] text-xs font-black tracking-widest group-hover:gap-4 transition-all duration-300">
                          {t("read_more_arrow")} <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </article>
                )}

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
                  {items.slice(1).map((item) => (
                    <article key={item.id} className="bg-white group">
                      <Link to={`/haberler/${item.id}`} className="block h-full">
                        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                          <img loading="lazy"
                            src={item.image} alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="p-8 relative">
                          <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#E30613] group-hover:w-full transition-all duration-500" />
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 tracking-widest uppercase">
                            <Calendar size={10} className="text-[#E30613]" />
                            {formatDate(item.date, lang)}
                          </div>
                          <h3 className="text-base font-black text-[#0a1930] group-hover:text-[#E30613] transition-colors duration-300 leading-tight mb-3">
                            {lang === "tr" ? item.title_tr : item.title_en}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed mb-5">
                            {lang === "tr" ? item.excerpt_tr : item.excerpt_en}
                          </p>
                          <span className="inline-flex items-center gap-2 text-[#E30613] text-[10px] font-black tracking-widest">
                            {t("read_more_arrow")} <ArrowRight size={11} />
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export const NewsDetail = () => {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/news/${id}`)
      .then((r) => setItem(r.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) return (
    <>
      <Header />
      <main className="pt-40 pb-20 max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-2xl font-black text-[#0a1930]">404</h1>
        <Link to="/haberler" className="inline-block mt-4 text-[#E30613] text-sm font-bold">{t("news")}</Link>
      </main>
      <Footer />
    </>
  );

  if (!item) return (
    <>
      <Header />
      <main className="pt-40 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E30613] border-t-transparent rounded-full animate-spin" />
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main data-testid="news-detail-page">
        <SEO
          title={lang === "tr" ? item.title_tr : item.title_en}
          description={lang === "tr" ? item.excerpt_tr : item.excerpt_en}
          image={item.image}
          path={`/haberler/${id}`}
        />

        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy" src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930] via-[#0a1930]/60 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />
          <div className="relative max-w-4xl mx-auto px-6 pb-20 pt-44 w-full">
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6 tracking-widest uppercase">
              <Calendar size={11} className="text-[#E30613]" />
              {formatDate(item.date, lang)}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {lang === "tr" ? item.title_tr : item.title_en}
            </h1>
          </div>
        </section>

        {/* Content */}
        <article className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-xl text-gray-500 leading-relaxed mb-10 font-light border-l-4 border-[#E30613] pl-6">
              {lang === "tr" ? item.excerpt_tr : item.excerpt_en}
            </p>
            <div className="space-y-6 text-gray-700 leading-8 text-lg">
              {(lang === "tr" ? item.content_tr : item.content_en).split(/\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-16 pt-8 border-t border-gray-100">
              <Link
                to="/haberler"
                className="inline-flex items-center gap-2 text-[#E30613] font-black text-xs tracking-widest hover:gap-4 transition-all duration-300"
              >
                <ArrowLeft size={14} /> {lang === "tr" ? "TÜM HABERLER" : "ALL NEWS"}
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};