import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail, Globe } from "lucide-react";
import { navigation } from "../data/mock";
import { useI18n } from "../i18n/I18nProvider";

const Logo = ({ small, to = "/" }) => (
  <Link to={to} className="flex items-center leading-none select-none" data-testid="logo-link">
    <img
      src="/logo/hv-elektrik-logo-full.png"
      alt="HV Elektrik"
      className={`w-auto transition-all duration-500 ${small ? "h-16" : "h-24 md:h-28"}`}
    />
  </Link>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSub, setMobileSub] = useState(null);
  const { t, lang, setLang } = useI18n();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileSub(null);
  }, [location.pathname]);

  const toggleLang = () => setLang(lang === "tr" ? "en" : "tr");

  return (
    <>
      {/* Top bar */}
      <div
        className={`hidden lg:block bg-black/30 text-white/80 text-xs transition-all duration-300 ${
          scrolled ? "h-0 overflow-hidden opacity-0" : "h-9 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+905442417095" className="flex items-center gap-2 hover:text-[#E30613] transition-colors">
              <Phone size={12} /> +90 544 241 70 95
            </a>
            <a href="mailto:info@hvelektrik.com" className="flex items-center gap-2 hover:text-[#E30613] transition-colors">
              <Mail size={12} /> info@hvelektrik.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="tracking-wider">KEMALPAŞA / İZMİR</span>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 hover:text-[#E30613] transition-colors"
              data-testid="lang-toggle-top"
            >
              <Globe size={12} /> {lang === "tr" ? "EN" : "TR"}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
  scrolled ? "bg-white shadow-lg py-2 top-0" : "bg-transparent py-4 top-9"
}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Logo small={scrolled} />

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item, i) => (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(i)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.link}
                  className={`flex items-center gap-1 px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors relative group ${scrolled ? "text-[#14284d] hover:text-[#E30613]" : "text-white hover:text-[#E30613]"}`}
                  data-testid={`nav-${item.titleKey}`}
                >
                  {t(item.titleKey)}
                  {item.dropdown && (
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${openDropdown === i ? "rotate-180" : ""}`}
                    />
                  )}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2px] bg-[#E30613] origin-left transition-transform duration-300 ${
                      openDropdown === i ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>

                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 min-w-[260px] bg-white shadow-2xl border-t-2 border-[#E30613] transition-all duration-300 origin-top ${
                      openDropdown === i ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <ul className="py-2">
                      {item.dropdown.map((sub, j) => (
                        <li key={j}>
                          <Link
                            to={sub.link}
                            className="block px-5 py-2.5 text-[13px] text-[#14284d] hover:bg-[#E30613] hover:text-white hover:pl-7 transition-all duration-300"
                            data-testid={`nav-sub-${sub.titleKey}`}
                          >
                            {t(sub.titleKey)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={toggleLang}
              className={`ml-3 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${scrolled ? "text-[#14284d] hover:text-[#E30613]" : "text-white hover:text-[#E30613]"}`}
              data-testid="lang-toggle-nav"
            >
              <Globe size={14} /> {lang === "tr" ? "EN" : "TR"}
            </button>
          </nav>

          <button
            className="lg:hidden text-[#14284d] p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Menü Aç"
            data-testid="mobile-menu-open"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <aside
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Logo />
            <button onClick={() => setMobileOpen(false)} className="p-2 text-[#14284d] hover:text-[#E30613]" data-testid="mobile-menu-close">
              <X size={24} />
            </button>
          </div>
          <nav className="overflow-y-auto h-[calc(100%-80px)] py-4">
            {navigation.map((item, i) => (
              <div key={i} className="border-b border-gray-100">
                {item.dropdown ? (
                  <button
                    onClick={() => setMobileSub(mobileSub === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-[#14284d] hover:bg-gray-50"
                  >
                    {t(item.titleKey)}
                    <ChevronDown
                      size={16}
                      className={`text-[#E30613] transition-transform duration-300 ${
                        mobileSub === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-[#14284d] hover:bg-gray-50"
                  >
                    {t(item.titleKey)}
                  </Link>
                )}
                {item.dropdown && (
                  <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${mobileSub === i ? "max-h-96" : "max-h-0"}`}>
                    {item.dropdown.map((sub, j) => (
                      <Link
                        key={j}
                        to={sub.link}
                        className="block px-10 py-3 text-sm text-gray-600 hover:text-[#E30613] hover:bg-white transition-colors"
                      >
                        {t(sub.titleKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="px-6 py-4">
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#14284d] hover:text-[#E30613]"
                data-testid="lang-toggle-mobile"
              >
                <Globe size={16} /> {lang === "tr" ? "EN" : "TR"}
              </button>
            </div>
            <div className="px-6 py-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#E30613]" /> +90 544 241 70 95
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#E30613]" /> info@hvelektrik.com
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Header;
export { Logo };
