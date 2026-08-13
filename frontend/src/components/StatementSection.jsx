import React from "react";
import { useI18n } from "../i18n/I18nProvider";

/* Sitede ilk kez kullanılan doku: kutu/çerçeve/kart yok — sadece büyük
   tipografi ve bol boşluk. Diğer tüm bölümlerin "kutulu" hissine kasıtlı
   bir kontrast. Mevcut çeviri metni kullanılıyor, yeni içerik eklenmedi. */
const StatementSection = () => {
  const { t } = useI18n();

  return (
    <section className="bg-white py-28 md:py-40">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="block w-8 h-[2px] bg-[#E30613] mx-auto mb-10" />
        <h2 className="text-3xl md:text-5xl font-black text-[#14284d] leading-[1.3] tracking-tight">
          {t("hero1_desc")}
        </h2>
      </div>
    </section>
  );
};

export default StatementSection;