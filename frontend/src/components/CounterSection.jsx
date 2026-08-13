import React, { useEffect, useRef, useState } from "react";
import { Globe, Users, Factory, Award } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const iconMap = { 
  globe: Globe, 
  users: Users, 
  factory: Factory, 
  award: Award,
  sun: Globe,
  wind: Users,
  substation: Award
};

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const Counter = ({ value }) => {
  const [ref, inView] = useInView();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref}>{display}</span>;
};

const CounterSection = () => {
  const { lang } = useI18n();
  const { counters = [], loading } = useSiteData();

  if (!loading && counters.length === 0) return null;

  return (
    <section className="relative py-24 md:py-32 bg-[#0d1117] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15]" style={{
        backgroundImage: `
          linear-gradient(#E30613 1px, transparent 1px),
          linear-gradient(90deg, #E30613 1px, transparent 1px),
          linear-gradient(rgba(227,6,19,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(227,6,19,0.3) 1px, transparent 1px)
        `,
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        backgroundPosition: "-1px -1px, -1px -1px, -1px -1px, -1px -1px"
      }} />
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E30613] rounded-full opacity-10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E30613] rounded-full opacity-10 blur-[120px] animate-pulse" style={{animationDelay: "1s"}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-900 rounded-full opacity-20 blur-[100px]" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 0 100 L 40 100 L 40 60 L 80 60 M 80 60 L 80 40 M 120 60 L 160 60 L 160 100 L 200 100 M 100 0 L 100 40 M 100 160 L 100 200 M 40 60 L 40 40 L 60 40 M 160 60 L 160 40 L 140 40" stroke="#E30613" strokeWidth="1" fill="none"/>
            <circle cx="80" cy="60" r="3" fill="#E30613"/>
            <circle cx="120" cy="60" r="3" fill="#E30613"/>
            <circle cx="100" cy="40" r="2" fill="#E30613"/>
            <circle cx="40" cy="60" r="2" fill="#E30613"/>
            <circle cx="160" cy="60" r="2" fill="#E30613"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)"/>
      </svg>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E30613] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[1px] w-12 bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-bold tracking-[0.3em]">RAKAMLARLA HV ELEKTRİK</span>
            <span className="h-[1px] w-12 bg-[#E30613]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Sahada Kanıtlanmış Güç</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#0d1117] p-10 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-white/10 mb-6" />
                <div className="h-12 w-20 bg-white/10 rounded mb-4" />
                <div className="h-2 w-16 bg-white/5 rounded" />
              </div>
            ))
          ) : (
            counters.map((c) => {
            const Icon = iconMap[c.icon] || Globe;
            return (
              <div key={c.id} className="group relative bg-[#0d1117] p-10 flex flex-col items-center text-center hover:bg-[#14284d] transition-colors duration-500" data-testid={`counter-${c.id}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E30613] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <Icon size={32} className="text-[#E30613] mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-1 tabular-nums">
                  <Counter value={c.value} />{c.suffix}
                </div>
                <div className="h-[1px] w-8 bg-[#E30613]/50 my-4" />
                <div className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                  {lang === "tr" ? c.label_tr : c.label_en}
                </div>
              </div>
            );
            })
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E30613] to-transparent" />
    </section>
  );
};

export default CounterSection;