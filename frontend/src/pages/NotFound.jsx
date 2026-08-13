import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const NotFound = () => {
  const { lang } = useI18n();

  return (
    <>
      <SEO
        title={lang === "tr" ? "Sayfa Bulunamadı" : "Page Not Found"}
        path="/404"
      />
      <Header />
      <main className="relative min-h-screen bg-[#0a1930] flex items-center overflow-hidden">
        {/* dekoratif zemin */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-[#E30613]/20" />
          <div className="absolute right-0 bottom-0 w-[340px] h-[340px] bg-[#E30613] opacity-[0.08] blur-[140px]" />
          <div className="absolute left-0 top-0 w-[280px] h-[280px] bg-[#003C8C] opacity-[0.25] blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 mb-6 text-[#E30613]">
            <Zap size={18} />
            <span className="text-xs font-black tracking-[0.4em]">HV ELEKTRİK</span>
          </div>

          <div className="text-[110px] md:text-[160px] font-black leading-none text-white/10 select-none">
            404
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white -mt-6 md:-mt-10 mb-4">
            {lang === "tr" ? "Bu sayfa bulunamadı" : "This page can't be found"}
          </h1>
          <p className="text-white/50 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            {lang === "tr"
              ? "Aradığınız sayfa taşınmış, kaldırılmış ya da hiç var olmamış olabilir."
              : "The page you're looking for may have been moved, removed, or never existed."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#E30613] hover:bg-[#b8050f] text-white text-sm font-black tracking-wider transition-all duration-300 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {lang === "tr" ? "ANA SAYFAYA DÖN" : "BACK TO HOME"}
            </Link>
            <Link
              to="/iletisim"
              className="text-white/50 text-sm font-bold tracking-widest hover:text-white transition-colors"
            >
              {lang === "tr" ? "İLETİŞİME GEÇ →" : "CONTACT US →"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
