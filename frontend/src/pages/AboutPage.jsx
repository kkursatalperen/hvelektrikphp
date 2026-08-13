import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Globe, Users, Zap, Award, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";
import WhyUs from "../components/WhyUs";
import PartnersSlider from "../components/PartnersSlider";
import StandardsSlider from "../components/StandardsSlider";
import Reveal from "../components/Reveal";

/* ── Animated counter ── */
const Counter = ({ target, suffix = "", prefix = "", decimal = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimal]);

  return (
    <span ref={ref}>
      {prefix}{decimal ? count.toFixed(1) : count}{suffix}
    </span>
  );
};


/* ══════════════════════════════════════════════════════════ */
const AboutPage = ({ subpage } = {}) => {
  const { t, lang } = useI18n();

  return (
    <>
      <SEO title={t("about_page_title")} description={t("about_p1")} path="/hakkimizda" />
      <Header />
      <main>

        {/* ══ HERO — sayfaya özgü imza: gerilim dalga formu + kuruluş yılı tezi (stok fotoğraf yok) ══ */}
        <section className="relative min-h-[92vh] flex items-center bg-[#0a1930] overflow-hidden">
          {/* Gerilim dalga formu — arka planda dekoratif SVG, elektrik mühendisliği temasına özgü */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.12]"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M -50 500 Q 100 300, 250 500 T 550 500 T 850 500 T 1150 500 T 1450 500"
              fill="none" stroke="#E30613" strokeWidth="2"
            />
            <path
              d="M -50 560 Q 100 400, 250 560 T 550 560 T 850 560 T 1150 560 T 1450 560"
              fill="none" stroke="#ffffff" strokeWidth="1"
            />
          </svg>
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-[#E30613] opacity-[0.10] blur-[160px]" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6 py-40 w-full">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-10">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{t("about_page_title")}</span>
            </nav>

            <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-end">
              {/* Sol: kuruluş yılından bu yana geçen süre — sayfanın tezi */}
              <div className="shrink-0">
                <span className="text-[10px] font-bold tracking-[0.35em] text-[#E30613] block mb-3">
                  {lang === "tr" ? "İZMİR'DEN BU YANA" : "FROM IZMIR SINCE"}
                </span>
                <div className="text-[7rem] md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter">
                  2014
                </div>
              </div>

              {/* Sağ: başlık ve açıklama */}
              <div className="pb-2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.35em] text-[#E30613]">
                    {lang === "tr" ? "HV ELEKTRİK PROJE TAAHHÜT" : "HV ELEKTRIK PROJECT CONTRACTING"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
                  {lang === "tr" ? "Güvenli güç, mühendislik vizyonu." : "Reliable power, engineering vision."}
                </h1>
                <p className="text-white/60 text-lg max-w-xl leading-relaxed">
                  {lang === "tr"
                    ? "İzmir’den çıkan mühendislik gücümüzle, enerjinin iletiminden dijital otomasyonuna kadar her adımda anahtar teslim ve güvenilir çözümler üretiyoruz."
                    : "With our engineering power rising from Izmir, we produce turnkey and reliable solutions at every step from energy transmission to digital automation."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MİSYON & VİZYON ══ */}
        <section className="bg-[#f7f8fa] py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
              {/* Misyon */}
              <div className="relative overflow-hidden p-10 md:p-12 bg-[#0a1930] group cursor-default transition-transform duration-500 hover:-translate-y-1">
                <div className="absolute bottom-[-1rem] right-[-1rem] text-[140px] md:text-[180px] font-black leading-none text-white opacity-[0.04] pointer-events-none transition-all duration-700 group-hover:scale-105 group-hover:opacity-[0.07] select-none">M</div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#E30613] animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                    {lang === "tr" ? "Misyonumuz" : "Our Mission"}
                  </span>
                </div>
                <div className="h-[2px] bg-[#E30613] mb-6" style={{ width: "48px" }} />
                <p className="text-xl md:text-2xl font-bold text-white leading-snug mb-4">
                  {lang === "tr"
                    ? "Deneyimli uzman kadromuz ve üst düzey hizmet anlayışımızla, son teknoloji ve standartları kullanarak müşterilerimize ve tüm paydaşlarımıza maksimum fayda sağlamak."
                    : "To provide maximum benefit to our clients and all stakeholders, using the latest technology and standards, with our experienced expert team and high-level service approach."}
                </p>
              </div>

              {/* Vizyon */}
              <div className="relative overflow-hidden p-10 md:p-12 bg-[#E30613] group cursor-default transition-transform duration-500 hover:-translate-y-1">
                <div className="absolute bottom-[-1rem] right-[-1rem] text-[140px] md:text-[180px] font-black leading-none text-white opacity-[0.07] pointer-events-none transition-all duration-700 group-hover:scale-105 group-hover:opacity-[0.12] select-none">V</div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-[6px] h-[6px] rounded-full bg-white/60 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">
                    {lang === "tr" ? "Vizyonumuz" : "Our Vision"}
                  </span>
                </div>
                <div className="h-[2px] bg-white/50 mb-6" style={{ width: "48px" }} />
                <p className="text-xl md:text-2xl font-bold text-white leading-snug mb-4">
                  {lang === "tr"
                    ? "Sektörünün lideri ve yerli-yabancı tüm firmaların ilk tercihi olmak."
                    : "To be the leader of the sector and the first choice of all domestic and foreign companies."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Reveal><WhyUs /></Reveal>
        <Reveal delay={100}><PartnersSlider /></Reveal>
        <Reveal delay={150}><StandardsSlider /></Reveal>

        {/* ══ CTA ══ */}
        <section className="relative bg-[#E30613] py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #fff 0%, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                {lang === "tr" ? "Projenizi Birlikte Hayata Geçirelim." : "Let's Bring Your Project to Life Together."}
              </h3>
              <p className="text-white/70 max-w-lg">
                {lang === "tr"
                  ? "Ağır güç sistemlerinden akıllı SCADA otomasyonuna kadar tüm mühendislik ihtiyaçlarınız için uzman ekibimizle iletişime geçin."
                  : "Contact our expert team for all your engineering needs, from heavy power systems to smart SCADA automation."}
              </p>
            </div>
            <Link
              to="/iletisim"
              className="shrink-0 flex items-center gap-3 bg-white text-[#E30613] px-8 py-4 text-sm font-black tracking-widest hover:bg-[#0a1930] hover:text-white transition-colors duration-300"
            >
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

export default AboutPage;