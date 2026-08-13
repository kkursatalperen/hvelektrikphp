import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const DEFAULT_IMAGE = "https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg";

const StaticPage = ({ titleKey, bodyKey, crumbs = [], image = DEFAULT_IMAGE, path }) => {
  const { t, lang } = useI18n();
  const { counters = [] } = useSiteData();
  const title = t(titleKey);
  const body = t(bodyKey);
  const paragraphs = body.split(/\n+/).filter(Boolean);

  return (
    <>
      <SEO title={title} description={paragraphs[0]?.slice(0, 160)} path={path} image={image} />
      <Header />
      <main data-testid={`static-page-${titleKey}`}>

        {/* ── Hero ── */}
        <section className="relative min-h-[55vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy"
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1930] via-[#0a1930]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930] via-transparent to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6 pb-16 pt-36 w-full">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">Ana Sayfa</Link>
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  <ChevronRight size={12} />
                  {c.link
                    ? <Link to={c.link} className="hover:text-[#E30613] transition-colors">{c.label}</Link>
                    : <span className="text-white">{c.label}</span>}
                </React.Fragment>
              ))}
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV ELEKTRİK</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              {title}
            </h1>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

              {/* Main content */}
              <div className="lg:col-span-2">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-700 leading-8 text-lg mb-6">{p}</p>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Highlight box */}
                <div className="bg-[#0a1930] p-8">
                  <div className="h-[2px] w-8 bg-[#E30613] mb-6" />
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {paragraphs[0]}
                  </p>
                  <Link
                    to="/iletisim"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#E30613] tracking-widest hover:gap-4 transition-all"
                  >
                    İLETİŞİME GEÇ →
                  </Link>
                </div>

                {/* Quick facts */}
                <div className="border border-gray-100 p-8 space-y-5">
                  <div className="h-[2px] w-8 bg-[#E30613] mb-2" />
                  <h4 className="text-xs font-bold tracking-[0.2em] text-[#14284d] mb-4">RAKAMLARLA HV</h4>
                  {counters.map((item, i) => (
                    <div key={item.id || i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <span className="text-gray-500 text-sm">{lang === "tr" ? item.label_tr : item.label_en}</span>
                      <span className="text-2xl font-black text-[#14284d]">{item.value}{item.suffix}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#E30613] py-16">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Daha fazla bilgi almak ister misiniz?
            </h3>
            <Link
              to="/iletisim"
              className="shrink-0 bg-white text-[#E30613] px-8 py-4 text-sm font-black tracking-widest hover:bg-[#14284d] hover:text-white transition-colors duration-300"
            >
              BİZE ULAŞIN
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default StaticPage;