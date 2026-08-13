import React, { useState } from "react";
import { MapPin, X } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

const offices = [
  { id: 1, city: "İzmir", country: "Türkiye", flag: "🇹🇷", role: { tr: "Genel Merkez", en: "Headquarters" }, x: 54, y: 35, employees: "50+" },
];

const GlobalPresence = () => {
  const { lang } = useI18n();
  const [active, setActive] = useState(null);

  return (
    <section className="relative bg-[#060810] py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#E30613] opacity-[0.04] blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[1px] w-12 bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-bold tracking-[0.3em]">
              {lang === "tr" ? "KÜRESEL VARLIĞIMIZ" : "GLOBAL PRESENCE"}
            </span>
            <span className="h-[1px] w-12 bg-[#E30613]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            {lang === "tr" ? "İzmir'den Türkiye Geneline" : "From Izmir, Across Turkey"}
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            {lang === "tr"
              ? "İzmir merkezli ekibimizle Türkiye genelindeki saha uygulamalarımızı yürütüyoruz."
              : "We carry out our field applications across Turkey with our Izmir-based team."}
          </p>
        </div>

        {/* Map container */}
        <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto">
          {/* World map SVG background */}
          <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            {/* Simplified world map paths */}
            <path d="M180,120 L220,100 L280,110 L320,130 L310,170 L270,180 L220,160 L180,140 Z" fill="#E30613" opacity="0.3"/>
            <path d="M340,80 L420,70 L480,90 L500,130 L470,160 L400,150 L350,130 L330,100 Z" fill="#E30613" opacity="0.3"/>
            <path d="M460,130 L560,120 L620,150 L610,200 L550,210 L470,190 L450,160 Z" fill="#E30613" opacity="0.3"/>
            <path d="M580,100 L680,90 L740,120 L730,170 L670,180 L590,150 Z" fill="#E30613" opacity="0.3"/>
            <path d="M700,120 L800,110 L860,140 L850,190 L780,200 L710,170 Z" fill="#E30613" opacity="0.3"/>
            <path d="M820,140 L920,130 L980,160 L970,210 L900,220 L830,190 Z" fill="#E30613" opacity="0.3"/>
            <path d="M200,200 L300,190 L340,230 L320,280 L260,290 L200,260 Z" fill="#E30613" opacity="0.3"/>
            <path d="M360,200 L460,190 L500,230 L490,290 L430,300 L370,270 Z" fill="#E30613" opacity="0.3"/>
            <path d="M500,220 L620,210 L660,260 L640,320 L570,330 L510,290 Z" fill="#E30613" opacity="0.3"/>
            <path d="M440,300 L520,290 L550,340 L530,390 L470,400 L440,360 Z" fill="#E30613" opacity="0.3"/>
            <path d="M640,280 L740,270 L780,310 L760,360 L700,370 L650,340 Z" fill="#E30613" opacity="0.3"/>
            {/* Grid lines */}
            {[0,100,200,300,400,500].map(y => (
              <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#E30613" strokeWidth="0.3" opacity="0.3"/>
            ))}
            {[0,100,200,300,400,500,600,700,800,900,1000].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="#E30613" strokeWidth="0.3" opacity="0.3"/>
            ))}
          </svg>

          {/* Office pins */}
          {offices.map((office) => (
            <button
              key={office.id}
              onClick={() => setActive(active?.id === office.id ? null : office)}
              className="absolute group"
              style={{ left: `${office.x}%`, top: `${office.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-[#E30613] animate-ping opacity-40 scale-150" />
              {/* Pin */}
              <div className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                active?.id === office.id
                  ? "bg-[#E30613] border-white scale-150"
                  : "bg-[#E30613]/60 border-[#E30613] group-hover:scale-125 group-hover:bg-[#E30613]"
              }`} />
              {/* City label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">
                {office.city}
              </div>
            </button>
          ))}

          {/* Active office card */}
          {active && (
            <div
              className="absolute z-20 bg-[#14284d] border border-white/10 p-5 w-52 shadow-2xl"
              style={{
                left: `${Math.min(Math.max(active.x, 15), 75)}%`,
                top: `${active.y > 50 ? active.y - 45 : active.y + 10}%`,
                transform: "translateX(-50%)"
              }}
            >
              <button onClick={() => setActive(null)} className="absolute top-2 right-2 text-white/40 hover:text-white">
                <X size={12} />
              </button>
              <div className="text-2xl mb-2">{active.flag}</div>
              <div className="text-white font-black text-sm">{active.city}</div>
              <div className="text-white/50 text-xs mb-3">{active.country}</div>
              <div className="text-[10px] text-[#E30613] font-bold tracking-widest mb-1">
                {active.role[lang] || active.role.tr}
              </div>
              <div className="text-white/70 text-xs">
                {active.employees} {lang === "tr" ? "çalışan" : "employees"}
              </div>
            </div>
          )}
        </div>

        {/* Office list */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-12">
          {offices.map((office) => (
            <button
              key={office.id}
              onClick={() => setActive(active?.id === office.id ? null : office)}
              className={`p-4 border text-left transition-all duration-300 ${
                active?.id === office.id
                  ? "border-[#E30613] bg-[#E30613]/10"
                  : "border-white/10 hover:border-[#E30613]/50 hover:bg-white/5"
              }`}
            >
              <div className="text-xl mb-2">{office.flag}</div>
              <div className="text-white text-xs font-bold">{office.city}</div>
              <div className="text-white/40 text-[10px]">{office.country}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;