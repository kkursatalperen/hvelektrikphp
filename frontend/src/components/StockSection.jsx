import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

const StockSection = () => {
  const { t } = useI18n();
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-[#14284d]">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url(https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg)" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#14284d] via-[#14284d]/85 to-[#14284d]/60" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#E30613] flex items-center justify-center bg-[#E30613]/10">
              <TrendingUp size={44} className="text-[#E30613]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="text-xs tracking-[0.3em] text-[#E30613] mb-2 font-semibold">{t("stock_kicker")}</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">{t("stock_title")}</h2>
            <div className="flex items-baseline gap-3 justify-center md:justify-start">
              <span className="text-2xl md:text-3xl font-light text-white/80">HVSAN :</span>
              <span className="text-3xl md:text-4xl font-bold text-white">79.90 ₺</span>
              <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <ArrowUpRight size={16} /> +2.4%
              </span>
            </div>
          </div>

          <div>
            <Link to="/yatirimci/firma" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#E30613] text-white text-sm font-bold tracking-wider hover:bg-[#E30613] transition-all duration-300 group" data-testid="ir-btn">
              {t("investor_relations")}
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StockSection;
