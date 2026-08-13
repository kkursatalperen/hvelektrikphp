import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

const PageHero = ({ title, crumbs = [] }) => {
  const { t } = useI18n();
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-[#14284d] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.06] flex items-center justify-center overflow-hidden">
        <MapPin size={360} strokeWidth={0.6} className="text-white" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-[2px] w-10 bg-[#E30613]" />
          <span className="text-xs font-bold tracking-[0.25em] text-[#E30613]">HV ELEKTRİK</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">{title}</h1>
        <nav className="flex items-center gap-2 text-sm text-white/70">
          <Link to="/" className="hover:text-[#E30613] transition-colors">{t("home_crumb")}</Link>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={14} className="text-white/40" />
              {c.link ? (
                <Link to={c.link} className="hover:text-[#E30613] transition-colors">{c.label}</Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default PageHero;