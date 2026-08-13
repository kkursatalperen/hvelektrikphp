import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useSiteData } from "../lib/DataProvider";

const HeroSlider = () => {
  const { slides: rawSlides } = useSiteData();
const isLoading = rawSlides === undefined;
const slides = rawSlides || [];
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0);
  const { lang } = useI18n();

  const goTo = useCallback((idx) => {
    setIsAnimating(false);
    setProgress(0);
    setTimeout(() => {
      setCurrent(idx);
      setIsAnimating(true);
    }, 50);
  }, []);

  const next = useCallback(
    () => goTo((current + 1) % Math.max(slides.length, 1)),
    [current, goTo, slides.length]
  );
  const prev = () =>
    goTo((current - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1));

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / 65, 100));
    }, 100);
    return () => clearInterval(interval);
  }, [current]);

  const stats = [
    { value: "100+", label: lang === "tr" ? "Tamamlanan Proje" : "Completed Projects" },
    { value: "2014", label: lang === "tr" ? "Kuruluş Yılı" : "Founded" },
    { value: "EPC",  label: lang === "tr" ? "Anahtar Teslim" : "Turnkey" },
  ];

  if (slides.length === 0) {
    return (
      <section className="relative w-full min-h-screen bg-[#0a1930] flex items-center overflow-hidden">
        {isLoading && (
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full flex flex-col lg:flex-row items-center gap-12 pt-24">
            <div className="w-full lg:w-[52%] animate-pulse space-y-6">
              <div className="h-4 w-40 bg-white/10 rounded" />
              <div className="h-14 w-full bg-white/10 rounded" />
              <div className="h-14 w-3/4 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-2/3 bg-white/5 rounded" />
              <div className="h-12 w-48 bg-white/10 rounded mt-8" />
            </div>
            <div className="w-full lg:w-[48%] animate-pulse">
              <div className="aspect-[4/5] max-w-md mx-auto lg:max-w-none bg-white/5" />
            </div>
          </div>
        )}
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0a1930]" data-testid="hero-slider">

      {/* Dekoratif geometrik zemin — düz koyu lacivert + hafif nokta dokusu ve büyük halka aksanı */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-[#E30613]/20" />
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/5" />
        <div className="absolute right-0 bottom-0 w-[380px] h-[380px] bg-[#E30613] opacity-[0.08] blur-[140px]" />
        <div className="absolute left-0 top-0 w-[300px] h-[300px] bg-[#003C8C] opacity-[0.25] blur-[140px]" />
      </div>

      {/* Left vertical text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
        <div className="h-16 w-[1px] bg-white/20" />
        <span className="text-white/20 text-[10px] font-bold tracking-[0.4em] rotate-90 whitespace-nowrap">
          ENERGY SOLUTIONS
        </span>
        <div className="h-16 w-[1px] bg-white/20" />
      </div>

      {/* Ana içerik — asimetrik iki kolon */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-52 pb-16 lg:pt-40 lg:pb-0 min-h-screen flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

        {/* Sol: metin */}
        <div className="w-full lg:w-[52%] lg:pr-4">
          {/* Slide indicator */}
          <div className={`flex items-center gap-3 mb-8 md:mb-6 transition-all duration-700 delay-100 ${isAnimating ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="text-[#E30613] text-xs font-black tracking-[0.4em]">
              0{current + 1} / 0{slides.length}
            </span>
            <div className="h-[1px] w-16 bg-white/20">
              <div className="h-full bg-[#E30613] transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-white/30 text-xs font-bold tracking-[0.3em]">
              {lang === "tr" ? slide.sub_tr : slide.sub_en}
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-3xl md:text-6xl lg:text-7xl font-black leading-[1.05] md:leading-[0.98] mb-6 text-white transition-all duration-700 delay-300 ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {lang === "tr" ? slide.title_tr : slide.title_en}
          </h1>

          {/* Description */}
          <p className={`text-base md:text-lg text-white/50 max-w-xl mb-10 leading-relaxed transition-all duration-700 delay-500 ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {lang === "tr" ? slide.desc_tr : slide.desc_en}
          </p>

          {/* CTA */}
          <div className={`flex items-center gap-6 mb-10 md:mb-14 transition-all duration-700 delay-700 ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <Link
              to={slide.link || "/"}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#E30613] hover:bg-[#b8050f] text-white text-sm font-black tracking-wider transition-all duration-300 group"
            >
              {lang === "tr" ? slide.cta_tr : slide.cta_en}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/iletisim" className="text-white/50 text-sm font-bold tracking-widest hover:text-white transition-colors">
              {lang === "tr" ? "İLETİŞİM →" : "CONTACT →"}
            </Link>
          </div>

          {/* İstatistikler — metin kolonunun altında, ayrık kartlar */}
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((s, i) => (
              <div key={i} className="group">
                <div className="text-2xl md:text-3xl font-black text-white group-hover:text-[#E30613] transition-colors duration-300">
                  {s.value}
                </div>
                <div className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: çerçeveli görsel paneli */}
        <div className="w-full lg:w-[48%] relative mb-8 lg:mb-0">
          <div className={`relative aspect-[4/5] max-w-md mx-auto lg:max-w-none transition-all duration-700 delay-200 ${isAnimating ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            {/* Kırmızı aksan çerçeve — görselin arkasında hafif kaymış */}
            <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-full h-full border-2 border-[#E30613]/40" />
            {/* Görsel */}
            <div className="relative w-full h-full overflow-hidden shadow-2xl">
              {slides.map((s, i) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
                >
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-out ${i === current ? "scale-110" : "scale-100"}`}
                    style={{ backgroundImage: `url(${s.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930]/70 via-transparent to-transparent" />
                </div>
              ))}
            </div>
            {/* Köşedeki rozet */}
            <div className="absolute -bottom-5 -left-5 lg:-bottom-6 lg:-left-6 bg-[#E30613] text-white px-5 py-3 flex items-center gap-2 shadow-xl">
              <Zap size={16} className="fill-white" />
              <span className="text-xs font-black tracking-widest">HV ELEKTRİK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <button onClick={prev} className="hidden lg:flex absolute left-6 lg:left-16 bottom-8 z-20 w-11 h-11 items-center justify-center border border-white/20 text-white hover:bg-[#E30613] hover:border-[#E30613] transition-all duration-300">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} className="hidden lg:flex absolute left-20 lg:left-32 bottom-8 z-20 w-11 h-11 items-center justify-center border border-white/20 text-white hover:bg-[#E30613] hover:border-[#E30613] transition-all duration-300">
        <ChevronRight size={18} />
      </button>

    </section>
  );
};

export default HeroSlider;