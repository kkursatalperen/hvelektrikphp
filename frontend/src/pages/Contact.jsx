import React, { useState } from "react";
import axios from "axios";
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { useI18n } from "../i18n/I18nProvider";

const API = import.meta.env.VITE_BACKEND_URL || "";

const Contact = () => {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`${API}/api/contact`, form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main data-testid="contact-page">
        <SEO path="/iletisim" title={t("contact")} />
        <PageHero title={t("contact")} crumbs={[{ label: t("contact") }]} image="https://images.unsplash.com/photo-1497366216548-37526070297c" />

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-[2px] w-10 bg-[#E30613]" />
                <h6 className="text-xs font-bold tracking-[0.25em] text-[#E30613]">{t("contact_info")}</h6>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#14284d] mb-8 leading-tight">
                HV ELEKTRİK<br /><span className="text-lg font-normal text-gray-500">Proje Taahhüt San. Tic. Ltd. Şti.</span>
              </h2>

              <ul className="space-y-6 text-[15px] text-gray-700">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-[#E30613]/30 bg-[#E30613]/5">
                    <MapPin size={20} className="text-[#E30613]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">{t("address_label")}</div>
                    {t("address_value")}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-[#E30613]/30 bg-[#E30613]/5">
                    <Phone size={20} className="text-[#E30613]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">{t("phone_label")}</div>
                    +90 232 504 67 79
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-[#E30613]/30 bg-[#E30613]/5">
                    <Mail size={20} className="text-[#E30613]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">{t("email_label")}</div>
                    <a href="mailto:info@hvelektrik.com" className="hover:text-[#E30613]">info@hvelektrik.com</a>
                  </div>
                </li>
              </ul>

              <div className="mt-8 aspect-video border border-gray-200 overflow-hidden">
                <iframe
                  title="map"
                  src="https://www.google.com/maps?q=KOSBİ%20Kemalpaşa%20İzmir&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-[2px] w-10 bg-[#E30613]" />
                <h6 className="text-xs font-bold tracking-[0.25em] text-[#E30613]">{t("contact_form")}</h6>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#14284d] mb-8 leading-tight">
                {t("form_send")} <span className="text-[#E30613]">.</span>
              </h2>

              <form onSubmit={submit} className="space-y-5" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    required name="name" value={form.name} onChange={change} placeholder={t("form_name")}
                    className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-3.5 text-sm outline-none transition-colors"
                    data-testid="contact-name"
                  />
                  <input
                    required type="email" name="email" value={form.email} onChange={change} placeholder={t("form_email")}
                    className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-3.5 text-sm outline-none transition-colors"
                    data-testid="contact-email"
                  />
                </div>
                <input
                  name="phone" value={form.phone} onChange={change} placeholder={t("form_phone")}
                  className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-3.5 text-sm outline-none transition-colors"
                  data-testid="contact-phone"
                />
                <input
                  required name="subject" value={form.subject} onChange={change} placeholder={t("form_subject")}
                  className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-3.5 text-sm outline-none transition-colors"
                  data-testid="contact-subject"
                />
                <textarea
                  required name="message" value={form.message} onChange={change} placeholder={t("form_message")} rows={6}
                  className="w-full border border-gray-200 focus:border-[#E30613] px-4 py-3.5 text-sm outline-none transition-colors resize-none"
                  data-testid="contact-message"
                />

                {status === "success" && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-800 text-sm" data-testid="contact-success">
                    <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                    {t("form_success")}
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-800 text-sm" data-testid="contact-error">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    {t("form_error")}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#E30613] hover:bg-[#b8050f] disabled:opacity-60 text-white text-sm font-bold tracking-wider transition-all duration-300 group"
                  data-testid="contact-submit"
                >
                  {loading ? "..." : t("form_send")}
                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
