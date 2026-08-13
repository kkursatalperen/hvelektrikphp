import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, ClipboardCheck, FileSearch, Truck, HardHat, CheckCircle2, Settings2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";
import api from "../lib/api";

/* ------------------------------------------------------------------ */
/* Fallback config — API'den veri gelmezse kullanılır                   */
/* ------------------------------------------------------------------ */
const fallbackConfig = {
  epc: {
    image: "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg",
    accentImage: "https://images.pexels.com/photos/170465/pexels-photo-170465.jpeg",
    stats: [
      { value: "2014", label: { tr: "Kuruluş Yılı", en: "Founded" } },
      { value: "10+", label: { tr: "Yıllık Deneyim", en: "Years Experience" } },
      { value: "100+", label: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
      { value: "EPC", label: { tr: "Anahtar Teslim", en: "Turnkey" } },
    ],
    features: {
      tr: [
        "Ön mühendislik, çizim ve onay süreçlerinin yönetimi",
        "Yatırımcı ve resmi kurum onay süreçlerinin takibi",
        "Tedarik ve saha lojistiği koordinasyonu",
        "Saha yönetimi ve inşaat süpervizyonu",
        "Geçici kabul ve nihai kabul süreçleri",
        "Devreye alma ve işletmeye geçiş desteği",
      ],
      en: [
        "Management of preliminary engineering, drawing and approval processes",
        "Follow-up of investor and official authority approval processes",
        "Procurement and field logistics coordination",
        "Site management and construction supervision",
        "Provisional and final acceptance processes",
        "Commissioning and transition-to-operation support",
      ],
    },
  },
  uretim: {
    image: "https://images.pexels.com/photos/18468536/pexels-photo-18468536.jpeg",
    accentImage: "https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg",
    stats: [
      { value: "100+", label: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
      { value: "CE", label: { tr: "Uygunluk", en: "Conformity" } },
      { value: "AG/OG", label: { tr: "Pano Sistemleri", en: "Panel Systems" } },
    ],
    features: {
      tr: [
        "AG/OG pano sistemlerinin kurulumu, kablolama ve devreye alınması",
        "MCC (mekanik kuvvet) panolarının saha montajı ve devreye alma işleri",
        "Güç faktörü iyileştirme ve reaktif güç kompanzasyon sistemleri kurulumu",
        "Kritik yükler için UPS – kesintisiz güç kaynağı sistemleri",
        "Kablo sonlandırma, bara bağlantıları ve kumanda devresi terminasyonu",
        "Sistem odası ve saha panolarında elektriksel testler, FAT/SAT ve kabul işlemleri",
      ],
      en: [
        "Installation, cabling and commissioning of LV/MV panel systems",
        "Field installation and commissioning of MCC (motor control center) panels",
        "Installation of power factor correction and reactive power compensation systems",
        "UPS – uninterrupted power supply systems for critical loads",
        "Cable termination, busbar connections and control circuit termination",
        "Electrical tests, FAT/SAT and acceptance procedures for system rooms and field panels",
      ],
    },
  },
  satis: {
    image: "https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg",
    accentImage: "https://images.pexels.com/photos/9800037/pexels-photo-9800037.jpeg",
    stats: [
      { value: "100+", label: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
      { value: "İzmir", label: { tr: "Merkez", en: "Headquarters" } },
      { value: "TEDAŞ", label: { tr: "TEİAŞ Uyumlu", en: "Compliant" } },
      { value: "7/24", label: { tr: "Teknik Destek", en: "Support" } },
    ],
    features: {
      tr: [
        "Bina tipi ve modüler trafo merkezlerinin saha montajı ve devreye alınması",
        "Orta ve yüksek gerilim şalt sahalarının inşaat ve montaj işleri",
        "Havai ve yeraltı enerji nakil hattı kurulum işleri",
        "Tesis ve saha topraklama sistemlerinin projelendirilmesi ve tesisatı",
        "Paratoner ve yıldırımdan korunma sistemlerinin kurulumu",
        "İzmir merkezli ekiplerimizle Türkiye genelinde saha uygulaması",
      ],
      en: [
        "Field installation and commissioning of building-type and modular substations",
        "Construction and installation works for medium and high voltage switchyards",
        "Installation of overhead and underground power transmission lines",
        "Design and installation of facility and field grounding systems",
        "Installation of lightning rod and lightning protection systems",
        "Field application across Turkey with our Izmir-based teams",
      ],
    },
  },
  muhendislik: {
    image: "https://images.pexels.com/photos/17842832/pexels-photo-17842832.jpeg",
    accentImage: "https://images.pexels.com/photos/27928762/pexels-photo-27928762.jpeg",
    stats: [
      { value: "7/24", label: { tr: "Teknik Destek", en: "Support" } },
      { value: "100+", label: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
      { value: "TEDAŞ", label: { tr: "TEİAŞ Uyumlu", en: "Compliant" } },
      { value: "CE", label: { tr: "Uygunluk", en: "Conformity" } },
    ],
    features: {
      tr: [
        "Periyodik bakım planlaması ve saha kontrol programları",
        "Arıza tespiti, acil müdahale ve onarım hizmetleri",
        "Trafo merkezi ve şalt sahalarında rutin bakım ve test",
        "Yedek parça yönetimi ve ekipman ömür takibi",
        "Saha ekiplerinden düzenli durum ve performans raporlaması",
        "7/24 uzaktan destek ve acil çağrı hattı",
      ],
      en: [
        "Periodic maintenance planning and field inspection programs",
        "Fault detection, emergency response and repair services",
        "Routine maintenance and testing at substations and switchyards",
        "Spare parts management and equipment lifecycle tracking",
        "Regular status and performance reporting from field teams",
        "24/7 remote support and emergency call line",
      ],
    },
  },
  taahhut: {
    image: "https://images.pexels.com/photos/11477908/pexels-photo-11477908.jpeg",
    accentImage: "https://images.pexels.com/photos/8853471/pexels-photo-8853471.jpeg",
    stats: [
      { value: "100+", label: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
      { value: "EPC", label: { tr: "Anahtar Teslim", en: "Turnkey" } },
      { value: "TEDAŞ", label: { tr: "TEİAŞ Uyumlu", en: "Compliant" } },
      { value: "CE", label: { tr: "Uygunluk", en: "Conformity" } },
    ],
    features: {
      tr: [
        "Elektrik altyapı ve tesisat projelerinde saha taahhüdü",
        "Kablo çekimi, bara ve pano montaj işleri",
        "Aydınlatma ve topraklama sistemleri kurulumu",
        "Resmi kurum (TEDAŞ/TEİAŞ) izin ve onay süreçlerinin yönetimi",
        "Saha kabul testleri ve devreye alma işlemleri",
        "Anahtar teslim proje teslimatı ve dokümantasyon",
      ],
      en: [
        "Field contracting for electrical infrastructure and installation projects",
        "Cable pulling, busbar and panel installation works",
        "Lighting and grounding system installation",
        "Management of official authority (TEDAŞ/TEİAŞ) permit and approval processes",
        "Site acceptance tests and commissioning procedures",
        "Turnkey project delivery and documentation",
      ],
    },
  },
};

/* Kart ikonları — özellik metinleriyle döngüsel eşleşir (dekoratif) */
const featureIcons = [ClipboardCheck, FileSearch, Truck, HardHat, CheckCircle2, Settings2];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
const ServicePage = ({ serviceKey, titleKey, bodyKey, crumbs, path }) => {
  const { t, lang } = useI18n();
  const [catData, setCatData] = useState(null);

  // Kategori verisini API'den çek (link ile eşleştir)
  useEffect(() => {
    api.get("/categories")
      .then((r) => {
        // serviceKey ile link'i eşleştir (örn: epc → /hizmetler/anahtar-teslim)
        const linkMap = {
          epc:          "/hizmetler/epc-proje-yonetimi",
          uretim:       "/hizmetler/guc-sistemleri-panolar",
          satis:        "/hizmetler/salt-sahalari-altyapi",
          muhendislik:  "/hizmetler/isletme-bakim-hizmetleri",
          taahhut:      "/hizmetler/elektrik-taahhut-hizmetleri",
        };
        const target = (linkMap[serviceKey] || "").trim().replace(/\/+$/, "");
        const found = r.data.find((c) => (c.link || "").trim().replace(/\/+$/, "") === target);
        if (found) setCatData(found);
      })
      .catch(() => {});
  }, [serviceKey]);

  const fallback = fallbackConfig[serviceKey] || fallbackConfig.epc;

  // Kategori verisinden ya da fallback'ten al
  const heroImage   = catData?.image        || fallback.accentImage;
  const accentImage = catData?.accent_image || fallback.accentImage;

  // Features: kategoride features_tr/features_en varsa kullan, yoksa fallback
  const features = lang === "tr"
    ? (catData?.features_tr?.length ? catData.features_tr : fallback.features.tr)
    : (catData?.features_en?.length ? catData.features_en : fallback.features.en);

  // Stats: kategoride stats varsa kullan, yoksa fallback
  const stats = catData?.stats?.length ? catData.stats : fallback.stats;

  // Başlık ve açıklama: kategoriden ya da i18n'den
  const title = catData
  ? (lang === "tr"
      ? (catData.page_title_tr || catData.title_tr)
      : (catData.page_title_en || catData.title_en))
  : t(titleKey);
const body = catData
  ? (lang === "tr"
      ? (catData.page_desc_tr || catData.desc_tr)
      : (catData.page_desc_en || catData.desc_en))
  : t(bodyKey);

  return (
    <>
      <SEO title={title} description={body.slice(0, 160)} path={path} image={heroImage} />
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[70vh] flex items-end bg-[#0a1930] overflow-hidden">
          <img loading="lazy" src={heroImage} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1930] via-[#0a1930]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930] via-transparent to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  <ChevronRight size={12} />
                  {c.link
                    ? <Link to={c.link} className="hover:text-[#E30613] transition-colors">{c.label}</Link>
                    : <span className="text-white">{c.label}</span>}
                </React.Fragment>
              ))}
            </nav>

            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV ELEKTRİK</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6 max-w-3xl">
              {title}
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">{body}</p>
          </div>
        </section>

        {/* ── Stats bar ── */}
        {stats.length > 0 && (
          <section className="bg-[#14284d] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                {stats.map((s, i) => (
                  <div key={i} className="py-8 px-6 text-center">
                    <div className="text-3xl md:text-4xl font-black text-[#E30613] mb-1">
                      {s.value}
                    </div>
                    <div className="text-xs font-bold tracking-widest text-white/40 uppercase">
                      {typeof s.label === "object"
                        ? (lang === "tr" ? s.label.tr : s.label.en)
                        : s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Content + features ── */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: mühendislik çizimi temalı görsel imzası */}
              <div className="relative pb-6 lg:sticky lg:top-28">
                <div
                  className="relative w-full aspect-[4/3] overflow-hidden"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)" }}
                >
                  <img loading="lazy" src={accentImage} alt={title} className="w-full h-full object-cover" style={{ filter: "grayscale(0.25) contrast(1.05)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,25,48,0.75), rgba(227,6,19,0.2) 60%, rgba(10,25,48,0.55))", mixBlendMode: "multiply" }} />
                  <div className="absolute inset-0 bg-[#0a1930]/15" />

                  {/* Köşe işaretleri — teknik çizim referansı */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E30613]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E30613]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E30613]" />

                  {/* Ana istatistik — görselin içine gömülü */}
                  {stats.length > 0 && (
                    <div className="absolute bottom-7 left-6">
                      <div className="text-5xl md:text-6xl font-black text-white leading-none">{stats[0].value}</div>
                      <div className="text-[10px] font-bold tracking-[0.2em] text-[#E30613] mt-2">
                        {(typeof stats[0].label === "object" ? (lang === "tr" ? stats[0].label.tr : stats[0].label.en) : stats[0].label)?.toUpperCase?.()}
                      </div>
                    </div>
                  )}

                  {/* İkinci istatistik — sağ üstte */}
                  {stats.length > 1 && (
                    <div className="absolute top-5 right-11 text-right">
                      <div className="text-xl font-black text-white leading-none">{stats[1].value}</div>
                      <div className="text-[8px] font-bold tracking-widest text-white/50 mt-1">
                        {typeof stats[1].label === "object" ? (lang === "tr" ? stats[1].label.tr : stats[1].label.en) : stats[1].label}
                      </div>
                    </div>
                  )}

                  {/* Dekoratif şema çizgileri */}
                  <svg className="absolute bottom-0 right-0 w-24 h-24 opacity-30" viewBox="0 0 120 120" aria-hidden="true">
                    <path d="M0 60 L40 60 M60 0 L60 40 M60 80 L60 120 M80 60 L120 60" stroke="#ffffff" strokeWidth="1" />
                    <circle cx="60" cy="60" r="4" fill="none" stroke="#E30613" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Right: features as real cards, not a plain list */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                    {lang === "tr" ? "KAPSAM & HİZMETLER" : "SCOPE & SERVICES"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#14284d] mb-10 leading-tight">
                  {lang === "tr" ? "Neler Sunuyoruz?" : "What We Offer"}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((f, i) => {
                    const FeatureIcon = featureIcons[i % featureIcons.length];
                    return (
                      <div
                        key={i}
                        className="group relative bg-[#f7f8fa] hover:bg-[#14284d] p-6 transition-colors duration-300"
                      >
                        <div className="w-11 h-11 flex items-center justify-center bg-white group-hover:bg-[#E30613] shadow-sm mb-5 transition-colors duration-300">
                          <FeatureIcon size={20} className="text-[#E30613] group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />
                        </div>
                        <p className="text-[14px] text-[#14284d] group-hover:text-white leading-relaxed transition-colors duration-300">
                          {f}
                        </p>
                        <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#E30613] transition-all duration-300" />
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/iletisim"
                  className="mt-10 inline-flex items-center gap-3 bg-[#14284d] text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#E30613] transition-colors duration-300"
                >
                  {lang === "tr" ? "TEKLİF AL" : "GET A QUOTE"}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="relative bg-[#14284d] py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #E30613 0%, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                {lang === "tr" ? "Projeniz için yanınızdayız." : "We are here for your project."}
              </h3>
              <p className="text-white/50 max-w-lg">
                {lang === "tr"
                  ? "Uzman ekibimiz fizibilite aşamasından teslimata kadar her adımda destek verir."
                  : "Our expert team supports you from feasibility to delivery at every step."}
              </p>
            </div>
            <Link
              to="/iletisim"
              className="shrink-0 flex items-center gap-3 border-2 border-[#E30613] text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#E30613] transition-colors duration-300"
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

export default ServicePage;