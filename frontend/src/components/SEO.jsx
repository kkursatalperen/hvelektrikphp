import React from "react";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../i18n/I18nProvider";

const SITE_URL = import.meta.env.VITE_SITE_URL || "";

const defaults = {
  tr: {
    title: "HV Elektrik – Yüksek Gerilim ve Enerji Çözümleri",
    description:
      "HV Elektrik Proje Taahhüt San. Tic. Ltd. Şti. — 2014'ten bu yana İzmir merkezli; anahtar teslim EPC taahhüt, saha müteahhitliği ve mühendislik danışmanlığı hizmetleri.",
  },
  en: {
    title: "HV Elektrik – High Voltage & Energy Solutions",
    description:
      "HV Elektrik Proje Taahhüt San. Tic. Ltd. Şti. — Izmir-based since 2014, providing turn-key EPC contracting, field construction and engineering consulting services.",
  },
};

const SEO = ({ title, description, image, path = "" }) => {
  const { lang } = useI18n();
  const d = defaults[lang] || defaults.tr;
  const t = title ? `${title} | HV Elektrik` : d.title;
  const desc = description || d.description;
  const url = SITE_URL ? `${SITE_URL}${path}` : undefined;
  const img = image || "https://images.pexels.com/photos/170465/pexels-photo-170465.jpeg";

  return (
    <Helmet prioritizeSeoTags>
      <html lang={lang} />
      <title>{t}</title>
      <meta name="description" content={desc} />
      <meta property="og:site_name" content="HV Elektrik" />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {url && <link rel="canonical" href={url} />}
      <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/favicon-180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon/favicon-192.png" />
      <meta name="theme-color" content="#0a1930" />
    </Helmet>
  );
};

export default SEO;
