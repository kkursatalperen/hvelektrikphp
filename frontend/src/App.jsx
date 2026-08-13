import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { I18nProvider } from "./i18n/I18nProvider";
import { DataProvider } from "./lib/DataProvider";
import Header from "./components/Header";
import HeroSlider from "./components/HeroSlider";
import AboutSection from "./components/AboutSection";
import Categories from "./components/Categories";
import CounterSection from "./components/CounterSection";
import Footer from "./components/Footer";
import StaticPage from "./pages/StaticPage";
import AboutPage from "./pages/AboutPage";
import HistoryPage from "./pages/HistoryPage";
import GroupPage from "./pages/GroupPage";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminApp from "./pages/admin/AdminApp";
import SEO from "./components/SEO";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ServicePage from "./pages/ServicePage";
import SustainabilityPage from "./pages/SustainabilityPage";
import Preloader from "./components/Preloader";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetail";
import CookieBanner from "./components/CookieBanner";
import WhatsAppButton from "./components/WhatsAppButton";

const Home = () => (
  <>
    <SEO path="/" />
    <Header />
    <main>
      <HeroSlider />           
      <AboutSection />         
      <CounterSection />                   
      <Categories />                      
    </main>
    <Footer />
    <CookieBanner />
    <WhatsAppButton />
  </>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const S = (props) => <StaticPage {...props} />;

function App() {
  return (
    <I18nProvider>
      <DataProvider>
        <div className="App">
          <Preloader />
          <BrowserRouter>
            <ScrollToTop />
            <GoogleAnalytics />
            <Routes>
              <Route path="/" element={<Home />} />

              {/* About */}
              <Route path="/hakkimizda" element={<AboutPage />} />
              <Route path="/hakkimizda/tarihce" element={<HistoryPage />} />
              <Route path="/hakkimizda/grup" element={<GroupPage />} />
              

              {/* Services */}
              <Route path="/hizmetler" element={<ServicePage serviceKey="epc" titleKey="cat_title" bodyKey="epc_body" crumbs={[{ label: "Hizmetler" }]} />} />
              <Route path="/hizmetler/epc-proje-yonetimi" element={<ServicePage serviceKey="epc" titleKey="epc_title" bodyKey="epc_body" crumbs={[{ label: "Hizmetler", link: "/hizmetler" }, { label: "EPC" }]} />} />
              <Route path="/hizmetler/guc-sistemleri-panolar" element={<ServicePage serviceKey="uretim" titleKey="production_title" bodyKey="production_body" crumbs={[{ label: "Hizmetler", link: "/hizmetler" }, { label: "Güç Sistemleri & Panolar" }]} />} />
              <Route path="/hizmetler/salt-sahalari-altyapi" element={<ServicePage serviceKey="satis" titleKey="sales_title" bodyKey="sales_body" crumbs={[{ label: "Hizmetler", link: "/hizmetler" }, { label: "Şalt Sahaları & Altyapı" }]} />} />
              <Route path="/hizmetler/isletme-bakim-hizmetleri" element={<ServicePage serviceKey="muhendislik" titleKey="engineering_title" bodyKey="engineering_body" crumbs={[{ label: "Hizmetler", link: "/hizmetler" }, { label: "İşletme Bakım Hizmetleri" }]} />} />
              <Route path="/hizmetler/elektrik-taahhut-hizmetleri" element={<ServicePage serviceKey="taahhut" titleKey="contracting_title" bodyKey="contracting_body" crumbs={[{ label: "Hizmetler", link: "/hizmetler" }, { label: "Elektrik Taahhüt Hizmetleri" }]} />} />

              {/* Eski adresler — biri hâlâ eski linki kullanırsa yeni adrese yönlendir */}
              <Route path="/hizmetler/anahtar-teslim" element={<Navigate to="/hizmetler/epc-proje-yonetimi" replace />} />
              <Route path="/hizmetler/uretim" element={<Navigate to="/hizmetler/guc-sistemleri-panolar" replace />} />
              <Route path="/hizmetler/satis" element={<Navigate to="/hizmetler/salt-sahalari-altyapi" replace />} />
              <Route path="/hizmetler/muhendislik" element={<Navigate to="/hizmetler/isletme-bakim-hizmetleri" replace />} />
              <Route path="/hizmetler/scada-izleme-sistemleri" element={<Navigate to="/hizmetler/isletme-bakim-hizmetleri" replace />} />

              {/* Sustainability */}
              <Route path="/surdurulebilirlik" element={<SustainabilityPage section="cevre" />} />
              <Route path="/surdurulebilirlik/cevre" element={<SustainabilityPage section="cevre" />} />
              <Route path="/surdurulebilirlik/kalite" element={<SustainabilityPage section="kalite" />} />

              {/* Career */}
              <Route path="/kariyer" element={<Career />} />

              {/* Contact */}
              <Route path="/iletisim" element={<Contact />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminApp />} />

              {/* Projects */}
              <Route path="/projeler" element={<ProjectsPage />} />
              <Route path="/projeler/:id" element={<ProjectDetail />} />
              <Route path="/projeler/devam-eden" element={<ProjectsPage filter="devam" />} />
              <Route path="/projeler/tamamlanan" element={<ProjectsPage filter="tamamlanan" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </DataProvider>
    </I18nProvider>
  );
}

export default App;