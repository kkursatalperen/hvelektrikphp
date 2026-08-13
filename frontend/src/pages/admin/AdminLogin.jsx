import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LogIn, AlertCircle, Lock, Mail } from "lucide-react";
import api from "../../lib/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  if (localStorage.getItem("hv_admin_token")) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password }, { timeout: 25000 });
      if (data.token) localStorage.setItem("hv_admin_token", data.token);
      nav("/admin");
    } catch (err) {
      if (!err.response) {
        // Sunucuya hiç ulaşılamadı (uyuyan sunucu uyanıyor, zaman aşımı, ağ sorunu vb.)
        setError("Sunucuya ulaşılamadı. Sunucu az önce uyandıysa birkaç saniye içinde tekrar deneyin.");
      } else {
        const d = err.response?.data?.detail;
        setError(typeof d === "string" ? d : "Giriş başarısız. E-posta veya şifre hatalı.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14284d] p-6" data-testid="admin-login-page">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(227,6,19,0.6) 1px, transparent 1px)", backgroundSize: "120px 120px" }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo/hv-elektrik-logo-full.png" alt="HV Elektrik" className="h-16 w-auto mx-auto mb-3" />
          <h1 className="text-white/90 text-sm tracking-[0.3em] font-bold">ADMIN PANEL</h1>
        </div>

        <form onSubmit={submit} className="bg-white shadow-2xl p-8 space-y-5" data-testid="admin-login-form">
          <div>
            <label className="text-xs font-bold tracking-widest text-gray-500 mb-2 block">EMAIL</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 focus:border-[#E30613] pl-10 pr-4 py-3 text-sm outline-none"
                data-testid="admin-email"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest text-gray-500 mb-2 block">PASSWORD</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 focus:border-[#E30613] pl-10 pr-4 py-3 text-sm outline-none"
                data-testid="admin-password"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm" data-testid="admin-login-error">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-[#E30613] hover:bg-[#b8050f] disabled:opacity-60 text-white py-3.5 text-sm font-bold tracking-wider transition-all duration-300" data-testid="admin-login-submit">
            {loading ? "..." : <>Giriş Yap <LogIn size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
