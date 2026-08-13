import React from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, MapPin, Calendar, Zap, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const categoryLabels = {
  ges:    { tr: "GES",           en: "Solar" },
  res:    { tr: "RES",           en: "Wind" },
  trafo:  { tr: "Trafo Merkezi", en: "Substation" },
  iletim: { tr: "İletim Hattı",  en: "Transmission" },
  diger:  { tr: "Diğer",         en: "Other" },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { lang } = useI18n();
  const { projects = [], loading } = useSiteData();

  const project = projects.find((p) => String(p.id) === String(id));
  const title = project ? (lang === "tr" ? project.title_tr : project.title_en) : "";
  const desc = project ? (lang === "tr" ? project.desc_tr : project.desc_en) : "";
  const catLabel = project ? (lang === "tr" ? categoryLabels[project.category]?.tr : categoryLabels[project.category]?.en) || project.category : "";
  const images = project?.images?.length ? project.images : (project?.image ? [project.image] : []);

  if (!loading && !project) {
    return (
      <>
        <SEO title={lang === "tr" ? "Proje Bulunamadı" : "Project Not Found"} path="/projeler" />
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center bg-white">
          <div className="text-center px-6">
            <h1 className="text-2xl font-black text-[#14284d] mb-4">
              {lang === "tr" ? "Proje bulunamadı" : "Project not found"}
            </h1>
            <Link to="/projeler" className="text-[#E30613] font-bold text-sm">
              {lang === "tr" ? "← Tüm Projelere Dön" : "← Back to Projects"}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title={title || "Proje"} path={`/projeler/${id}`} />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-[#0a1930] overflow-hidden pt-40 pb-16">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />
          <div className="relative max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{lang === "tr" ? "Ana Sayfa" : "Home"}</Link>
              <ChevronRight size={12} />
              <Link to="/projeler" className="hover:text-[#E30613] transition-colors">{lang === "tr" ? "Projelerimiz" : "Our Projects"}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{title}</span>
            </nav>

            {project && (
              <>
                <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                  {project.country && (
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#E30613]" />{project.country}</span>
                  )}
                  {project.year && (
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#E30613]" />{project.year}</span>
                  )}
                  <span className="flex items-center gap-1.5"><Zap size={13} className="text-[#E30613]" />{catLabel}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-3xl">{title}</h1>
              </>
            )}
          </div>
        </section>

        {/* Content */}
        {project && (
          <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12">
                {/* Görsel galeri */}
                <div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                      <img loading="lazy" src={images[0]} alt={title} className="w-full aspect-video object-cover" />
                      {images.length > 1 && (
                        <div className="grid grid-cols-3 gap-4">
                          {images.slice(1, 4).map((img, i) => (
                            <img key={i} loading="lazy" src={img} alt={`${title} ${i + 2}`} className="w-full aspect-square object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bilgi paneli */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="h-[2px] w-8 bg-[#E30613]" />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                      {lang === "tr" ? "PROJE DETAYI" : "PROJECT DETAIL"}
                    </span>
                  </div>

                  {desc && (
                    <p className="text-gray-600 leading-relaxed mb-8 border-l-2 border-[#E30613]/30 pl-4">{desc}</p>
                  )}

                  <div className="space-y-4 border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold tracking-wide uppercase text-xs">{lang === "tr" ? "Kategori" : "Category"}</span>
                      <span className="text-[#14284d] font-bold">{catLabel}</span>
                    </div>
                    {project.country && (
                      <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                        <span className="text-gray-400 font-bold tracking-wide uppercase text-xs">{lang === "tr" ? "Konum" : "Location"}</span>
                        <span className="text-[#14284d] font-bold">{project.country}</span>
                      </div>
                    )}
                    {project.year && (
                      <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                        <span className="text-gray-400 font-bold tracking-wide uppercase text-xs">{lang === "tr" ? "Yıl" : "Year"}</span>
                        <span className="text-[#14284d] font-bold">{project.year}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                      <span className="text-gray-400 font-bold tracking-wide uppercase text-xs">{lang === "tr" ? "Durum" : "Status"}</span>
                      <span className="text-[#14284d] font-bold">
                        {project.status === "devam"
                          ? (lang === "tr" ? "Devam Ediyor" : "Ongoing")
                          : (lang === "tr" ? "Tamamlandı" : "Completed")}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/projeler"
                    className="mt-10 inline-flex items-center gap-2 text-[#E30613] text-sm font-bold tracking-wide hover:gap-3 transition-all duration-300"
                  >
                    <ArrowLeft size={14} />
                    {lang === "tr" ? "Tüm Projelere Dön" : "Back to All Projects"}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProjectDetail;