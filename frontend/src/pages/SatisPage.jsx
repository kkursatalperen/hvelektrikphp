import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Zap, TrendingUp, Package, ShieldCheck, Radio, MapPin } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const regions = [
  { id: "renewable", flag: "☀️", tr: { name: "Yenilenebilir Enerji", desc: "HES, GES, RES ve hibrit/biyogaz sistemleri" }, en: { name: "Renewable Energy", desc: "Hydro, solar, wind and hybrid/biogas systems" } },
  { id: "industrial", flag: "🏭", tr: { name: "Endüstriyel Tesisler", desc: "Fabrikalar, lojistik merkezleri ve ağır sanayi" }, en: { name: "Industrial Facilities", desc: "Factories, logistics centers and heavy industry" } },
  { id: "institutional", flag: "🏥", tr: { name: "Nitelikli Üst Yapılar", desc: "Hastane, veri merkezi, AVM, otel, liman, iş merkezleri" }, en: { name: "Institutional Buildings", desc: "Hospitals, data centers, malls, hotels, ports, business centers" } },
  { id: "grid", flag: "⚡", tr: { name: "Şehir Şebekeleri", desc: "AG-OG şehir şebekeleri ve enerji nakil hatları" }, en: { name: "City Grids", desc: "LV/MV city grids and power transmission lines" } },
];

const services = [
  {
    icon: Zap,
    tr: { title: "Trafo Merkezi Montajı", desc: "Bina tipi ve modüler trafo merkezlerinin saha montajı ve devreye alınması." },
    en: { title: "Substation Installation", desc: "Field installation and commissioning of building-type and modular substations." },
  },
  {
    icon: TrendingUp,
    tr: { title: "OG/YG Şalt Sahası Yapımı", desc: "Orta ve yüksek gerilim şalt sahalarının inşaat ve montaj işleri." },
    en: { title: "MV/HV Switchyard Construction", desc: "Construction and installation works for medium and high voltage switchyards." },
  },
  {
    icon: Package,
    tr: { title: "Enerji Nakil Hatları", desc: "Havai ve yeraltı enerji nakil hattı kurulum işleri." },
    en: { title: "Power Transmission Lines", desc: "Installation of overhead and underground power transmission lines." },
  },
  {
    icon: ShieldCheck,
    tr: { title: "Topraklama Sistemleri", desc: "Tesis ve saha topraklama sistemlerinin projelendirilmesi ve tesisatı." },
    en: { title: "Grounding Systems", desc: "Design and installation of facility and field grounding systems." },
  },
  {
    icon: Radio,
    tr: { title: "Yıldırımdan Korunma Sistemleri", desc: "Paratoner ve yıldırımdan korunma sistemlerinin kurulumu." },
    en: { title: "Lightning Protection Systems", desc: "Installation of lightning rod and lightning protection systems." },
  },
  {
    icon: MapPin,
    tr: { title: "Türkiye Geneli Saha Ekipleri", desc: "İzmir merkezli ekiplerimizle Türkiye genelinde saha uygulaması." },
    en: { title: "Nationwide Field Teams", desc: "Field application across Turkey with our Izmir-based teams." },
  },
];

const SatisPage = () => {
  const { t, lang } = useI18n();
  const [activeRegion, setActiveRegion] = useState("renewable");

  return (
    <>
      <SEO title={t("sales_title")} path="/hizmetler/satis"
        image="https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg" />
      <Header />
      <main>

        {/* ══ HERO ══ */}
        <section className="relative min-h-[70vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy" src="https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg" alt="Saha ve Müteahhitlik"
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
              <span className="text-white">{t("sales_title")}</span>
            </nav>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV ELEKTRİK ŞALT SAHALARI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6 max-w-3xl">
              {t("sales_title")}
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">{t("sales_body")}</p>

            {/* inline stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { v: "2014", l: { tr: "Kuruluş", en: "Founded" } },
                { v: "100+", l: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
                { v: "İzmir", l: { tr: "Merkez", en: "Headquarters" } },
              ].map((s, i) => (
                <div key={i} className="border-l-2 border-[#E30613] pl-4">
                  <div className="text-3xl font-black text-white">{s.v}</div>
                  <div className="text-xs text-white/40 tracking-widest uppercase">{s.l[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HİZMET KARTLARI ══ */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                {lang === "tr" ? "MÜTEAHHİTLİK HİZMETLERİ" : "CONTRACTING SERVICES"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a1930] mb-16 leading-tight">
              {lang === "tr" ? "Sahada Uçtan Uca Çözümler" : "End-to-End Solutions in the Field"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => {
                const Icon = s.icon;
                const c = s[lang] || s.tr;
                return (
                  <div key={i} className="group border border-gray-100 p-8 hover:border-[#E30613] hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-[#E30613]/10 flex items-center justify-center mb-6 group-hover:bg-[#E30613] transition-colors duration-300">
                      <Icon size={22} className="text-[#E30613] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-black text-[#0a1930] mb-3">{c.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ SEKTÖRLER ══ */}
        <section className="bg-[#0a1930] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                {lang === "tr" ? "SEKTÖREL ODAK" : "SECTOR FOCUS"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-16 leading-tight">
              {lang === "tr" ? "Çalıştığımız Alanlar" : "Sectors We Serve"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-white/5">
              {regions.map((r) => {
                const c = r[lang] || r.tr;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveRegion(r.id)}
                    className={`p-8 text-left transition-all duration-300 ${
                      activeRegion === r.id
                        ? "bg-[#E30613]"
                        : "bg-[#0a1930] hover:bg-white/5"
                    }`}
                  >
                    <div className="text-3xl mb-4">{r.flag}</div>
                    <div className="text-sm font-black text-white mb-2">{c.name}</div>
                    <div className={`text-xs leading-relaxed transition-colors duration-300 ${
                      activeRegion === r.id ? "text-white/80" : "text-white/40"
                    }`}>{c.desc}</div>
                  </button>
                );
              })}
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
                {lang === "tr" ? "Projeniz için sahadayız." : "We're on-site for your project."}
              </h3>
              <p className="text-white/70 max-w-lg">
                {lang === "tr"
                  ? "Saha müteahhitliği ve proje fırsatları için ekibimizle görüşün."
                  : "Speak with our team about field contracting and project opportunities."}
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

export default SatisPage;