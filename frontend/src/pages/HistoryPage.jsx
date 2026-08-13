import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const milestones = [
  {
    year: "2014",
    tr: { title: "Kuruluş", desc: "HV Elektrik, İzmir'de bir elektrik taahhüt ofisi olarak kuruldu. Anahtar teslim elektrik taahhüt projeleriyle yolculuğumuza başladık.", tag: "Başlangıç" },
    en: { title: "Foundation", desc: "HV Elektrik was founded in Izmir as an electrical contracting office. We began our journey with turn-key electrical contracting projects.", tag: "Beginning" },
  },
  {
    year: "2016",
    tr: { title: "Mühendislik Kolu", desc: "Fizibilite, avan proje ve teknik danışmanlık hizmetlerine odaklanan HV Proje Mühendislik'i kurduk.", tag: "Mühendislik" },
    en: { title: "Engineering Arm", desc: "We established HV Proje Mühendislik, focused on feasibility, preliminary design and technical consulting services.", tag: "Engineering" },
  },
  {
    year: "2018",
    tr: { title: "Yenilenebilir Enerjiye Giriş", desc: "HES ve GES projelerinde saha müteahhitliği hizmeti vermeye başladık." , tag: "Yenilenebilir" },
    en: { title: "Entry into Renewables", desc: "We began providing field contracting services for hydroelectric and solar power projects.", tag: "Renewable" },
  },
  {
    year: "2020",
    tr: { title: "Kamu ve Kurumsal Projeler", desc: "Hastane, ceza infaz kurumu ve üniversite kampüsleri gibi nitelikli üst yapı projelerinde elektromekanik işler üstlendik.", tag: "Kurumsal" },
    en: { title: "Public & Institutional Projects", desc: "We undertook electromechanical works in qualified superstructure projects such as hospitals, correctional facilities and university campuses.", tag: "Institutional" },
  },
  {
    year: "2023",
    tr: { title: "Otomasyon ve SCADA", desc: "TEDAŞ/TEİAŞ uyumlu SCADA/DCS otomasyon çözümlerini hizmet portföyümüze ekledik.", tag: "Otomasyon" },
    en: { title: "Automation & SCADA", desc: "We added TEDAŞ/TEİAŞ compliant SCADA/DCS automation solutions to our service portfolio.", tag: "Automation" },
  },
  {
    year: "2024",
    tr: { title: "100'den Fazla Tamamlanan Proje", desc: "Türkiye genelinde enerji santrallerinden alışveriş merkezlerine, hastanelerden konut projelerine kadar 100'ü aşkın işi başarıyla teslim ettik.", tag: "Bugün" },
    en: { title: "100+ Completed Projects", desc: "We successfully delivered more than 100 projects across Turkey, from power plants to shopping malls, hospitals to residential developments.", tag: "Today" },
  },
];

const HistoryPage = () => {
  const { t, lang } = useI18n();
  const [visible, setVisible] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    const observers = refs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisible((prev) => [...new Set([...prev, i])]); },
        { threshold: 0.15 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
      <SEO title={t("history_title")} description={t("history_body")} path="/hakkimizda/tarihce" />
      <Header />
      <main>

        {/* ── Hero ── */}
        <section className="relative min-h-[60vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy"
            src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg"
            alt="Tarihçe"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930] via-[#0a1930]/50 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6 pb-20 pt-44 w-full">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              <ChevronRight size={12} />
              <Link to="/hakkimizda" className="hover:text-[#E30613] transition-colors">{t("about_page_title")}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{t("history_title")}</span>
            </nav>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">2014 — 2024</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-2">
              {lang === "tr" ? "10 Yıllık" : "A 10-Year"}
            </h1>
            <h1
              className="text-5xl md:text-7xl font-black leading-none tracking-tight"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)", color: "transparent" }}
            >
              {lang === "tr" ? "Yolculuk." : "Journey."}
            </h1>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="bg-[#f7f8fa] py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative">
              {/* Center spine */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-px" />

              <div className="space-y-10">
                {milestones.map((m, i) => {
                  const content = m[lang] || m.tr;
                  const isLeft = i % 2 === 0;
                  const isVis = visible.includes(i);

                  return (
                    <div
                      key={i}
                      ref={(el) => (refs.current[i] = el)}
                      className={`relative flex items-center transition-all duration-700 ${
                        isVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      } md:gap-0 gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      {/* Card */}
                      <div className="w-full md:w-[calc(50%-2.5rem)] group">
                        <div className={`bg-white p-8 border border-gray-100 hover:border-[#E30613]/20 hover:shadow-xl transition-all duration-500 relative ${isLeft ? "md:mr-0" : "md:ml-0"}`}>
                          {/* Tag */}
                          <span className="inline-block text-[9px] font-bold tracking-[0.25em] text-[#E30613] mb-5 uppercase">
                            — {content.tag}
                          </span>

                          {/* Year — large background */}
                          <div className="absolute top-4 right-6 text-[64px] font-black text-gray-200 leading-none select-none pointer-events-none group-hover:text-[#E30613]/15 transition-colors duration-500">
                            {m.year}
                          </div>

                          <h3 className="text-xl font-black text-[#0a1930] mb-3 relative">{content.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed relative">{content.desc}</p>

                          {/* Bottom accent */}
                          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#E30613] group-hover:w-full transition-all duration-500" />
                        </div>
                      </div>

                      {/* Center dot + year label */}
                      <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 z-10">
                        <div className="w-3 h-3 rounded-full bg-[#E30613] border-[3px] border-white shadow-md" />
                      </div>

                      {/* Spacer */}
                      <div className="hidden md:block w-[calc(50%-2.5rem)]" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#0a1930] py-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">
                {lang === "tr" ? "Hikayemizin bir parçası olun." : "Be part of our story."}
              </h3>
              <p className="text-white/40 text-sm">
                {lang === "tr" ? "Kariyer fırsatları için bize ulaşın." : "Contact us for career opportunities."}
              </p>
            </div>
            <Link
              to="/kariyer"
              className="shrink-0 flex items-center gap-3 bg-[#E30613] text-white px-8 py-4 text-sm font-black tracking-widest hover:bg-white hover:text-[#E30613] transition-colors duration-300"
            >
              {lang === "tr" ? "KARİYER" : "CAREER"}
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default HistoryPage;