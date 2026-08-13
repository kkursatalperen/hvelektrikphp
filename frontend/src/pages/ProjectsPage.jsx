import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import ProjectsShowcase from "../components/ProjectsShowcase";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const categoryLabels = {
  ges: { tr: "GES", en: "Solar" },
  res: { tr: "RES", en: "Wind" },
  trafo: { tr: "Trafo Merkezi", en: "Substation" },
  iletim: { tr: "İletim Hattı", en: "Transmission" },
  diger: { tr: "Diğer", en: "Other" },
};

const ProjectsPage = ({ filter }) => {
  const { lang } = useI18n();
  const { projects = [] } = useSiteData();

  const getTitle = () => {
    if (filter === "devam") return lang === "tr" ? "Devam Eden Projeler" : "Ongoing Projects";
    if (filter === "tamamlanan") return lang === "tr" ? "Tamamlanan Projeler" : "Completed Projects";
    return lang === "tr" ? "Projelerimiz" : "Our Projects";
  };

  // Mozaik için gerçek proje görselleri — sabit stok fotoğraf yerine sitenin kendi verisinden
  const mosaicSource = projects.filter((p) => p.images?.[0] || p.image).slice(0, 5);

  // Kategori kırılımı — gerçek veriden hesaplanan sayılar, uydurma yok
  const categoryCounts = projects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <SEO title={getTitle()} path="/projeler" />
      <Header />
      <main>
        {/* ══ HERO — gerçek proje mozaiği + kategori kırılımı (stok fotoğraf yok) ══ */}
        <section className="relative bg-[#0a1930] overflow-hidden pt-40 pb-0">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">
                {lang === "tr" ? "Ana Sayfa" : "Home"}
              </Link>
              <ChevronRight size={12} />
              <Link to="/projeler" className="hover:text-[#E30613] transition-colors">
                {lang === "tr" ? "Projelerimiz" : "Our Projects"}
              </Link>
              {filter && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-white">{getTitle()}</span>
                </>
              )}
            </nav>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-end pb-16">
              {/* Sol: başlık + kategori kırılımı */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV ELEKTRİK</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
                  {getTitle()}
                </h1>
                <p className="text-white/50 text-lg max-w-xl leading-relaxed mb-10">
                  {lang === "tr"
                    ? "Türkiye genelinde tamamladığımız 100'ü aşkın proje."
                    : "100+ projects we have completed across Turkey."}
                </p>

                {Object.keys(categoryCounts).length > 0 && (
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {Object.entries(categoryCounts).map(([cat, count]) => (
                      <div key={cat}>
                        <div className="text-2xl font-black text-white">{count}</div>
                        <div className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                          {lang === "tr" ? (categoryLabels[cat]?.tr || cat) : (categoryLabels[cat]?.en || cat)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sağ: gerçek proje fotoğraflarından oluşan mozaik */}
              {mosaicSource.length > 0 && (
                <div className="hidden lg:grid grid-cols-3 gap-2 h-64">
                  <div className="col-span-2 row-span-2 overflow-hidden">
                    <img loading="lazy" src={mosaicSource[0].images?.[0] || mosaicSource[0].image}
                      alt="" className="w-full h-full object-cover" />
                  </div>
                  {mosaicSource.slice(1, 5).map((p, i) => (
                    <div key={p.id || i} className="overflow-hidden">
                      <img loading="lazy" src={p.images?.[0] || p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <ProjectsShowcase filter={filter} />

      </main>
      <Footer />
    </>
  );
};

export default ProjectsPage;