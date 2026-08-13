import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Leaf, Heart, Shield } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const pageConfig = {
  cevre: {
    icon: Leaf,
    image: "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg",
    accentImage: "https://images.pexels.com/photos/27637329/pexels-photo-27637329.jpeg",
    color: "#2d6a4f",
    titleKey: "environment_title",
    bodyKey: "environment_body",
    cert: "Çevre Yönetimi",
    stats: [
      { v: "100+", l: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
      { v: "HES/GES/RES", l: { tr: "Yenilenebilir Enerji", en: "Renewable Energy" } },
      { v: "CO₂", l: { tr: "Azaltımı", en: "Reduction" } },
      { v: "ÇED", l: { tr: "Tam Uyum", en: "Full Compliance" } },
    ],
    features: {
      tr: [
        "HES, GES ve RES projelerinde saha müteahhitliği deneyimi",
        "Sahada yapılandırılmış çevre yönetim süreçleri",
        "Sahada atık yönetimi ve geri dönüşüm uygulamaları",
        "Enerji verimliliği odaklı mühendislik çözümleri",
        "Projelerde kaynak kullanımını optimize eden saha planlaması",
        "Çevresel etki değerlendirme (ÇED) süreçlerine tam uyum",
      ],
      en: [
        "Field contracting experience in hydro, solar and wind projects",
        "Structured on-site environmental management processes",
        "On-site waste management and recycling practices",
        "Engineering solutions focused on energy efficiency",
        "Field planning that optimizes resource use in projects",
        "Full compliance with environmental impact assessment (EIA) processes",
      ],
    },
  },
  sosyal: {
    icon: Heart,
    image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
    accentImage: "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg",
    color: "#c1121f",
    titleKey: "social_title",
    bodyKey: "social_body",
    cert: "İş Sağlığı ve Güvenliği",
    stats: [
      { v: "+50", l: { tr: "Çalışan", en: "Employees" } },
      { v: "50+", l: { tr: "Burs Öğrencisi", en: "Scholarship Students" } },
      { v: "100+", l: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
      { v: "İSG", l: { tr: "Uyumlu Süreçler", en: "Compliant Processes" } },
    ],
    features: {
      tr: [
        "Teknik meslek liseleri ile iş birliği ve staj programları",
        "Eğitim bursları ve kariyer gelişim destekleri",
        "İş sağlığı ve güvenliği standartlarına tam uyum",
        "Çeşitlilik ve kapsayıcılık politikaları",
        "Deprem bölgesi ve afet yardım kampanyaları",
        "Yerel toplulukları destekleyen sosyal sorumluluk projeleri",
      ],
      en: [
        "Collaboration with technical high schools and internship programs",
        "Education scholarships and career development support",
        "Full compliance with occupational health and safety standards",
        "Diversity and inclusion policies",
        "Earthquake zone and disaster relief campaigns",
        "Social responsibility projects supporting local communities",
      ],
    },
  },
  kalite: {
    icon: Shield,
    image: "https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg",
    accentImage: "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg",
    color: "#14284d",
    titleKey: "quality_title",
    bodyKey: "quality_body",
    cert: "Kalite Yönetimi",
    stats: [
      { v: "TEDAŞ", l: { tr: "TEİAŞ Uyumlu", en: "TEİAŞ Compliant" } },
      { v: "CE", l: { tr: "Uygunluk", en: "Conformity" } },
      { v: "100%", l: { tr: "Test & Kontrol", en: "Test & Control" } },
      { v: "FAT/SAT", l: { tr: "Saha Kabul Testleri", en: "Site Acceptance Tests" } },
    ],
    features: {
      tr: [
        "Yapılandırılmış kalite yönetim süreçleri ile tam entegrasyon",
        "TEDAŞ/TEİAŞ uyumlu mühendislik ve saha uygulamaları",
        "Her proje için kapsamlı saha kabul testleri",
        "Bağımsız üçüncü taraf denetim süreçleri",
        "Sürekli iyileştirme ve Kaizen metodolojisi",
        "Müşteri memnuniyeti odaklı kalite güvence süreçleri",
      ],
      en: [
        "Full integration with structured quality management processes",
        "TEDAŞ/TEİAŞ compliant engineering and field applications",
        "Comprehensive site acceptance tests for each project",
        "Independent third-party audit processes",
        "Continuous improvement and Kaizen methodology",
        "Customer satisfaction-focused quality assurance processes",
      ],
    },
  },
};

const SustainabilityPage = ({ section = "cevre" }) => {
  const { lang, t } = useI18n();
  const cfg = pageConfig[section] || pageConfig.cevre;
  const Icon = cfg.icon;
  const features = cfg.features[lang] || cfg.features.tr;

  const crumbLabel = {
    cevre: t("environment_title"),
    sosyal: t("social_title"),
    kalite: t("quality_title"),
  }[section];

  return (
    <>
      <SEO title={t(cfg.titleKey)} path={`/surdurulebilirlik/${section}`} />
      <Header />
      <main>

        {/* ── Hero — bölüme özgü renk + büyük ikon imzası (stok fotoğraf yok) ── */}
        <section className="relative bg-[#0a1930] overflow-hidden pt-44 pb-20">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.06] flex items-center justify-center overflow-hidden">
            <Icon size={420} strokeWidth={0.6} color={cfg.color} />
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: cfg.color }} />

          <div className="relative max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              <ChevronRight size={12} />
              <Link to="/surdurulebilirlik" className="hover:text-[#E30613] transition-colors">{t("sustainability")}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{crumbLabel}</span>
            </nav>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 border flex items-center justify-center" style={{ borderColor: `${cfg.color}66` }}>
                <Icon size={20} style={{ color: cfg.color }} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: cfg.color }}>
                {lang === "tr" ? "SÜRDÜRÜLEBİLİRLİK" : "SUSTAINABILITY"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4 max-w-3xl">
              {t(cfg.titleKey)}
            </h1>
            <p className="text-white/50 text-lg max-w-2xl leading-relaxed">{t(cfg.bodyKey)}</p>
          </div>
        </section>

        {/* ── Bölümler arası geçiş şeridi ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap">
              {["cevre", "kalite"].map((key) => {
                const active = key === section;
                const c = pageConfig[key];
                const label = { cevre: t("environment_title"), kalite: t("quality_title") }[key];
                return (
                  <Link
                    key={key}
                    to={`/surdurulebilirlik/${key}`}
                    className="relative px-6 py-5 text-sm font-bold transition-colors duration-300"
                    style={{ color: active ? c.color : "#9ca3af" }}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: c.color }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="bg-[#E30613]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
              {cfg.stats.map((s, i) => (
                <div key={i} className="py-8 px-6 text-center">
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">{s.v}</div>
                  <div className="text-[10px] tracking-widest text-white/70 uppercase">{s.l[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <img loading="lazy"
                  src={cfg.accentImage}
                  alt={t(cfg.titleKey)}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#E30613] -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-[#0a1930] -z-10" />
                {/* Cert badge */}
                <div className="absolute top-6 left-6 bg-[#0a1930] px-4 py-3">
                  <div className="text-xs font-black text-[#E30613] tracking-widest">{cfg.cert}</div>
                  <div className="text-[10px] text-white/50 mt-0.5">{lang === "tr" ? "Sertifikalı" : "Certified"}</div>
                </div>
              </div>

              {/* Features */}
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                    {lang === "tr" ? "YAKLAŞIMIMIZ" : "OUR APPROACH"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#0a1930] mb-8 leading-tight">
                  {lang === "tr" ? "Neler Yapıyoruz?" : "What We Do"}
                </h2>
                <ul className="space-y-4">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E30613] mt-2 shrink-0" />
                      <span className="text-gray-600 leading-relaxed text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Other sustainability links ── */}
        <section className="bg-[#f7f8fa] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-8">
              {lang === "tr" ? "DİĞER KONULAR" : "OTHER TOPICS"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
              {[
                { key: "cevre", link: "/surdurulebilirlik/cevre", icon: Leaf, label: { tr: "Çevre Politikası", en: "Environmental Policy" } },
                { key: "kalite", link: "/surdurulebilirlik/kalite", icon: Shield, label: { tr: "Kalite Yönetimi", en: "Quality Management" } },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isActive = item.key === section;
                return (
                  <Link
                    key={item.key}
                    to={item.link}
                    className={`flex items-center gap-4 p-8 transition-colors duration-300 group ${
                      isActive ? "bg-[#0a1930]" : "bg-white hover:bg-[#0a1930]"
                    }`}
                  >
                    <ItemIcon size={20} className={`shrink-0 transition-colors duration-300 ${isActive ? "text-[#E30613]" : "text-gray-300 group-hover:text-[#E30613]"}`} strokeWidth={1.5} />
                    <span className={`font-black text-sm transition-colors duration-300 ${isActive ? "text-white" : "text-[#0a1930] group-hover:text-white"}`}>
                      {item.label[lang]}
                    </span>
                    <ArrowRight size={14} className={`ml-auto transition-colors duration-300 ${isActive ? "text-[#E30613]" : "text-gray-200 group-hover:text-[#E30613]"}`} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default SustainabilityPage;