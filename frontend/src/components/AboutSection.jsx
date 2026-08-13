import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const AboutSection = () => {
  const { t, lang } = useI18n();
  const { counters = [] } = useSiteData();

  return (
    <section id="hakkimizda" className="relative bg-[#0d1117] overflow-hidden">
      {/* Circuit background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E30613] rounded-full opacity-5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900 rounded-full opacity-10 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">

          {/* Left — Stats */}
          <div className="relative flex flex-col justify-center pr-0 lg:pr-16 pb-12 lg:pb-0">
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#E30613] to-transparent" />

            <div className="flex items-center gap-3 mb-8">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[#E30613] text-xs font-bold tracking-[0.3em]">{t("about_kicker")}</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-12">
              {t("about_title")}
            </h2>

            <div className="space-y-6 mb-12">
              {counters.map((s) => (
                <div key={s.id} className="flex items-center gap-6 group">
                  <div className="text-4xl md:text-5xl font-black text-[#E30613] w-32 shrink-0 tabular-nums group-hover:scale-110 transition-transform duration-300">
                    {s.value}{s.suffix}
                  </div>
                  <div className="h-[1px] flex-1 bg-white/10 group-hover:bg-[#E30613]/30 transition-colors duration-300" />
                  <div className="text-white/50 text-sm font-bold tracking-widest uppercase w-40 text-right">
                    {lang === "tr" ? s.label_tr : s.label_en}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/hakkimizda"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#E30613] hover:bg-[#b8050f] text-white text-sm font-bold tracking-wider transition-all duration-300 group"
              >
                {t("read_more")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="text-white/30 text-xs tracking-widest">
                {t("fortune_badge")}
              </div>
            </div>
          </div>

          {/* Right — Görsel + text */}
          <div className="relative flex flex-col justify-center pl-0 lg:pl-16">
            <div className="relative w-full aspect-video overflow-hidden group mb-8">
              <img loading="lazy"
                src="https://images.pexels.com/photos/18468536/pexels-photo-18468536.jpeg"
                alt={lang === "tr" ? "HV Elektrik saha çalışması" : "HV Elektrik field work"}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 to-transparent" />

              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#E30613]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#E30613]" />

              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-[10px] tracking-[0.2em] text-[#E30613] mb-1">{t("corporate_kicker")}</div>
                <div className="text-lg font-bold">HV Elektrik</div>
              </div>
            </div>

            <p className="text-white/50 leading-relaxed mb-4 text-sm">{t("about_p1")}</p>
            <p className="text-white/70 leading-relaxed font-medium">{t("about_p2")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;