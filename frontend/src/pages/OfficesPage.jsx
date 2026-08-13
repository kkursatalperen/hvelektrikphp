import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";
import GlobalPresence from "../components/GlobalPresence";

const offices = [
  {
    id: "izmir",
    flag: "🇹🇷",
    country: { tr: "Türkiye", en: "Turkey" },
    city: "İzmir",
    type: { tr: "GENEL MERKEZ", en: "HEADQUARTERS" },
    address: "KOSBİ Gazi Bulvarı No:177 Kat:2 D:16, Kemalpaşa / İZMİR",
    phone: "+90 232 504 67 79",
    email: "info@hvelektrik.com",
    image: "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg",
    highlight: true,
  },
];

const OfficesPage = () => {
  const { lang, t } = useI18n();
  const [active, setActive] = useState("izmir");
  const activeOffice = offices.find((o) => o.id === active);

  return (
    <>
      <SEO title={t("offices_title")} path="/hakkimizda/ofisler" />
      <Header />
      <main>

        {/* ── Hero ── */}
        <section className="relative min-h-[60vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy"
            src="https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg"
            alt="Ofisler"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930] via-[#0a1930]/50 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6 pb-20 pt-44 w-full">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              <ChevronRight size={12} />
              <Link to="/hakkimizda" className="hover:text-[#E30613] transition-colors">{t("about_page_title")}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{t("offices_title")}</span>
            </nav>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">
                {lang === "tr" ? "7 ÜLKE · 5 KITA" : "7 COUNTRIES · 5 CONTINENTS"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-2">
              {lang === "tr" ? "Dünyaya Yayılan" : "Offices Spread"}
            </h1>
            <h1
              className="text-5xl md:text-7xl font-black leading-none tracking-tight"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)", color: "transparent" }}
            >
              {lang === "tr" ? "Ofislerimiz." : "Across the World."}
            </h1>
          </div>
        </section>

{/* ── Global map ── */}
        <GlobalPresence />
        
        {/* ── Interactive offices ── */}
        <section className="bg-white py-0">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">

              {/* Left: office list */}
              <div className="lg:col-span-2 border-r border-gray-100">
                {offices.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setActive(o.id)}
                    className={`w-full flex items-center gap-4 px-8 py-6 border-b border-gray-50 text-left transition-all duration-300 group ${
                      active === o.id ? "bg-[#0a1930]" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl">{o.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[9px] font-bold tracking-[0.2em] mb-1 ${active === o.id ? "text-[#E30613]" : "text-gray-400"}`}>
                        {o.type[lang] || o.type.tr}
                      </div>
                      <div className={`font-black text-sm ${active === o.id ? "text-white" : "text-[#0a1930]"}`}>
                        {o.city}
                      </div>
                      <div className={`text-xs ${active === o.id ? "text-white/50" : "text-gray-400"}`}>
                        {o.country[lang] || o.country.tr}
                      </div>
                    </div>
                    {active === o.id && (
                      <div className="w-1 h-8 bg-[#E30613] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Right: office detail */}
              {activeOffice && (
                <div className="lg:col-span-3 relative overflow-hidden">
                  <img loading="lazy"
                    key={activeOffice.id}
                    src={activeOffice.image}
                    alt={activeOffice.city}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a1930]/95 to-[#0a1930]/70" />

                  <div className="relative p-12 h-full flex flex-col justify-between" style={{ minHeight: "400px" }}>
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">{activeOffice.flag}</span>
                        <div>
                          <div className="text-[9px] font-bold tracking-[0.2em] text-[#E30613] uppercase">
                            {activeOffice.type[lang] || activeOffice.type.tr}
                          </div>
                          <h3 className="text-2xl font-black text-white">{activeOffice.city}</h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-[#E30613] mt-0.5 shrink-0" />
                          <span className="text-white/70 text-sm leading-relaxed">{activeOffice.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-[#E30613] shrink-0" />
                          <a href={`tel:${activeOffice.phone}`} className="text-white/70 text-sm hover:text-white transition-colors">
                            {activeOffice.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-[#E30613] shrink-0" />
                          <a href={`mailto:${activeOffice.email}`} className="text-white/70 text-sm hover:text-white transition-colors">
                            {activeOffice.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="h-px bg-white/10 mb-8" />
                      <Link
                        to="/iletisim"
                        className="inline-flex items-center gap-3 text-xs font-black text-[#E30613] tracking-widest hover:gap-5 transition-all duration-300"
                      >
                        {lang === "tr" ? "İLETİŞİME GEÇ" : "GET IN TOUCH"}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Coverage stats ── */}
        <section className="bg-[#E30613] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
              {[
                { v: "1", l: { tr: "Merkez Ofis", en: "Head Office" } },
                { v: "100+", l: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
                { v: "+50", l: { tr: "Çalışan", en: "Employees" } },
                { v: "24/7", l: { tr: "Teknik Destek", en: "Technical Support" } },
              ].map((s, i) => (
                <div key={i} className="py-8 px-6 text-center">
                  <div className="text-4xl font-black text-white mb-1">{s.v}</div>
                  <div className="text-xs tracking-widest text-white/70 uppercase">{s.l[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default OfficesPage;