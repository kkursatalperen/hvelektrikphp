import React, { useRef, useState, useEffect } from "react";
import { Shield, Zap, Globe, Award, Clock, Wrench } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

const reasons = [
  {
    icon: Globe,
    title: { tr: "Fizibiliteden Teslimata Tek Elden", en: "Single Source from Feasibility to Delivery" },
    desc: { tr: "Anahtar teslim EPC taahhüt ile projelerin tüm aşamalarında kendi mühendislik gücümüzle hizmet veriyoruz.", en: "We serve at every stage of the project with our own engineering power through turn-key EPC contracting." },
    stat: "EPC",
    statLabel: { tr: "Anahtar Teslim", en: "Turn-Key" },
  },
  {
    icon: Zap,
    title: { tr: "100'ü Aşkın Tamamlanan Proje", en: "100+ Completed Projects" },
    desc: { tr: "Enerji santrallerinden hastanelere, konut projelerinden alışveriş merkezlerine kadar geniş bir yelpazede iş teslim ettik.", en: "We have delivered a wide range of projects, from power plants to hospitals and from residential developments to shopping malls." },
    stat: "100+",
    statLabel: { tr: "Proje", en: "Projects" },
  },
  {
    icon: Shield,
    title: { tr: "Uluslararası Kalite Standartları", en: "International Quality Standards" },
    desc: { tr: "CE belgeli, TEDAŞ/TEİAŞ uyumlu mühendislik ve saha süreçleri.", en: "CE certified, TEDAŞ/TEİAŞ compliant engineering and field processes." },
    stat: "CE",
    statLabel: { tr: "Belgeli", en: "Certified" },
  },
  {
    icon: Clock,
    title: { tr: "2014'ten Bu Yana", en: "Since 2014" },
    desc: { tr: "İzmir'den başlayan yolculuğumuzda ülkemizin çeşitli bölgelerinde birçok yatırıma imza attık.", en: "In our journey that started in Izmir, we have signed many investments across various regions of Turkey." },
    stat: "10+",
    statLabel: { tr: "Yıl", en: "Years" },
  },
  {
    icon: Wrench,
    title: { tr: "Deneyimli Mühendislik Kadrosu", en: "Experienced Engineering Team" },
    desc: { tr: "Teknolojiyi yakından takip eden uzman kadromuz her projeye özel çözümler üretir.", en: "Our expert team, who closely follow technology, produce tailored solutions for every project." },
    stat: "HV",
    statLabel: { tr: "Proje Mühendislik", en: "Proje Mühendislik" },
  },
  {
    icon: Award,
    title: { tr: "Nitelikli İş Ortaklıkları", en: "Qualified Business Partnerships" },
    desc: { tr: "TEDAŞ ve TEİAŞ başta olmak üzere kamu ve özel sektör paydaşlarıyla güvenilir iş birlikleri kuruyoruz.", en: "We build reliable collaborations with public and private sector stakeholders, primarily TEDAŞ and TEİAŞ." },
    stat: "TEDAŞ",
    statLabel: { tr: "İş Ortağı", en: "Partner" },
  },
];

const WhyUs = () => {
  const { lang } = useI18n();
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % reasons.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleClick = (i) => {
    setActive(i);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % reasons.length);
    }, 3000);
  };

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-[#f7f8fa]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-bold tracking-[0.3em]">
              {lang === "tr" ? "NEDEN HV ELEKTRİK?" : "WHY HV ELEKTRIK?"}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#14284d] max-w-xl leading-tight">
            {lang === "tr" ? "Bizi Tercih Etmeniz İçin 6 Neden" : "6 Reasons to Choose Us"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          {/* Left — reason list */}
          <div className="space-y-1 pr-0 lg:pr-12">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className={`w-full text-left flex items-start gap-5 p-5 transition-all duration-300 group ${
                    active === i
                      ? "bg-[#14284d]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-300 ${
                    active === i ? "bg-[#E30613]" : "bg-gray-100 group-hover:bg-[#E30613]/10"
                  }`}>
                    <Icon size={18} className={active === i ? "text-white" : "text-[#E30613]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm mb-1 transition-colors duration-300 ${
                      active === i ? "text-white" : "text-[#14284d] group-hover:text-[#E30613]"
                    }`}>
                      {lang === "tr" ? r.title.tr : r.title.en}
                    </div>
                    <div className={`text-xs leading-relaxed transition-colors duration-300 ${
                      active === i ? "text-white/50" : "text-gray-400"
                    }`}>
                      {lang === "tr" ? r.desc.tr : r.desc.en}
                    </div>
                  </div>
                  {/* Progress bar */}
                  {active === i && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E30613]/30">
                      <div className="h-full bg-[#E30613] animate-[width_3s_linear]" style={{ width: "100%", animation: "grow 3s linear" }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right — active detail */}
          <div className="relative bg-[#f7f8fa] p-10 lg:p-16 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#E30613]" />

            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={i}
                  className={`transition-all duration-500 ${
                    active === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute"
                  }`}
                >
                  {active === i && (
                    <>
                      <div className="text-7xl md:text-8xl font-black text-[#E30613] mb-2 leading-none">
                        {r.stat}
                      </div>
                      <div className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-8">
                        {lang === "tr" ? r.statLabel.tr : r.statLabel.en}
                      </div>
                      <div className="w-12 h-[2px] bg-[#E30613] mb-6" />
                      <h3 className="text-2xl font-black text-[#14284d] mb-4 leading-tight">
                        {lang === "tr" ? r.title.tr : r.title.en}
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        {lang === "tr" ? r.desc.tr : r.desc.en}
                      </p>
                      <div className="mt-8 flex items-center gap-3">
                        <Icon size={20} className="text-[#E30613]" />
                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                          HV Elektrik
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;