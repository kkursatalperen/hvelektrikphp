import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Twitter, Send, ArrowUp } from "lucide-react";
import { footerLinks } from "../data/mock";
import { Logo } from "./Header";
import { useI18n } from "../i18n/I18nProvider";
import api from "../lib/api";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [footerData, setFooterData] = useState({});
  const { t, lang } = useI18n();

  // Footer bilgilerini API'den çek
  useEffect(() => {
    api.get("/footer")
      .then((r) => setFooterData(r.data))
      .catch(() => setFooterData({}));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  // Sosyal medya linklerini API'den al, yoksa # kullan
  const socials = [
    { icon: Facebook,  href: footerData.facebook?.value_tr  || "#", label: "Facebook" },
    { icon: Instagram, href: footerData.instagram?.value_tr || "#", label: "Instagram" },
    { icon: Linkedin,  href: footerData.linkedin?.value_tr  || "#", label: "LinkedIn" },
    { icon: Youtube,   href: footerData.youtube?.value_tr   || "#", label: "YouTube" },
    { icon: Twitter,   href: footerData.twitter?.value_tr   || "#", label: "X / Twitter" },
  ];

  // API'den gelen değer varsa onu kullan, yoksa t() ile i18n'den al
  const address = lang === "tr"
    ? (footerData.address?.value_tr || t("address_value"))
    : (footerData.address?.value_en || t("address_value"));

  const phone   = footerData.phone?.value_tr   || "+90 232 504 67 79";
  const emailAddr = footerData.email?.value_tr || "info@hvelektrik.com";

  return (
    <footer className="relative bg-[#0a1930] text-white/80" data-testid="site-footer">

      {/* ── Ana Footer ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            {/* Logo + İletişim */}
            <div className="lg:col-span-1">
              <div className="mb-8"><Logo /></div>
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#E30613] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">{t("address_label")}</div>
                    <span className="text-white/60">{address}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-[#E30613] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">{t("phone_label")}</div>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-white/60 hover:text-white transition-colors">{phone}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-[#E30613] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">{t("email_label")}</div>
                    <a href={`mailto:${emailAddr}`} className="text-white/60 hover:text-white transition-colors">{emailAddr}</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Hızlı Linkler */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-white mb-6 uppercase relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#E30613]">
                {t("quick_links")}
              </h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.hizli.map((l, i) => (
                  <li key={i}>
                    <Link to={l.link} className="flex items-center gap-2 text-white/50 hover:text-white hover:gap-3 transition-all duration-300 group">
                      <span className="w-4 h-[1px] bg-[#E30613] shrink-0 group-hover:w-6 transition-all duration-300" />
                      {t(l.titleKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-white mb-6 uppercase relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#E30613]">
                {t("corp_links")}
              </h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.yatirim.map((l, i) => (
                  <li key={i}>
                    <Link to={l.link} className="flex items-center gap-2 text-white/50 hover:text-white hover:gap-3 transition-all duration-300 group">
                      <span className="w-4 h-[1px] bg-[#E30613] shrink-0 group-hover:w-6 transition-all duration-300" />
                      {t(l.titleKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bülten + Sosyal Medya */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-white mb-6 uppercase relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#E30613]">
                {t("newsletter")}
              </h4>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">{t("newsletter_desc")}</p>
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#E30613] text-white text-sm px-4 py-3 pr-16 outline-none transition-colors placeholder-white/30"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-[#E30613] hover:bg-[#b8050f] text-white flex items-center justify-center transition-colors">
                  {subscribed ? "✓" : <Send size={14} />}
                </button>
              </form>

              {/* Sosyal Medya */}
              <div className="mt-8">
                <div className="text-[9px] tracking-[0.3em] text-white/30 mb-5 font-bold uppercase">{t("follow_us")}</div>
                <div className="flex gap-3">
                  {socials.map((s, i) => (
                    <a
                      key={i} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/50 hover:bg-[#E30613] hover:border-[#E30613] hover:text-white transition-all duration-300 hover:-translate-y-1"
                    >
                      <s.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Alt Bar ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div>© {new Date().getFullYear()} HV Elektrik Proje Taahhüt San. Tic. Ltd. Şti. {t("all_rights")}</div>
          <div className="flex items-center gap-6">
            <a href="#kvkk" className="hover:text-[#E30613] transition-colors">{t("kvkk")}</a>
            <a href="#gizlilik" className="hover:text-[#E30613] transition-colors">{t("privacy")}</a>
            <a href="#cerez" className="hover:text-[#E30613] transition-colors">{t("cookie")}</a>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#E30613] hover:bg-[#b8050f] text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:-translate-y-1"
        aria-label="scroll-top"
      >
        <ArrowUp size={18} />
      </button>

    </footer>
  );
};

export default Footer;