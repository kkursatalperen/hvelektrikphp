import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const companies = [
  {
    code: "HV Elektrik",
    tr: { name: "HV Elektrik Proje Taahhüt San. Tic. Ltd. Şti.", focus: "Ana Şirket · EPC Taahhüt", desc: "Grubun çatı şirketi. Anahtar teslim EPC projeleri, saha müteahhitliği ve elektromekanik montaj işlerini yürütür." },
    en: { name: "HV Elektrik Proje Taahhüt San. Tic. Ltd. Şti.", focus: "Parent Company · EPC Contracting", desc: "The group's parent company. Manages turn-key EPC projects, field contracting and electromechanical installation works." },
    color: "#E30613",
  },
  {
    code: "HV Proje",
    tr: { name: "HV Proje Mühendislik", focus: "Mühendislik · Tasarım & Danışmanlık", desc: "Fizibilite, avan proje, teknik şartname, bütçelendirme ve TEDAŞ/TEİAŞ uyumlu elektrik sistem tasarımı hizmetleri sunar." },
    en: { name: "HV Proje Mühendislik", focus: "Engineering · Design & Consulting", desc: "Provides feasibility, preliminary design, technical specification, budgeting and TEDAŞ/TEİAŞ compliant electrical system design services." },
    color: "#14284d",
  },
  {
    code: "Integ Global",
    tr: { name: "Integ Global", focus: "Grup Şirketi · İzmir", desc: "HV Elektrik grubunun İzmir merkezli bir diğer şirketi." },
    en: { name: "Integ Global", focus: "Group Company · Izmir", desc: "Another Izmir-based company within the HV Elektrik group." },
    color: "#2d6a4f",
  },
];

const GroupPage = () => {
  const { lang, t } = useI18n();

  return (
    <>
      <SEO title={t("group_title")} path="/hakkimizda/grup" />
      <Header />
      <main>

        {/* ── Hero — "grup yapısı" temasına özgü imza: basit bağlantı şeması ── */}
        <section className="relative bg-[#0a1930] overflow-hidden pt-44 pb-24">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />

          <div className="relative max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
              <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
              <ChevronRight size={12} />
              <Link to="/hakkimizda" className="hover:text-[#E30613] transition-colors">{t("about_page_title")}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{t("group_title")}</span>
            </nav>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV GROUP</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-2">
                  {lang === "tr" ? "Güçlü Bir" : "A Strong"}
                </h1>
                <h1
                  className="text-5xl md:text-7xl font-black leading-none tracking-tight"
                  style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)", color: "transparent" }}
                >
                  {lang === "tr" ? "Grup Yapısı." : "Group Structure."}
                </h1>
              </div>

              {/* Basit bağlantı şeması — sayfanın kendi 2 şirketli içeriğine referans veriyor */}
              <div className="hidden lg:flex flex-col items-center gap-0 pt-4">
                <div className="w-full border border-[#E30613]/40 bg-[#E30613]/10 px-6 py-4 text-center">
                  <span className="text-white text-sm font-black tracking-wide">HV Elektrik</span>
                  <div className="text-white/40 text-[10px] tracking-widest uppercase mt-1">
                    {lang === "tr" ? "Ana Şirket" : "Parent Company"}
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="w-full border border-white/15 bg-white/5 px-6 py-4 text-center">
                  <span className="text-white text-sm font-black tracking-wide">HV Proje Mühendislik</span>
                  <div className="text-white/40 text-[10px] tracking-widest uppercase mt-1">
                    {lang === "tr" ? "Mühendislik Kolu" : "Engineering Arm"}
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="w-full border border-white/15 bg-white/5 px-6 py-4 text-center">
                  <span className="text-white text-sm font-black tracking-wide">Integ Global</span>
                  <div className="text-white/40 text-[10px] tracking-widest uppercase mt-1">
                    {lang === "tr" ? "Grup Şirketi" : "Group Company"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                    {lang === "tr" ? "HAKKIMIZDA" : "ABOUT"}
                  </span>
                </div>
                <h2 className="text-4xl font-black text-[#0a1930] mb-6 leading-tight">
                  {lang === "tr" ? "Enerjinin Her Adımında" : "At Every Step of Energy"}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {lang === "tr"
                    ? "HV Elektrik grubu; EPC taahhüt, saha müteahhitliği ve mühendislik danışmanlığı alanlarında hizmet veren üç şirketten oluşmaktadır."
                    : "The HV Elektrik group consists of three companies serving in EPC contracting, field construction and engineering consulting."}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {lang === "tr"
                    ? "Grup şirketlerimiz birbirleriyle entegre çalışarak, fizibiliteden devreye almaya kadar müşterilerimize uçtan uca çözümler sunmaktadır."
                    : "Our group companies work in an integrated manner, providing end-to-end solutions to our customers from feasibility to commissioning."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-gray-100">
                {[
                  { v: "2014", l: { tr: "Kuruluş Yılı", en: "Founded" } },
                  { v: "3", l: { tr: "Grup Şirketi", en: "Group Companies" } },
                  { v: "100+", l: { tr: "Tamamlanan Proje", en: "Completed Projects" } },
                  { v: "İzmir", l: { tr: "Merkez", en: "Headquarters" } },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 text-center">
                    <div className="text-4xl font-black text-[#E30613] mb-2">{s.v}</div>
                    <div className="text-xs tracking-widest text-gray-400 uppercase">{s.l[lang]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Şirketler ── */}
        <section className="bg-[#f7f8fa] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                {lang === "tr" ? "GRUP ŞİRKETLERİ" : "GROUP COMPANIES"}
              </span>
            </div>
            <h2 className="text-4xl font-black text-[#0a1930] mb-16 leading-tight">
              {lang === "tr" ? "Şirketlerimiz" : "Our Companies"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
              {companies.map((c, i) => {
                const content = c[lang] || c.tr;
                return (
                  <div key={i} className="bg-white p-10 group hover:bg-[#0a1930] transition-colors duration-500 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-0 bg-[#E30613] group-hover:h-full transition-all duration-500" />
                    <div className="absolute top-6 right-8 text-[80px] font-black text-gray-50 group-hover:text-white/3 leading-none select-none transition-colors duration-500">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="relative">
                      <span className="inline-block text-xs font-black text-[#E30613] tracking-widest mb-4 border border-[#E30613]/30 px-3 py-1">
                        {c.code}
                      </span>
                      <h3 className="text-lg font-black text-[#0a1930] group-hover:text-white mb-2 transition-colors duration-500 leading-tight">
                        {content.name}
                      </h3>
                      <p className="text-xs text-[#E30613] tracking-widest mb-4 uppercase">{content.focus}</p>
                      <p className="text-gray-500 group-hover:text-white/60 text-sm leading-relaxed transition-colors duration-500">
                        {content.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#E30613] py-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <h3 className="text-3xl font-black text-white">
              {lang === "tr" ? "İş birliği için bize ulaşın." : "Contact us for collaboration."}
            </h3>
            <Link
              to="/iletisim"
              className="shrink-0 flex items-center gap-3 bg-white text-[#E30613] px-8 py-4 text-sm font-black tracking-widest hover:bg-[#0a1930] hover:text-white transition-colors duration-300"
            >
              {lang === "tr" ? "İLETİŞİM" : "CONTACT"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default GroupPage;