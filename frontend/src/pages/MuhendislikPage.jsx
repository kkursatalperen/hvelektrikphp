import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const steps = [
  {
    num: "01",
    tr: { title: "Sistem Analizi & Tasarım", desc: "Otomasyon ihtiyaç analizi, PLC/RTU mimarisi ve haberleşme protokolü tasarımı ile projenin temelini atıyoruz." },
    en: { title: "System Analysis & Design", desc: "We lay the foundation of the project with automation needs analysis, PLC/RTU architecture and communication protocol design." },
  },
  {
    num: "02",
    tr: { title: "PLC & RTU Programlama", desc: "Kontrol mantığı geliştirme, PLC/RTU programlama ve saha ekipmanı entegrasyonu." },
    en: { title: "PLC & RTU Programming", desc: "Control logic development, PLC/RTU programming and field equipment integration." },
  },
  {
    num: "03",
    tr: { title: "SCADA Yazılım Geliştirme", desc: "İzleme ekranları, alarm yönetimi ve raporlama modülleri içeren SCADA yazılımı geliştirme." },
    en: { title: "SCADA Software Development", desc: "Developing SCADA software with monitoring screens, alarm management and reporting modules." },
  },
  {
    num: "04",
    tr: { title: "TEDAŞ/TEİAŞ Entegrasyonu", desc: "Resmi kurum haberleşme protokolleri ve veri paylaşım standartlarına uyum sağlıyoruz." },
    en: { title: "TEDAŞ/TEİAŞ Integration", desc: "We ensure compliance with official authority communication protocols and data-sharing standards." },
  },
  {
    num: "05",
    tr: { title: "Saha Devreye Alma", desc: "Datalogger kurulumu, saha testleri, kabul prosedürleri ve personel eğitimi." },
    en: { title: "Field Commissioning", desc: "Datalogger installation, field tests, acceptance procedures and personnel training." },
  },
  {
    num: "06",
    tr: { title: "Uzaktan İzleme & Destek", desc: "7/24 uzaktan izleme, acil müdahale ve teknik destek ekibimiz her an yanınızda." },
    en: { title: "Remote Monitoring & Support", desc: "24/7 remote monitoring, emergency response and our technical support team are always by your side." },
  },
];

const MuhendislikPage = () => {
  const { t, lang } = useI18n();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <SEO title={t("engineering_title")} path="/hizmetler/muhendislik"
        image="https://images.unsplash.com/photo-1638068109816-651dc602fe4c" />
      <Header />
      <main>

        {/* ══ HERO ══ */}
        <section className="relative min-h-[70vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy" src="https://images.unsplash.com/photo-1638068109816-651dc602fe4c" alt="Mühendislik"
            className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1930] via-[#0a1930]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930] via-transparent to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />
          <div className="relative max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              <ChevronRight size={12} />
              <Link to="/hizmetler" className="hover:text-[#E30613] transition-colors">{t("cat_title")}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{t("engineering_title")}</span>
            </nav>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV ELEKTRİK SCADA & İZLEME</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6 max-w-3xl">
              {t("engineering_title")}
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">{t("engineering_body")}</p>
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { v: "PLC/RTU", l: { tr: "Otomasyon", en: "Automation" } },
                { v: "100+", l: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
                { v: "7/24", l: { tr: "Teknik Destek", en: "Technical Support" } },
              ].map((s, i) => (
                <div key={i} className="border-l-2 border-[#E30613] pl-4">
                  <div className="text-3xl font-black text-white">{s.v}</div>
                  <div className="text-xs text-white/40 tracking-widest uppercase">{s.l[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SÜREÇ ADIMLARI ══ */}
        <section className="bg-[#f7f8fa] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                {lang === "tr" ? "OTOMASYON SÜRECİ" : "AUTOMATION PROCESS"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a1930] mb-16 leading-tight">
              {lang === "tr" ? "Tasarımdan İzlemeye" : "From Design to Monitoring"}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Sol: adım listesi */}
              <div className="space-y-px">
                {steps.map((s, i) => {
                  const c = s[lang] || s.tr;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-full flex items-start gap-6 p-8 text-left transition-all duration-300 ${
                        activeStep === i
                          ? "bg-[#0a1930]"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span className={`text-3xl font-black shrink-0 transition-colors duration-300 ${
                        activeStep === i ? "text-[#E30613]" : "text-gray-200"
                      }`}>{s.num}</span>
                      <div>
                        <div className={`font-black mb-1 transition-colors duration-300 ${
                          activeStep === i ? "text-white" : "text-[#0a1930]"
                        }`}>{c.title}</div>
                        <div className={`text-sm leading-relaxed transition-colors duration-300 ${
                          activeStep === i ? "text-white/50" : "text-gray-400"
                        }`}>{c.desc}</div>
                      </div>
                      {activeStep === i && (
                        <div className="ml-auto shrink-0 w-1 self-stretch bg-[#E30613]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sağ: aktif adım detay */}
              <div className="bg-[#0a1930] p-12 flex flex-col justify-center relative overflow-hidden sticky top-24 self-start">
                <div className="absolute top-0 right-0 text-[160px] font-black text-white/3 leading-none select-none pointer-events-none">
                  {steps[activeStep].num}
                </div>
                <div className="h-[2px] w-8 bg-[#E30613] mb-8" />
                <div className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] mb-4 uppercase">
                  {lang === "tr" ? `ADIM ${steps[activeStep].num}` : `STEP ${steps[activeStep].num}`}
                </div>
                <h3 className="text-3xl font-black text-white mb-6 leading-tight">
                  {(steps[activeStep][lang] || steps[activeStep].tr).title}
                </h3>
                <p className="text-white/60 leading-relaxed text-lg">
                  {(steps[activeStep][lang] || steps[activeStep].tr).desc}
                </p>
                <Link to="/iletisim"
                  className="mt-10 inline-flex items-center gap-3 border border-[#E30613] text-[#E30613] px-6 py-3 text-sm font-bold tracking-widest hover:bg-[#E30613] hover:text-white transition-colors duration-300 w-fit">
                  {lang === "tr" ? "DANIŞMANLIK AL" : "GET CONSULTING"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="relative bg-[#E30613] py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #fff 0%, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                {lang === "tr" ? "Sisteminizi birlikte tasarlayalım." : "Let's design your system together."}
              </h3>
              <p className="text-white/70 max-w-lg">
                {lang === "tr"
                  ? "Otomasyon ve izleme ekibimiz tasarımdan devreye almaya her aşamada yanınızda."
                  : "Our automation and monitoring team is with you at every stage from design to commissioning."}
              </p>
            </div>
            <Link to="/iletisim"
              className="shrink-0 flex items-center gap-3 bg-white text-[#E30613] px-8 py-4 text-sm font-black tracking-widest hover:bg-[#0a1930] hover:text-white transition-colors duration-300">
              {lang === "tr" ? "İLETİŞİME GEÇ" : "CONTACT US"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default MuhendislikPage;