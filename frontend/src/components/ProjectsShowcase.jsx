import React, { useState } from "react";
import { ArrowRight, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const categoryLabels = {
  ges:    { tr: "GES",           en: "Solar" },
  res:    { tr: "RES",           en: "Wind" },
  trafo:  { tr: "Trafo Merkezi", en: "Substation" },
  iletim: { tr: "İletim Hattı",  en: "Transmission" },
  diger:  { tr: "Diğer",         en: "Other" },
};

// Yeni:
const ProjectsShowcase = ({ filter }) => {
  const { lang } = useI18n();
  const { projects = [] } = useSiteData();
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Sayfa filter'ına göre projeleri filtrele
  const pageFiltered = filter === "devam"
    ? projects.filter((p) => p.status === "devam")
    : filter === "tamamlanan"
    ? projects.filter((p) => !p.status || p.status === "tamamlanan")
    : projects;
  const [hovered, setHovered] = useState(null);

  // Mevcut kategorileri dinamik oluştur
  const filters = ["ALL", ...Array.from(new Set(pageFiltered.map((p) => p.category)))];

  const filtered = activeFilter === "ALL"
  ? pageFiltered
  : pageFiltered.filter((p) => p.category === activeFilter);

  if (projects.length === 0) return null;

  return (
    <section className="bg-[#f7f8fa] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[#E30613] text-xs font-bold tracking-[0.3em]">
                {lang === "tr" ? "REFERANS PROJELERİMİZ" : "OUR REFERENCE PROJECTS"}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#14284d]">
              {filter === "devam"
                ? (lang === "tr" ? "Devam Eden Projeler" : "Ongoing Projects")
                : filter === "tamamlanan"
                ? (lang === "tr" ? "Tamamlanan Projeler" : "Completed Projects")
                : (lang === "tr" ? "Tüm Projelerimiz" : "All Our Projects")}
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-xs font-bold tracking-widest transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-[#E30613] text-white"
                    : "bg-white text-[#14284d] border border-gray-200 hover:border-[#E30613] hover:text-[#E30613]"
                }`}
              >
                {f === "ALL"
                  ? "ALL"
                  : (lang === "tr"
                      ? (categoryLabels[f]?.tr || f.toUpperCase())
                      : (categoryLabels[f]?.en || f.toUpperCase()))}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const mainImg = project.images?.[0] || project.image;
            const catLabel = lang === "tr"
              ? (categoryLabels[project.category]?.tr || project.category)
              : (categoryLabels[project.category]?.en || project.category);

            return (
              <Link
                to={`/projeler/${project.id}`}
                key={project.id}
                className="hv-card-lift group relative overflow-hidden aspect-[4/3] cursor-pointer block"
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <img loading="lazy"
                  src={mainImg}
                  alt={lang === "tr" ? project.title_tr : project.title_en}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-[#E30613] text-white text-[9px] font-black tracking-widest px-3 py-1.5">
                  {catLabel}
                </div>

                {/* Year */}
                <div className="absolute top-4 right-4 text-white/60 text-xs font-bold">
                  {project.year}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                    <MapPin size={10} className="text-[#E30613]" />
                    {project.country}
                  </div>
                  <h3 className="text-white font-black text-lg leading-tight mb-2">
                    {lang === "tr" ? project.title_tr : project.title_en}
                  </h3>
                  {(project.desc_tr || project.desc_en) && (
                    <p className="text-white/55 text-xs leading-relaxed mb-3 line-clamp-2 border-l-2 border-[#E30613]/40 pl-2.5">
                      {lang === "tr" ? project.desc_tr : project.desc_en}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5">
                      <Zap size={12} className="text-[#E30613]" />
                      <span className="text-white text-xs font-bold">{catLabel}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-[#E30613] text-xs font-bold transition-all duration-300 ${hovered === project.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
                      {lang === "tr" ? "İNCELE" : "VIEW"} <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/projeler"
            className="inline-flex items-center gap-3 border-2 border-[#14284d] text-[#14284d] px-8 py-4 text-sm font-black tracking-widest hover:bg-[#14284d] hover:text-white transition-all duration-300 group"
          >
            {lang === "tr" ? "TÜM PROJELERİ GÖR" : "VIEW ALL PROJECTS"}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;