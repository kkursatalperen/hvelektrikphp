import React, { useEffect, useState } from "react";
import { Link, useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  MessageSquare, Newspaper, LogOut, Trash2, CheckCircle, Circle,
  PlusCircle, Edit3, Save, X, ArrowLeft, Eye, Briefcase, Download,
  Image, LayoutGrid, BarChart2, FolderOpen, Users, FileText, MapPin, Settings,
  ChevronUp, ChevronDown, ToggleLeft, ToggleRight, Globe,
  Upload, Plus, ImagePlus, Link as LinkIcon, Loader2,
} from "lucide-react";
import api from "../../lib/api";

// ------------------------------------------------------------------ //
// Auth hook
// ------------------------------------------------------------------ //
const useAuthCheck = () => {
  const nav = useNavigate();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    api.get("/auth/me")
      .then(() => setChecked(true))
      .catch(() => {
        localStorage.removeItem("hv_admin_token");
        nav("/admin/login", { replace: true });
      });
  }, [nav]);
  return checked;
};

// ------------------------------------------------------------------ //
// Shared UI helpers
// ------------------------------------------------------------------ //
const Btn = ({ children, onClick, red, outline, disabled, testId, small }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    data-testid={testId}
    className={`inline-flex items-center gap-2 font-bold tracking-wider transition-all
      ${small ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm"}
      ${red ? "bg-[#E30613] hover:bg-[#b8050f] text-white disabled:opacity-50"
        : outline ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
        : "bg-[#14284d] hover:bg-[#2a2e3e] text-white"}`}
  >
    {children}
  </button>
);

const Input = ({ label, value, onChange, type = "text", rows, placeholder }) => (
  <label className="block text-sm">
    <span className="text-xs font-semibold text-gray-500 block mb-1">{label}</span>
    {rows ? (
      <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
        className="w-full border border-gray-200 px-3 py-2 focus:border-[#E30613] outline-none resize-none text-sm" />
    ) : (
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full border border-gray-200 px-3 py-2 focus:border-[#E30613] outline-none text-sm" />
    )}
  </label>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
    <button type="button" onClick={() => onChange(!checked)}
      className={`transition-colors ${checked ? "text-[#E30613]" : "text-gray-300"}`}>
      {checked ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
    <span className="text-gray-600">{label}</span>
  </label>
);

const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold text-[#14284d]">{title}</h1>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const EmptyState = ({ msg = "Henüz kayıt yok." }) => (
  <div className="bg-white border border-gray-100 p-12 text-center text-gray-400 text-sm">{msg}</div>
);

const SortBtns = ({ onUp, onDown }) => (
  <div className="flex flex-col gap-0.5">
    <button onClick={onUp} className="p-0.5 text-gray-400 hover:text-[#14284d]"><ChevronUp size={14} /></button>
    <button onClick={onDown} className="p-0.5 text-gray-400 hover:text-[#14284d]"><ChevronDown size={14} /></button>
  </div>
);

// Inline image preview
const ImgPreview = ({ url }) => url
  ? <img loading="lazy" src={url} alt="" className="w-16 h-10 object-cover rounded border border-gray-100 flex-shrink-0" />
  : <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0"><Image size={14} className="text-gray-300" /></div>;

// ------------------------------------------------------------------ //
// ImageUploader — tek görsel, dosya veya URL
// ------------------------------------------------------------------ //
const ImageUploader = ({ label = "Görsel", value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState("file"); // "file" | "url"
  const [urlInput, setUrlInput] = useState(value || "");
  const ref = React.useRef();

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch (e) {
      alert("Yükleme başarısız: " + (e.response?.data?.detail || e.message));
    } finally {
      setUploading(false);
    }
  };

  const applyUrl = () => { onChange(urlInput.trim()); };

  return (
    <div className="block text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => setMode("file")}
            className={`text-[10px] px-2 py-0.5 font-bold border transition-colors ${mode === "file" ? "bg-[#14284d] text-white border-[#14284d]" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}>
            Dosya
          </button>
          <button type="button" onClick={() => setMode("url")}
            className={`text-[10px] px-2 py-0.5 font-bold border transition-colors ${mode === "url" ? "bg-[#14284d] text-white border-[#14284d]" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}>
            URL
          </button>
        </div>
      </div>

      {mode === "file" ? (
        <div
          onClick={() => !uploading && ref.current?.click()}
          className={`relative border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors
            ${uploading ? "border-gray-200 bg-gray-50" : "border-gray-200 hover:border-[#E30613] hover:bg-red-50/30"}`}
        >
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={(e) => upload(e.target.files?.[0])} />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <Loader2 size={16} className="animate-spin" /> Yükleniyor…
            </div>
          ) : value ? (
            <div className="flex items-center gap-3">
              <img loading="lazy" src={value} alt="" className="h-12 w-20 object-cover rounded border border-gray-200" />
              <div className="text-left">
                <div className="text-xs text-gray-500">Görsel yüklendi</div>
                <div className="text-[10px] text-[#E30613] font-bold mt-0.5">Değiştirmek için tıkla</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <Upload size={20} />
              <span className="text-xs">Dosya seç veya sürükle bırak</span>
              <span className="text-[10px] text-gray-300">JPG, PNG, WEBP — maks. 10 MB</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:border-[#E30613] outline-none"
          />
          <button type="button" onClick={applyUrl}
            className="px-3 py-2 bg-[#14284d] text-white text-xs font-bold hover:bg-[#2a2e3e]">
            Uygula
          </button>
        </div>
      )}

      {value && mode === "url" && (
        <img loading="lazy" src={value} alt="" className="mt-2 h-12 w-24 object-cover rounded border border-gray-200" />
      )}
    </div>
  );
};

// ------------------------------------------------------------------ //
// MultiImageManager — projeler için çoklu görsel
// ------------------------------------------------------------------ //
const MultiImageManager = ({ label = "Görseller", images, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const ref = React.useRef();

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange([...images, data.url]);
    } catch (e) {
      alert("Yükleme başarısız: " + (e.response?.data?.detail || e.message));
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    onChange([...images, u]);
    setUrlInput("");
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

  const move = (idx, dir) => {
    const arr = [...images];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange(arr);
  };

  return (
    <div className="block text-sm">
      <span className="text-xs font-semibold text-gray-500 block mb-2">{label}</span>

      {/* Mevcut görseller */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {images.map((url, idx) => (
            <div key={idx} className="relative group">
              <img loading="lazy" src={url} alt="" className="w-full h-20 object-cover rounded border border-gray-200" />
              {/* Overlay butonlar */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                  className="p-1 bg-white/90 rounded text-gray-700 disabled:opacity-30 hover:bg-white">
                  <ChevronUp size={12} />
                </button>
                <button type="button" onClick={() => remove(idx)}
                  className="p-1 bg-[#E30613] rounded text-white hover:bg-[#b8050f]">
                  <Trash2 size={12} />
                </button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === images.length - 1}
                  className="p-1 bg-white/90 rounded text-gray-700 disabled:opacity-30 hover:bg-white">
                  <ChevronDown size={12} />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[9px] bg-[#E30613] text-white px-1 py-0.5 font-bold leading-none">
                  ANA
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Yeni görsel ekle */}
      <div className="border border-dashed border-gray-200 rounded p-3 space-y-2">
        <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Görsel Ekle</div>
        {/* Dosya yükle */}
        <div
          onClick={() => !uploading && ref.current?.click()}
          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-xs
            ${uploading ? "bg-gray-50 text-gray-300" : "hover:bg-red-50/40 text-gray-500 hover:text-[#E30613]"}`}
        >
          <input ref={ref} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => Array.from(e.target.files || []).forEach(uploadFile)} />
          {uploading
            ? <><Loader2 size={14} className="animate-spin" /> Yükleniyor…</>
            : <><ImagePlus size={14} /> Bilgisayardan seç (çoklu seçim desteklenir)</>}
        </div>
        {/* URL ekle */}
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addUrl()}
            placeholder="URL ile ekle: https://..."
            className="flex-1 border border-gray-200 px-2 py-1.5 text-xs focus:border-[#E30613] outline-none"
          />
          <button type="button" onClick={addUrl}
            className="px-3 py-1.5 bg-[#14284d] text-white text-xs font-bold hover:bg-[#2a2e3e] flex items-center gap-1">
            <Plus size={12} /> Ekle
          </button>
        </div>
      </div>
      <div className="text-[10px] text-gray-400 mt-1.5">İlk görsel liste ve kart görünümünde "Ana Görsel" olarak kullanılır. Üzerine gelin sıra ve silme butonlarını görün.</div>
    </div>
  );
};

// ------------------------------------------------------------------ //
// Sidebar
// ------------------------------------------------------------------ //
const Sidebar = () => {
  const nav = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("hv_admin_token");
    nav("/admin/login");
  };

  const groups = [
    {
      label: "Gelen Kutunuz",
      items: [
        { to: "/admin", label: "Mesajlar", icon: MessageSquare, exact: true },
        { to: "/admin/careers", label: "Başvurular", icon: Briefcase },
      ],
    },
    {
      label: "İçerik",
      items: [
        { to: "/admin/hero-slides", label: "Hero Slaytlar", icon: Image },
        { to: "/admin/categories", label: "Kategoriler", icon: LayoutGrid },
        { to: "/admin/counters", label: "Sayaçlar", icon: BarChart2 },
        { to: "/admin/projects", label: "Projeler", icon: FolderOpen },
        { to: "/admin/partners", label: "Ortaklar", icon: Users },
        { to: "/admin/career-posts", label: "Kariyer İlanları", icon: FileText },
      ],
    },
    {
      label: "Ayarlar",
      items: [
        { to: "/admin/footer", label: "Footer Bilgileri", icon: MapPin },
        { to: "/admin/content", label: "Sayfa İçerikleri", icon: Settings },
      ],
    },
  ];

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <aside className="w-64 bg-[#14284d] text-white/80 min-h-screen flex flex-col flex-shrink-0" data-testid="admin-sidebar">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-baseline gap-1">
          <span className="text-white text-2xl font-black">HV</span>
          <span className="text-[#E30613] text-xl font-light italic">Elektrik</span>
        </div>
        <div className="text-[10px] tracking-[0.2em] text-white/40 mt-1">ADMIN PANEL</div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {groups.map((g) => (
          <div key={g.label} className="mb-4">
            <div className="px-6 py-2 text-[10px] tracking-[0.15em] text-white/30 font-bold uppercase">{g.label}</div>
            {g.items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm font-semibold transition-all ${
                  isActive(it) ? "bg-[#E30613] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <it.icon size={15} /> {it.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 space-y-2">
        <Link to="/" className="flex items-center gap-2 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={12} /> Siteye Dön
        </Link>
        <button onClick={logout} className="flex items-center gap-2 text-xs text-white/60 hover:text-[#E30613]" data-testid="admin-logout">
          <LogOut size={12} /> Çıkış
        </button>
      </div>
    </aside>
  );
};

// ------------------------------------------------------------------ //
// Messages Page (unchanged)
// ------------------------------------------------------------------ //
const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api.get("/admin/messages").then((r) => setMessages(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markRead = async (m) => {
    if (m.read) return;
    await api.patch(`/admin/messages/${m.id}/read`);
    load();
  };
  const remove = async (m) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    await api.delete(`/admin/messages/${m.id}`);
    setSelected(null);
    load();
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8" data-testid="admin-messages-page">
      <PageHeader title="Mesajlar" subtitle={`Toplam: ${messages.length} · Okunmamış: ${unread}`} />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 overflow-hidden">
          {messages.length === 0 && <div className="p-6 text-gray-400 text-sm">Henüz mesaj yok.</div>}
          {messages.map((m) => (
            <button key={m.id} onClick={() => { setSelected(m); markRead(m); }}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 flex gap-3 items-start ${selected?.id === m.id ? "bg-gray-50" : ""}`}>
              {m.read ? <CheckCircle size={16} className="text-gray-300 mt-1" /> : <Circle size={16} className="text-[#E30613] fill-[#E30613] mt-1" />}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <div className={`text-sm truncate ${m.read ? "text-gray-700" : "font-bold text-[#14284d]"}`}>{m.name}</div>
                  <div className="text-[10px] text-gray-400 flex-shrink-0">{new Date(m.created_at).toLocaleDateString("tr-TR")}</div>
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{m.subject}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3 bg-white border border-gray-100 min-h-[400px]">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#14284d]">{selected.subject}</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">{selected.name}</span> · <a href={`mailto:${selected.email}`} className="text-[#E30613]">{selected.email}</a>
                    {selected.phone && <> · {selected.phone}</>}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(selected.created_at).toLocaleString("tr-TR")}</div>
                </div>
                <button onClick={() => remove(selected)} className="text-gray-400 hover:text-[#E30613] p-2"><Trash2 size={18} /></button>
              </div>
              <div className="mt-6 p-5 bg-gray-50 border-l-4 border-[#E30613] text-gray-700 leading-7 whitespace-pre-wrap">{selected.message}</div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm p-6">Bir mesaj seçin</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ //
// Career Applications Page (unchanged)
// ------------------------------------------------------------------ //
const CareersPage = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api.get("/admin/careers").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markRead = async (c) => {
    if (c.read) return;
    await api.patch(`/admin/careers/${c.id}/read`);
    load();
  };
  const remove = async (c) => {
    if (!window.confirm("Başvuruyu silmek istediğinize emin misiniz?")) return;
    await api.delete(`/admin/careers/${c.id}`);
    setSelected(null);
    load();
  };

  const unread = items.filter((c) => !c.read).length;

  return (
    <div className="p-8" data-testid="admin-careers-page">
      <PageHeader title="Kariyer Başvuruları" subtitle={`Toplam: ${items.length} · Okunmamış: ${unread}`} />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 overflow-hidden">
          {items.length === 0 && <div className="p-6 text-gray-400 text-sm">Henüz başvuru yok.</div>}
          {items.map((c) => (
            <button key={c.id} onClick={() => { setSelected(c); markRead(c); }}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 flex gap-3 items-start ${selected?.id === c.id ? "bg-gray-50" : ""}`}>
              {c.read ? <CheckCircle size={16} className="text-gray-300 mt-1" /> : <Circle size={16} className="text-[#E30613] fill-[#E30613] mt-1" />}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <div className={`text-sm truncate ${c.read ? "text-gray-700" : "font-bold text-[#14284d]"}`}>{c.name}</div>
                  <div className="text-[10px] text-gray-400 flex-shrink-0">{new Date(c.created_at).toLocaleDateString("tr-TR")}</div>
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{c.position}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3 bg-white border border-gray-100 min-h-[400px]">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#14284d]">{selected.position}</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">{selected.name}</span> · <a href={`mailto:${selected.email}`} className="text-[#E30613]">{selected.email}</a>
                    {selected.phone && <> · {selected.phone}</>}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(selected.created_at).toLocaleString("tr-TR")}</div>
                </div>
                <button onClick={() => remove(selected)} className="text-gray-400 hover:text-[#E30613] p-2"><Trash2 size={18} /></button>
              </div>
              {selected.cv_url && (
                <a href={selected.cv_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 bg-[#E30613] hover:bg-[#b8050f] text-white text-sm font-bold">
                  <Download size={14} /> CV İndir · {selected.cv_filename || "cv"}
                </a>
              )}
              {selected.message && (
                <div className="mt-6 p-5 bg-gray-50 border-l-4 border-[#E30613] text-gray-700 leading-7 whitespace-pre-wrap">{selected.message}</div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm p-6">Bir başvuru seçin</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ //
// News Page (unchanged)
// ------------------------------------------------------------------ //
const emptyNews = {
  title_tr: "", title_en: "", excerpt_tr: "", excerpt_en: "",
  content_tr: "", content_en: "", image: "", date: new Date().toISOString().slice(0, 10), published: true,
};

const NewsPage = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyNews);

  const load = () => api.get("/news?published=false").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const start = (n) => { setEditing(n?.id || "new"); setForm(n ? { ...n } : emptyNews); };
  const cancel = () => { setEditing(null); setForm(emptyNews); };
  const save = async () => {
    if (editing === "new") await api.post("/admin/news", form);
    else await api.put(`/admin/news/${editing}`, form);
    cancel(); load();
  };
  const remove = async (n) => {
    if (!window.confirm("Silinsin mi?")) return;
    await api.delete(`/admin/news/${n.id}`);
    load();
  };
  const ch = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  return (
    <div className="p-8" data-testid="admin-news-page">
      <PageHeader title="Haberler" subtitle={`Toplam: ${items.length}`}
        action={<Btn red onClick={() => start(null)} testId="news-add"><PlusCircle size={16} /> Yeni Haber</Btn>} />

      {editing && (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-[#14284d]">{editing === "new" ? "Yeni Haber" : "Haber Düzenle"}</h3>
            <button onClick={cancel} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Başlık (TR)" value={form.title_tr} onChange={ch("title_tr")} />
            <Input label="Başlık (EN)" value={form.title_en} onChange={ch("title_en")} />
            <div className="md:col-span-2">
              <ImageUploader label="Görsel" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
            </div>
            <Input label="Tarih" value={form.date} onChange={ch("date")} type="date" />
            <div className="flex items-end pb-1"><Toggle checked={form.published} onChange={(v) => setForm({ ...form, published: v })} label="Yayınlansın" /></div>
            <div className="md:col-span-2"><Input label="Özet (TR)" value={form.excerpt_tr} onChange={ch("excerpt_tr")} /></div>
            <div className="md:col-span-2"><Input label="Özet (EN)" value={form.excerpt_en} onChange={ch("excerpt_en")} /></div>
            <div className="md:col-span-2"><Input label="İçerik (TR)" value={form.content_tr} onChange={ch("content_tr")} rows={5} /></div>
            <div className="md:col-span-2"><Input label="İçerik (EN)" value={form.content_en} onChange={ch("content_en")} rows={5} /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <Btn red onClick={save} testId="news-save"><Save size={14} /> Kaydet</Btn>
            <Btn outline onClick={cancel}>İptal</Btn>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {items.map((n) => (
          <div key={n.id} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
            <ImgPreview url={n.image} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#14284d] truncate">{n.title_tr}</div>
              <div className="text-xs text-gray-500 truncate">{n.title_en}</div>
              <div className="text-xs text-gray-400 mt-1">
                {n.date} · {n.published ? <span className="text-green-600">Yayında</span> : <span className="text-orange-500">Taslak</span>}
              </div>
            </div>
            <div className="flex gap-1">
              <Link to={`/haberler/${n.id}`} className="p-2 text-gray-400 hover:text-[#14284d]"><Eye size={16} /></Link>
              <button onClick={() => start(n)} className="p-2 text-gray-400 hover:text-[#14284d]"><Edit3 size={16} /></button>
              <button onClick={() => remove(n)} className="p-2 text-gray-400 hover:text-[#E30613]"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ //
// Generic CRUD list builder
// Kullanım: sortable, active toggle, image, TR/EN başlık
// ------------------------------------------------------------------ //
const makeCRUDPage = ({ title, endpoint, emptyForm, renderRow, renderForm, testPrefix = "" }) => {
  return function CRUDPage() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const load = () => api.get(endpoint).then((r) => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const start = (item) => { setEditing(item?.id || "new"); setForm(item ? { ...item } : { ...emptyForm }); };
    const cancel = () => { setEditing(null); setForm({ ...emptyForm }); };
    const save = async () => {
      setSaving(true);
      try {
        if (editing === "new") await api.post(endpoint, form);
        else await api.put(`${endpoint}/${editing}`, form);
        cancel(); load();
      } finally { setSaving(false); }
    };
    const remove = async (item) => {
      if (!window.confirm("Silinsin mi?")) return;
      await api.delete(`${endpoint}/${item.id}`);
      load();
    };
    const ch = (k) => (val) => setForm((f) => ({ ...f, [k]: val }));
    const chE = (k) => (e) => ch(k)(e.target.type === "checkbox" ? e.target.checked : e.target.value);

    return (
      <div className="p-8">
        <PageHeader title={title} subtitle={`Toplam: ${items.length}`}
          action={<Btn red onClick={() => start(null)} testId={`${testPrefix}-add`}><PlusCircle size={16} /> Yeni Ekle</Btn>} />

        {editing && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-[#14284d]">{editing === "new" ? `Yeni ${title.replace(/lar$|ler$/, "")}` : "Düzenle"}</h3>
              <button onClick={cancel} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            {renderForm({ form, ch, chE })}
            <div className="flex gap-3 mt-6">
              <Btn red onClick={save} disabled={saving}><Save size={14} /> {saving ? "Kaydediliyor…" : "Kaydet"}</Btn>
              <Btn outline onClick={cancel}>İptal</Btn>
            </div>
          </div>
        )}

        {items.length === 0 && !editing && <EmptyState />}
        <div className="grid gap-2">
          {items.map((item) => renderRow({ item, onEdit: () => start(item), onDelete: () => remove(item) }))}
        </div>
      </div>
    );
  };
};

// ------------------------------------------------------------------ //
// Hero Slides
// ------------------------------------------------------------------ //
const HeroSlidesPage = makeCRUDPage({
  title: "Hero Slaytlar",
  endpoint: "/admin/hero-slides",
  emptyForm: { sort_order: 0, image: "", sub_tr: "", sub_en: "", title_tr: "", title_en: "", desc_tr: "", desc_en: "", cta_tr: "", cta_en: "", link: "/", active: true },
  renderRow: ({ item, onEdit, onDelete }) => (
    <div key={item.id} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
      <span className="text-xs text-gray-400 w-6 text-center font-bold">{item.sort_order}</span>
      <ImgPreview url={item.image} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#14284d] truncate">{item.title_tr || <span className="text-gray-300">—</span>}</div>
        <div className="text-xs text-gray-500 truncate">{item.sub_tr}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 font-bold ${item.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
        {item.active ? "Aktif" : "Pasif"}
      </span>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-[#14284d]"><Edit3 size={16} /></button>
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-[#E30613]"><Trash2 size={16} /></button>
      </div>
    </div>
  ),
  renderForm: ({ form, ch, chE }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <Input label="Sıra No" value={form.sort_order} onChange={chE("sort_order")} type="number" />
      <div className="flex items-end pb-1"><Toggle checked={form.active} onChange={ch("active")} label="Aktif" /></div>
      <div className="md:col-span-2">
        <ImageUploader label="Görsel" value={form.image} onChange={ch("image")} />
      </div>
      <Input label="Alt Başlık (TR)" value={form.sub_tr} onChange={chE("sub_tr")} />
      <Input label="Alt Başlık (EN)" value={form.sub_en} onChange={chE("sub_en")} />
      <Input label="Başlık (TR)" value={form.title_tr} onChange={chE("title_tr")} />
      <Input label="Başlık (EN)" value={form.title_en} onChange={chE("title_en")} />
      <div className="md:col-span-2"><Input label="Açıklama (TR)" value={form.desc_tr} onChange={chE("desc_tr")} rows={3} /></div>
      <div className="md:col-span-2"><Input label="Açıklama (EN)" value={form.desc_en} onChange={chE("desc_en")} rows={3} /></div>
      <div className="md:col-span-2">
  <div className="border-t border-gray-100 pt-4 mt-2">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">— Hizmet Detay Sayfası (ayrı içerik) —</span>
  </div>
</div>
<Input label="Sayfa Başlığı (TR)" value={form.page_title_tr} onChange={chE("page_title_tr")} />
<Input label="Sayfa Başlığı (EN)" value={form.page_title_en} onChange={chE("page_title_en")} />
<div className="md:col-span-2"><Input label="Sayfa Açıklaması (TR)" value={form.page_desc_tr} onChange={chE("page_desc_tr")} rows={3} /></div>
<div className="md:col-span-2"><Input label="Sayfa Açıklaması (EN)" value={form.page_desc_en} onChange={chE("page_desc_en")} rows={3} /></div>
      <Input label="CTA Butonu (TR)" value={form.cta_tr} onChange={chE("cta_tr")} />
      <Input label="CTA Butonu (EN)" value={form.cta_en} onChange={chE("cta_en")} />
      <div className="md:col-span-2"><Input label="Link" value={form.link} onChange={chE("link")} /></div>
    </div>
  ),
});

// ------------------------------------------------------------------ //
// Categories
// ------------------------------------------------------------------ //
const CategoriesPage = makeCRUDPage({
  title: "Kategoriler",
  endpoint: "/admin/categories",
  emptyForm: {
    sort_order: 0, icon: "tower", image: "", accent_image: "", link: "/",
    title_tr: "", title_en: "", sub_tr: "", sub_en: "", desc_tr: "", desc_en: "",
    features_tr: "", features_en: "",  // textarea'da satır satır girilecek
    active: true,
    page_title_tr: "", page_title_en: "",
    page_desc_tr: "",  page_desc_en: "",
  },
  renderRow: ({ item, onEdit, onDelete }) => (
    <div key={item.id} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
      <span className="text-xs text-gray-400 w-6 text-center font-bold">{item.sort_order}</span>
      <ImgPreview url={item.image} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#14284d] truncate">{item.title_tr}</div>
        <div className="text-xs text-gray-500 truncate">{item.title_en}</div>
        {item.features_tr?.length > 0 && (
          <div className="text-xs text-gray-400 mt-0.5">{item.features_tr.length} özellik</div>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 font-bold ${item.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
        {item.active ? "Aktif" : "Pasif"}
      </span>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-[#14284d]"><Edit3 size={16} /></button>
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-[#E30613]"><Trash2 size={16} /></button>
      </div>
    </div>
  ),
  renderForm: ({ form, ch, chE }) => {
    // features array'i textarea için string'e, kaydetmede string'i array'e çevir
    const featuresTrStr = Array.isArray(form.features_tr)
      ? form.features_tr.join("\n")
      : (form.features_tr || "");
    const featuresEnStr = Array.isArray(form.features_en)
      ? form.features_en.join("\n")
      : (form.features_en || "");
 
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Sıra No" value={form.sort_order} onChange={chE("sort_order")} type="number" />
        <Input label="İkon (örn: tower, factory, truck)" value={form.icon} onChange={chE("icon")} />
        <div className="md:col-span-2">
          <ImageUploader label="Ana Görsel (Kategori kartı)" value={form.image} onChange={ch("image")} />
        </div>
        <div className="md:col-span-2">
          <ImageUploader label="İkinci Görsel (Hizmet detay sayfası)" value={form.accent_image} onChange={ch("accent_image")} />
        </div>
        <div className="md:col-span-2"><Input label="Link" value={form.link} onChange={chE("link")} /></div>
        <Input label="Başlık (TR)" value={form.title_tr} onChange={chE("title_tr")} />
        <Input label="Başlık (EN)" value={form.title_en} onChange={chE("title_en")} />
        <Input label="Alt Başlık (TR)" value={form.sub_tr} onChange={chE("sub_tr")} />
        <Input label="Alt Başlık (EN)" value={form.sub_en} onChange={chE("sub_en")} />
        <div className="md:col-span-2"><Input label="Açıklama (TR)" value={form.desc_tr} onChange={chE("desc_tr")} rows={3} /></div>
        <div className="md:col-span-2"><Input label="Açıklama (EN)" value={form.desc_en} onChange={chE("desc_en")} rows={3} /></div>
 
        {/* Features — her satır bir madde */}
        <div className="md:col-span-2">
          <label className="block text-sm">
            <span className="text-xs font-semibold text-gray-500 block mb-1">
              Özellikler (TR) — Her satır bir madde
            </span>
            <textarea
              value={featuresTrStr}
              onChange={(e) => {
                const arr = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
                ch("features_tr")(arr);
              }}
              rows={6}
              placeholder={"Güneş enerjisi santralleri anahtar teslim kurulum\nRüzgar enerjisi santralleri mühendislik ve inşaat\n..."}
              className="w-full border border-gray-200 px-3 py-2 focus:border-[#E30613] outline-none resize-none text-sm"
            />
            <span className="text-[10px] text-gray-400">Her satır, hizmet sayfasındaki listede bir madde olarak görünür</span>
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">
            <span className="text-xs font-semibold text-gray-500 block mb-1">
              Özellikler (EN) — Her satır bir madde
            </span>
            <textarea
              value={featuresEnStr}
              onChange={(e) => {
                const arr = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
                ch("features_en")(arr);
              }}
              rows={6}
              placeholder={"Turn-key solar power plant installation\nWind power plant engineering and construction\n..."}
              className="w-full border border-gray-200 px-3 py-2 focus:border-[#E30613] outline-none resize-none text-sm"
            />
          </label>
        </div>
 
        <Toggle checked={form.active} onChange={ch("active")} label="Aktif" />
      </div>
    );
  },
});

// ------------------------------------------------------------------ //
// Counters
// ------------------------------------------------------------------ //
const CountersPage = makeCRUDPage({
  title: "Sayaçlar",
  endpoint: "/admin/counters",
  emptyForm: { sort_order: 0, icon: "globe", value: 0, suffix: "+", label_tr: "", label_en: "", active: true },
  renderRow: ({ item, onEdit, onDelete }) => (
    <div key={item.id} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
      <span className="text-xs text-gray-400 w-6 text-center font-bold">{item.sort_order}</span>
      <div className="w-16 text-center">
        <span className="text-2xl font-black text-[#14284d]">{item.value}</span>
        <span className="text-[#E30613] font-bold">{item.suffix}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#14284d]">{item.label_tr}</div>
        <div className="text-xs text-gray-500">{item.label_en}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 font-bold ${item.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
        {item.active ? "Aktif" : "Pasif"}
      </span>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-[#14284d]"><Edit3 size={16} /></button>
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-[#E30613]"><Trash2 size={16} /></button>
      </div>
    </div>
  ),
  renderForm: ({ form, ch, chE }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <Input label="Sıra No" value={form.sort_order} onChange={chE("sort_order")} type="number" />
      <Input label="İkon (globe, users, factory, award)" value={form.icon} onChange={chE("icon")} />
      <Input label="Değer" value={form.value} onChange={chE("value")} type="number" />
      <Input label="Suffix (örn: +, %)" value={form.suffix} onChange={chE("suffix")} />
      <Input label="Etiket (TR)" value={form.label_tr} onChange={chE("label_tr")} />
      <Input label="Etiket (EN)" value={form.label_en} onChange={chE("label_en")} />
      <Toggle checked={form.active} onChange={ch("active")} label="Aktif" />
    </div>
  ),
});

// ------------------------------------------------------------------ //
// Projects — çoklu görsel + dosya yükleme
// ------------------------------------------------------------------ //
const EMPTY_PROJECT = {
  sort_order: 0, images: [], image: "",
  title_tr: "", title_en: "", desc_tr: "", desc_en: "",
  category: "ges", country: "", year: new Date().getFullYear(), 
  status: "tamamlanan", active: true,
};

const ProjectsPage = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_PROJECT });
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/admin/projects").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const start = (item) => {
    setEditing(item?.id || "new");
    if (item) {
      // images dizisi yoksa image string'ini diziye çevir
      const imgs = item.images?.length ? item.images : (item.image ? [item.image] : []);
      setForm({ ...item, images: imgs });
    } else {
      setForm({ ...EMPTY_PROJECT });
    }
  };
  const cancel = () => { setEditing(null); setForm({ ...EMPTY_PROJECT }); };

  const save = async () => {
    setSaving(true);
    try {
      // İlk görseli image alanına da yaz (geriye dönük uyumluluk)
      const payload = {
        ...form,
        image: form.images[0] || "",
        images: form.images,
      };
      if (editing === "new") await api.post("/admin/projects", payload);
      else await api.put(`/admin/projects/${editing}`, payload);
      cancel(); load();
    } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!window.confirm("Silinsin mi?")) return;
    await api.delete(`/admin/projects/${item.id}`);
    load();
  };

  const ch = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const chE = (k) => (e) => ch(k)(e.target.type === "checkbox" ? e.target.checked : e.target.value);

  return (
    <div className="p-8">
      <PageHeader title="Projeler" subtitle={`Toplam: ${items.length}`}
        action={<Btn red onClick={() => start(null)}><PlusCircle size={16} /> Yeni Proje</Btn>} />

      {editing && (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-[#14284d]">{editing === "new" ? "Yeni Proje" : "Proje Düzenle"}</h3>
            <button onClick={cancel} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Sıra No" value={form.sort_order} onChange={chE("sort_order")} type="number" />
            <label className="block text-sm">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Kategori</span>
              <select value={form.category} onChange={chE("category")}
                className="w-full border border-gray-200 px-3 py-2 focus:border-[#E30613] outline-none text-sm">
                <option value="ges">GES (Güneş)</option>
                <option value="res">RES (Rüzgar)</option>
                <option value="trafo">Trafo Merkezi</option>
                <option value="iletim">İletim</option>
                <option value="diger">Diğer</option>
              </select>
            </label>
            <Input label="Başlık (TR)" value={form.title_tr} onChange={chE("title_tr")} />
            <Input label="Başlık (EN)" value={form.title_en} onChange={chE("title_en")} />
            <Input label="Ülke" value={form.country} onChange={chE("country")} />
            <Input label="Yıl" value={form.year ?? ""} onChange={chE("year")} type="number" />
            <label className="block text-sm">
  <span className="text-xs font-semibold text-gray-500 block mb-1">Durum</span>
  <select value={form.status} onChange={chE("status")}
    className="w-full border border-gray-200 px-3 py-2 focus:border-[#E30613] outline-none text-sm">
    <option value="tamamlanan">Tamamlanan</option>
    <option value="devam">Devam Eden</option>
  </select>
</label>
            <div className="md:col-span-2"><Input label="Açıklama (TR)" value={form.desc_tr} onChange={chE("desc_tr")} rows={3} /></div>
            <div className="md:col-span-2"><Input label="Açıklama (EN)" value={form.desc_en} onChange={chE("desc_en")} rows={3} /></div>

            {/* Çoklu görsel yöneticisi */}
            <div className="md:col-span-2">
              <MultiImageManager
                label={`Proje Görselleri (${form.images.length} adet)`}
                images={form.images}
                onChange={ch("images")}
              />
            </div>

            <Toggle checked={form.active} onChange={ch("active")} label="Aktif" />
          </div>

          <div className="flex gap-3 mt-6">
            <Btn red onClick={save} disabled={saving}><Save size={14} /> {saving ? "Kaydediliyor…" : "Kaydet"}</Btn>
            <Btn outline onClick={cancel}>İptal</Btn>
          </div>
        </div>
      )}

      {items.length === 0 && !editing && <EmptyState />}
      <div className="grid gap-2">
        {items.map((item) => {
          const mainImg = item.images?.[0] || item.image;
          const extraCount = (item.images?.length || 0) - 1;
          return (
            <div key={item.id} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
              <span className="text-xs text-gray-400 w-6 text-center font-bold">{item.sort_order}</span>
              <div className="relative flex-shrink-0">
                <ImgPreview url={mainImg} />
                {extraCount > 0 && (
                  <span className="absolute -bottom-1 -right-1 bg-[#14284d] text-white text-[9px] font-bold px-1 py-0.5 leading-none">
                    +{extraCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#14284d] truncate">{item.title_tr}</div>
                <div className="text-xs text-gray-500">{item.category} · {item.country} · {item.year}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 font-bold ${item.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {item.active ? "Aktif" : "Pasif"}
              </span>
              <div className="flex gap-1">
                <button onClick={() => start(item)} className="p-2 text-gray-400 hover:text-[#14284d]"><Edit3 size={16} /></button>
                <button onClick={() => remove(item)} className="p-2 text-gray-400 hover:text-[#E30613]"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ //
// Partners
// ------------------------------------------------------------------ //
const PartnersPage = makeCRUDPage({
  title: "Ortaklar",
  endpoint: "/admin/partners",
  emptyForm: { sort_order: 0, name: "", logo: "", link: "", active: true },
  renderRow: ({ item, onEdit, onDelete }) => (
    <div key={item.id} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
      <span className="text-xs text-gray-400 w-6 text-center font-bold">{item.sort_order}</span>
      <ImgPreview url={item.logo} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#14284d] truncate">{item.name}</div>
        <div className="text-xs text-gray-500 truncate">{item.link}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 font-bold ${item.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
        {item.active ? "Aktif" : "Pasif"}
      </span>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-[#14284d]"><Edit3 size={16} /></button>
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-[#E30613]"><Trash2 size={16} /></button>
      </div>
    </div>
  ),
  renderForm: ({ form, ch, chE }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <Input label="Sıra No" value={form.sort_order} onChange={chE("sort_order")} type="number" />
      <Input label="İsim" value={form.name} onChange={chE("name")} />
      <div className="md:col-span-2">
        <ImageUploader label="Logo" value={form.logo} onChange={ch("logo")} />
      </div>
      <div className="md:col-span-2"><Input label="Website Linki" value={form.link} onChange={chE("link")} /></div>
      <Toggle checked={form.active} onChange={ch("active")} label="Aktif" />
    </div>
  ),
});

// ------------------------------------------------------------------ //
// Career Posts (İlanlar)
// ------------------------------------------------------------------ //
const CareerPostsPage = makeCRUDPage({
  title: "Kariyer İlanları",
  endpoint: "/admin/career-posts",
  emptyForm: { title_tr: "", title_en: "", location: "İzmir", type: "tam-zamanlı", desc_tr: "", desc_en: "", active: true },
  renderRow: ({ item, onEdit, onDelete }) => (
    <div key={item.id} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#14284d] truncate">{item.title_tr}</div>
        <div className="text-xs text-gray-500">{item.location} · {item.type}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 font-bold ${item.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
        {item.active ? "Aktif" : "Pasif"}
      </span>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-[#14284d]"><Edit3 size={16} /></button>
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-[#E30613]"><Trash2 size={16} /></button>
      </div>
    </div>
  ),
  renderForm: ({ form, ch, chE }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <Input label="Başlık (TR)" value={form.title_tr} onChange={chE("title_tr")} />
      <Input label="Başlık (EN)" value={form.title_en} onChange={chE("title_en")} />
      <Input label="Konum" value={form.location} onChange={chE("location")} />
      <label className="block text-sm">
        <span className="text-xs font-semibold text-gray-500 block mb-1">Çalışma Tipi</span>
        <select value={form.type} onChange={chE("type")}
          className="w-full border border-gray-200 px-3 py-2 focus:border-[#E30613] outline-none text-sm">
          <option value="tam-zamanlı">Tam Zamanlı</option>
          <option value="yarı-zamanlı">Yarı Zamanlı</option>
          <option value="staj">Staj</option>
          <option value="uzaktan">Uzaktan</option>
        </select>
      </label>
      <div className="md:col-span-2"><Input label="Açıklama (TR)" value={form.desc_tr} onChange={chE("desc_tr")} rows={4} /></div>
      <div className="md:col-span-2"><Input label="Açıklama (EN)" value={form.desc_en} onChange={chE("desc_en")} rows={4} /></div>
      <Toggle checked={form.active} onChange={ch("active")} label="Aktif" />
    </div>
  ),
});

// ------------------------------------------------------------------ //
// Footer Bilgileri (key-value upsert)
// ------------------------------------------------------------------ //
const FooterPage = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ key: "", value_tr: "", value_en: "" });
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/admin/footer").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const start = (item) => { setEditing(item.key); setForm({ ...item }); };
  const cancel = () => { setEditing(null); };
  const save = async () => {
    setSaving(true);
    try { await api.put(`/admin/footer/${form.key}`, form); cancel(); load(); }
    finally { setSaving(false); }
  };
  const chE = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-8">
      <PageHeader title="Footer Bilgileri" subtitle="Adres, telefon, e-posta ve sosyal medya linkleri" />
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.key} className="bg-white border border-gray-100 p-4">
            {editing === item.key ? (
              <div className="space-y-3">
                <div className="text-xs font-bold tracking-widest text-gray-400 uppercase">{item.key}</div>
                <Input label="Türkçe" value={form.value_tr} onChange={chE("value_tr")} />
                <Input label="İngilizce" value={form.value_en} onChange={chE("value_en")} />
                <div className="flex gap-2 mt-2">
                  <Btn red onClick={save} disabled={saving}><Save size={14} /> {saving ? "…" : "Kaydet"}</Btn>
                  <Btn outline onClick={cancel}>İptal</Btn>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">{item.key}</div>
                  <div className="text-sm text-[#14284d]">{item.value_tr || <span className="text-gray-300">—</span>}</div>
                  {item.value_en !== item.value_tr && <div className="text-xs text-gray-400 mt-0.5">{item.value_en}</div>}
                </div>
                <button onClick={() => start(item)} className="p-2 text-gray-400 hover:text-[#14284d] flex-shrink-0"><Edit3 size={16} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ //
// Page Content (key-value, section'a göre gruplu)
// ------------------------------------------------------------------ //
const SECTION_LABELS = {
  "Nav": "Üst Menü",
  "Top bar": "Üst Bilgi Çubuğu",
  "About submenu": "Hakkımızda Alt Menüsü",
  "Services submenu": "Hizmetler Alt Menüsü",
  "Sustainability submenu": "Sürdürülebilirlik Alt Menüsü",
  "Investors submenu": "Yatırımcı Alt Menüsü",
  "Hero": "Ana Sayfa Slaytı",
  "About section": "Hakkımızda Bölümü (Ana Sayfa)",
  "Categories": "Hizmet Kategorileri",
  "Stock": "Borsa Bilgisi (Kullanılmıyor)",
  "Counters": "Sayaçlar",
  "News": "Haberler",
  "Footer": "Alt Bilgi (Footer)",
  "Generic page": "Genel Sayfa Metinleri",
  "Contact page": "İletişim Sayfası",
  "About page content": "Hakkımızda Sayfası",
  "Services pages": "Hizmet Sayfaları",
  "Sustainability": "Sürdürülebilirlik Sayfası",
  "Investors": "Yatırımcı İlişkileri",
  "Career": "Kariyer Sayfası",
  "Admin": "Yönetim Paneli Metinleri",
};
const sectionLabel = (s) => SECTION_LABELS[s] || s;

const ContentPage = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ key: "", value_tr: "", value_en: "", section: "genel" });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = () => api.get("/admin/content").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const sections = ["all", ...Array.from(new Set(items.map((i) => i.section)))];
  const filtered = filter === "all" ? items : items.filter((i) => i.section === filter);

  const start = (item) => { setEditing(item.key); setForm({ ...item }); };
  const cancel = () => { setEditing(null); };
  const save = async () => {
    setSaving(true);
    try { await api.put(`/admin/content/${form.key}`, form); cancel(); load(); }
    finally { setSaving(false); }
  };
  const chE = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-8">
      <PageHeader title="Sayfa İçerikleri" subtitle={`${items.length} içerik`} />
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 text-xs font-bold border ${filter === s ? "bg-[#14284d] text-white border-[#14284d]" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
            {s === "all" ? "Tümü" : sectionLabel(s)}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {filtered.map((item) => (
          <div key={item.key} className="bg-white border border-gray-100 p-4">
            {editing === item.key ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{item.key}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5">{sectionLabel(item.section)}</span>
                </div>
                <Input label="Türkçe" value={form.value_tr} onChange={chE("value_tr")} rows={3} />
                <Input label="İngilizce" value={form.value_en} onChange={chE("value_en")} rows={3} />
                <div className="flex gap-2 mt-2">
                  <Btn red onClick={save} disabled={saving}><Save size={14} /> {saving ? "…" : "Kaydet"}</Btn>
                  <Btn outline onClick={cancel}>İptal</Btn>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{item.key}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5">{sectionLabel(item.section)}</span>
                  </div>
                  <div className="text-sm text-[#14284d] truncate">{item.value_tr || <span className="text-gray-300">—</span>}</div>
                </div>
                <button onClick={() => start(item)} className="p-2 text-gray-400 hover:text-[#14284d] flex-shrink-0"><Edit3 size={16} /></button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <EmptyState msg="Bu bölümde içerik yok." />}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ //
// Root AdminApp
// ------------------------------------------------------------------ //
const AdminApp = () => {
  const ok = useAuthCheck();
  if (!ok) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">Yükleniyor…</div>;
  }
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-auto">
        <Routes>
          <Route index element={<MessagesPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="hero-slides" element={<HeroSlidesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="counters" element={<CountersPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="career-posts" element={<CareerPostsPage />} />
          <Route path="footer" element={<FooterPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminApp;