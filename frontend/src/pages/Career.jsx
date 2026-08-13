import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Send, CheckCircle2, AlertCircle, FileText, X, Briefcase, Users, TrendingUp, Award, MapPin, Clock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";
import api from "../lib/api";

const API = import.meta.env.VITE_BACKEND_URL || "";
const MAX_MB = 10;
const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const Career = () => {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", message: "" });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openPositions, setOpenPositions] = useState([]);

  useEffect(() => {
    api.get("/career-posts").then((r) => setOpenPositions(r.data || [])).catch(() => {});
  }, []);

  const pickPosition = (title) => {
    setForm((f) => ({ ...f, position: title }));
    document.querySelector('[data-testid="career-position"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      setStatus({ type: "error", text: lang === "tr" ? "Sadece PDF, DOC ve DOCX yükleyebilirsiniz." : "Only PDF, DOC and DOCX are allowed." });
      e.target.value = "";
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setStatus({ type: "error", text: lang === "tr" ? `Dosya ${MAX_MB} MB'dan büyük olamaz.` : `File must be smaller than ${MAX_MB} MB.` });
      e.target.value = "";
      return;
    }
    setStatus(null);
    setFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: "error", text: lang === "tr" ? "Lütfen CV yükleyin." : "Please attach your CV." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("cv", file);
      await axios.post(`${API}/api/career`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus({ type: "success", text: lang === "tr" ? "Başvurunuz iletildi. En kısa sürede sizinle iletişime geçeceğiz." : "Application received. We will get back to you soon." });
      setForm({ name: "", email: "", phone: "", position: "", message: "" });
      setFile(null);
      const input = document.getElementById("cv-file");
      if (input) input.value = "";
    } catch (err) {
      const msg = err.response?.data?.detail || (lang === "tr" ? "Başvurunuz gönderilemedi." : "Application could not be sent.");
      setStatus({ type: "error", text: typeof msg === "string" ? msg : "Error" });
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: Briefcase, tr: "Çeşitli Projeler", en: "Diverse Projects", desc: { tr: "Enerji santrallerinden kurumsal binalara geniş proje deneyimi", en: "Broad project experience from power plants to institutional buildings" } },
    { icon: TrendingUp, tr: "Gelişim", en: "Growth", desc: { tr: "Sürekli eğitim ve gelişim fırsatları", en: "Continuous training and development" } },
    { icon: Users, tr: "Ekip", en: "Team", desc: { tr: "Deneyimli mühendislerden oluşan bir ekiple çalışma", en: "Work with a team of experienced engineers" } },
    { icon: Award, tr: "Prestij", en: "Prestige", desc: { tr: "Büyüyen bir mühendislik ve taahhüt şirketinde kariyer", en: "Career at a growing engineering and contracting company" } },
  ];

  return (
    <>
      <SEO path="/kariyer" title={t("career_title")} />
      <Header />
      <main data-testid="career-page">

        {/* Hero — açık pozisyon sayısı tez olarak, stok fotoğraf yok */}
        <section className="relative bg-[#0a1930] overflow-hidden pt-44 pb-20">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.05] flex items-center justify-center overflow-hidden">
            <Briefcase size={360} strokeWidth={0.6} className="text-white" />
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E30613]" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-8 bg-[#E30613]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613]">HV ELEKTRİK</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4">
              {lang === "tr" ? "Geleceği Birlikte" : "Let's Build the"}
            </h1>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-8"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)", color: "transparent" }}>
              {lang === "tr" ? "İnşa Edelim." : "Future Together."}
            </h1>
            {openPositions.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#E30613]">{openPositions.length}</span>
                <span className="text-white/50 text-sm tracking-widest uppercase">
                  {lang === "tr" ? "Açık Pozisyon" : "Open Positions"}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Perks */}
        <div className="bg-[#E30613]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
              {perks.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="py-8 px-6 text-center group">
                    <Icon size={24} className="text-white/70 mx-auto mb-3" strokeWidth={1.5} />
                    <div className="text-sm font-black text-white mb-1">{lang === "tr" ? p.tr : p.en}</div>
                    <div className="text-[10px] text-white/60">{p.desc[lang]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Open Positions */}
        {openPositions.length > 0 && (
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-8 bg-[#E30613]" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                  {lang === "tr" ? "AÇIK POZİSYONLAR" : "OPEN POSITIONS"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a1930] mb-10">
                {lang === "tr" ? "Ekibimize Katılın" : "Join Our Team"}
              </h2>
              <div className="grid gap-3">
                {openPositions.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#E30613] transition-colors" data-testid={`career-post-${p.id}`}>
                    <div>
                      <h3 className="text-lg font-black text-[#0a1930] mb-1">{lang === "tr" ? p.title_tr : p.title_en}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={12} />{p.location}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{p.type}</span>
                      </div>
                      {(lang === "tr" ? p.desc_tr : p.desc_en) && (
                        <p className="text-sm text-gray-500 mt-2 max-w-2xl">{lang === "tr" ? p.desc_tr : p.desc_en}</p>
                      )}
                    </div>
                    <button
                      onClick={() => pickPosition(lang === "tr" ? p.title_tr : p.title_en)}
                      className="shrink-0 px-6 py-3 bg-[#0a1930] hover:bg-[#E30613] text-white text-xs font-black tracking-widest transition-colors"
                    >
                      {lang === "tr" ? "BAŞVUR" : "APPLY"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Form section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

              {/* Left info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[2px] w-8 bg-[#E30613]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#E30613] uppercase">
                    {lang === "tr" ? "BAŞVURU" : "APPLY"}
                  </span>
                </div>
                <h2 className="text-4xl font-black text-[#0a1930] mb-6 leading-tight">
                  {lang === "tr" ? "Ekibimize Katıl" : "Join Our Team"}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                  {lang === "tr"
                    ? "Enerjinin geleceğini birlikte inşa edelim. CV'nizi yükleyip başvuru formunu doldurarak ekibimize katılabilirsiniz."
                    : "Let's build the future of energy together. Upload your CV and fill out the application form to join our team."}
                </p>

                <div className="bg-[#0a1930] p-8">
                  <div className="h-[2px] w-8 bg-[#E30613] mb-6" />
                  <p className="text-white/50 text-xs leading-relaxed mb-4">
                    {lang === "tr"
                      ? "Açık pozisyon görmüyorsanız da başvurunuzu iletebilirsiniz. Uygun bir pozisyon açıldığında sizinle iletişime geçeceğiz."
                      : "Even if you don't see an open position, you can still apply. We'll contact you when a suitable position opens."}
                  </p>
                  <a href="mailto:info@hvelektrik.com" className="text-xs font-black text-[#E30613] tracking-widest hover:text-white transition-colors">
                    info@hvelektrik.com →
                  </a>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <form onSubmit={submit} className="space-y-4" data-testid="career-form">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input required name="name" value={form.name} onChange={change} placeholder={t("form_name")}
                      className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-4 text-sm outline-none bg-white transition-colors"
                      data-testid="career-name" />
                    <input required type="email" name="email" value={form.email} onChange={change} placeholder={t("form_email")}
                      className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-4 text-sm outline-none bg-white transition-colors"
                      data-testid="career-email" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input name="phone" value={form.phone} onChange={change} placeholder={t("form_phone")}
                      className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-4 text-sm outline-none bg-white transition-colors"
                      data-testid="career-phone" />
                    <input required name="position" value={form.position} onChange={change}
                      placeholder={lang === "tr" ? "İlgilendiğiniz Pozisyon" : "Position of Interest"}
                      className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-4 text-sm outline-none bg-white transition-colors"
                      data-testid="career-position" />
                  </div>
                  <textarea name="message" value={form.message} onChange={change} placeholder={t("form_message")} rows={4}
                    className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-4 text-sm outline-none bg-white transition-colors resize-none"
                    data-testid="career-message" />

                  {/* File upload */}
                  <label htmlFor="cv-file"
                    className={`flex items-center justify-between gap-4 border-2 border-dashed p-5 cursor-pointer transition-all duration-300 ${file ? "border-[#E30613] bg-[#E30613]/5" : "border-gray-200 hover:border-[#E30613]"}`}>
                    <div className="flex items-center gap-3">
                      {file ? <FileText size={20} className="text-[#E30613]" /> : <Upload size={20} className="text-gray-300" />}
                      <div>
                        <div className="text-sm font-black text-[#0a1930]">
                          {file ? file.name : (lang === "tr" ? "CV Yükle" : "Upload CV")}
                        </div>
                        <div className="text-xs text-gray-400">
                          {file ? `${(file.size / 1024).toFixed(0)} KB` : "PDF / DOC / DOCX · max 10 MB"}
                        </div>
                      </div>
                    </div>
                    {file && (
                      <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); const i = document.getElementById("cv-file"); if (i) i.value = ""; }}
                        className="text-gray-300 hover:text-[#E30613] transition-colors">
                        <X size={16} />
                      </button>
                    )}
                    <input id="cv-file" type="file" accept={ACCEPT} className="hidden" onChange={onFile} data-testid="career-cv" />
                  </label>

                  {status?.type === "success" && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-800 text-sm" data-testid="career-success">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> {status.text}
                    </div>
                  )}
                  {status?.type === "error" && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-800 text-sm" data-testid="career-error">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" /> {status.text}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#0a1930] hover:bg-[#E30613] disabled:opacity-60 text-white text-sm font-black tracking-widest transition-all duration-300 group"
                    data-testid="career-submit">
                    {loading ? "..." : (lang === "tr" ? "BAŞVUR" : "APPLY")}
                    <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Career;