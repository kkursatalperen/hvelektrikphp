import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Cookie } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

const CookieBanner = () => {
  const { lang } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("hv_cookie_consent");
    if (!consent) setTimeout(() => setVisible(true), 1500);
  }, []);

  const accept = () => {
    localStorage.setItem("hv_cookie_consent", "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("hv_cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] bg-[#0a1930] border-t-2 border-[#E30613] shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-start md:items-center gap-5">

        {/* İkon + Metin */}
        <div className="flex items-start gap-4 flex-1">
          <Cookie size={22} className="text-[#E30613] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-black tracking-[0.2em] text-white mb-1 uppercase">
              {lang === "tr" ? "Çerez Politikası & KVKK" : "Cookie Policy & GDPR"}
            </div>
            <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
              {lang === "tr"
                ? "Web sitemizde deneyiminizi geliştirmek için çerezler kullanıyoruz. Kişisel verileriniz KVKK kapsamında korunmaktadır."
                : "We use cookies to enhance your experience. Your personal data is protected under GDPR regulations."}
              {" "}
              <a href="#cerez" className="text-[#E30613] hover:underline font-bold">
                {lang === "tr" ? "Detaylı bilgi" : "Learn more"}
              </a>
            </p>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-5 py-2.5 text-xs font-bold tracking-widest text-white/50 border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
          >
            {lang === "tr" ? "REDDET" : "REJECT"}
          </button>
          <button
            onClick={accept}
            className="px-6 py-2.5 text-xs font-black tracking-widest bg-[#E30613] text-white hover:bg-white hover:text-[#E30613] transition-all duration-300"
          >
            {lang === "tr" ? "KABUL ET" : "ACCEPT"}
          </button>
          <button
            onClick={reject}
            className="text-white/30 hover:text-white transition-colors p-1"
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CookieBanner;