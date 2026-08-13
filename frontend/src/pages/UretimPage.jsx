import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";
import { Zap, Plug, BarChart3, BatteryCharging, Cable, ClipboardCheck } from "lucide-react";

const products = [
  {
    icon: Zap, tag: "CE",
    tr: { title: "AG/OG Pano Sistemleri", desc: "Alçak ve orta gerilim pano sistemlerinin kurulumu, kablolama ve devreye alınması." },
    en: { title: "LV/MV Panel Systems", desc: "Installation, cabling and commissioning of low and medium voltage panel systems." },
  },
  {
    icon: Plug, tag: "ISO 9001",
    tr: { title: "MCC Panoları", desc: "Mekanik kuvvet (MCC) panolarının saha montajı ve devreye alma işleri." },
    en: { title: "MCC Panels", desc: "Field installation and commissioning of motor control center (MCC) panels." },
  },
  {
    icon: BarChart3, tag: "CE",
    tr: { title: "Kompanzasyon Sistemleri", desc: "Güç faktörü iyileştirme ve reaktif güç kompanzasyon sistemlerinin kurulumu." },
    en: { title: "Compensation Systems", desc: "Installation of power factor correction and reactive power compensation systems." },
  },
  {
    icon: BatteryCharging, tag: "ISO 9001",
    tr: { title: "UPS – Kesintisiz Güç Kaynağı", desc: "Kritik yükler için kesintisiz güç kaynağı sistemlerinin kurulumu ve devreye alınması." },
    en: { title: "UPS – Uninterrupted Power Supply", desc: "Installation and commissioning of uninterrupted power supply systems for critical loads." },
  },
  {
    icon: Cable, tag: "CE",
    tr: { title: "Güç ve Kumanda Terminasyonu", desc: "Kablo sonlandırma, bara bağlantıları ve kumanda devresi terminasyon işleri." },
    en: { title: "Power & Control Termination", desc: "Cable termination, busbar connections and control circuit termination works." },
  },
  {
    icon: ClipboardCheck, tag: "TEDAŞ/TEİAŞ",
    tr: { title: "Sistem Odası Test & Kabul", desc: "Sistem odası ve saha panolarında elektriksel testler, FAT/SAT ve kabul işlemleri." },
    en: { title: "System Room Test & Acceptance", desc: "Electrical tests, FAT/SAT and acceptance procedures for system rooms and field panels." },
  },
];

const stats = [
  { value: "100+", label: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
  { value: "+50",  label: { tr: "Çalışan", en: "Employees" } },
  { value: "ISO 9001", label: { tr: "Sertifikalı", en: "Certified" } },
  { value: "CE", label: { tr: "Uygunluk", en: "Conformity" } },
];

const UretimPage = () => {
  const { t, lang } = useI18n();

  return (
    <>
      <SEO title={t("production_title")} path="/hizmetler/uretim"
        image="https://images.pexels.com/photos/18468536/pexels-photo-18468536.jpeg" />
      <Header />
      <main>

        {/* ══ HERO ══ */}
        <section className="relative min-h-[70vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy"
            src="https://images.pexels.com/photos/18468536/pexels-photo-18468536.jpeg"
            alt="Pano ve Donanım Entegrasyonu"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1930] via-[#0a1930]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930] via-transparent to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              <ChevronRight size={12} />
              <Link to="/hizmetler" className="hover:text-[#E30613] transition-colors">{t("cat_title")}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{t("production_title")}</span>
            </nav>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV ELEKTRİK GÜÇ SİSTEMLERİ</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6 max-w-3xl">
              {t("production_title")}
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">{t("production_body")}</p>
          </div>
        </section>

        {/* ══ STATS STRIP ══ */}
        <div className="bg-[#0a1930] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {stats.map((s, i) => (
                <div key={i} className="py-8 px-6 text-center">
                  <div className="text-2xl font-black text-[#E30613] mb-1">{s.value}</div>
                  <div className="text-xs tracking-widest text-white/40 uppercase">{s.label[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ ÜRÜN GRID ══ */}
        <section className="bg-[#f7f8fa] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                {lang === "tr" ? "HİZMET PORTFÖYÜ" : "SERVICE PORTFOLIO"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a1930] mb-16 leading-tight">
              {lang === "tr" ? "Uygulama Gücümüz" : "Our Application Strength"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {products.map((p, i) => {
                const c = p[lang] || p.tr;
                const Icon = p.icon;
                return (
                  <div key={i} className="bg-white p-8 group hover:bg-[#0a1930] transition-colors duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-0 h-[2px] bg-[#E30613] group-hover:w-full transition-all duration-500" />
                    <div className="w-12 h-12 flex items-center justify-center bg-[#E30613]/10 group-hover:bg-[#E30613] mb-6 transition-colors duration-500">
                      <Icon size={22} className="text-[#E30613] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <div className="inline-block text-[9px] font-bold tracking-widest text-[#E30613] border border-[#E30613]/30 group-hover:border-[#E30613]/60 px-2 py-1 mb-4">
                      {p.tag}
                    </div>
                    <h3 className="text-lg font-black text-[#0a1930] group-hover:text-white mb-3 transition-colors duration-500">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-white/50 leading-relaxed transition-colors duration-500">
                      {c.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ FABRİKA BANT ══ */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                    {lang === "tr" ? "SAHA UYGULAMALARI" : "FIELD APPLICATIONS"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#0a1930] mb-6 leading-tight">
                  {lang === "tr" ? "Sistem Odasından Sahaya" : "From System Room to the Field"}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {lang === "tr"
                    ? "İzmir merkezli saha ekiplerimizle Türkiye genelinde güç sistemleri ve pano entegrasyonu hizmeti veriyoruz. ISO 9001 ve CE sertifikalı süreçlerimiz en yüksek kalite standartlarını garanti eder."
                    : "With our Izmir-based field teams, we provide power systems and panel integration services across Turkey. Our ISO 9001 and CE certified processes guarantee the highest quality standards."}
                </p>
                <Link to="/iletisim"
                  className="inline-flex items-center gap-3 bg-[#0a1930] text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#E30613] transition-colors duration-300">
                  {lang === "tr" ? "TEKLİF AL" : "GET A QUOTE"}
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="relative">
                <img loading="lazy"
                  src="https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg"
                  alt="Saha Uygulaması"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-4 -left-4 bg-[#E30613] p-6 text-white">
                  <div className="text-3xl font-black">100+</div>
                  <div className="text-xs tracking-widest opacity-80 uppercase">
                    {lang === "tr" ? "Tamamlanan Proje" : "Completed Projects"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="relative bg-[#0a1930] py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #E30613 0%, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                {lang === "tr" ? "Uygulama gücümüzden yararlanın." : "Leverage our application expertise."}
              </h3>
              <p className="text-white/50 max-w-lg">
                {lang === "tr"
                  ? "Özel tasarım ihtiyaçlarınız için mühendis ekibimizle görüşün."
                  : "Speak with our engineering team for your custom design needs."}
              </p>
            </div>
            <Link to="/iletisim"
              className="shrink-0 flex items-center gap-3 border-2 border-[#E30613] text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#E30613] transition-colors duration-300">
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

export default UretimPage;