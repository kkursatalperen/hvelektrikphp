import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true,
});

// Attach Bearer token from localStorage as a fallback (cross-site cookies can fail)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hv_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Herkese açık veri (Hero, Kategoriler, Sayaçlar, Projeler, Footer, Partnerler, İçerik)
// için ayrı bir istemci — withCredentials KAPALI. iOS Safari, farklı alan adları
// arasında kimlik bilgili (cookie'li) istekleri çok sıkı engelliyor; bu veriler
// zaten herkese açık olduğu için çerez göndermeye hiç gerek yok.
export const publicApi = axios.create({
  baseURL: `${API}/api`,
  withCredentials: false,
});

export default api;