import { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { register, login } from "./lib/api";


// ─── BRAND ────────────────────────────────────────────────────────────────────
const B = {
  green:    "#1E8A4A", greenMid: "#27B560", greenLt: "#E8F7EE",
  teal:     "#0E7E7A", tealLt:   "#E5F4F4",
  coral:    "#E05C2A", coralLt:  "#FBF0EA",
  gold:     "#B8860B", goldLt:   "#FBF5E0",
  cream:    "#F7FBF5", cream2:   "#EDF5E7",
  white:    "#FFFFFF", text:     "#162416",
  textMid:  "#4A6B50", textLt:   "#8FAA92", border:   "#D0E8D5",
};

// ─── SEO META (inyectada dinámicamente) ───────────────────────────────────────
const SEO = {
  home:     { title: "Senerva — Nutrición, Ejercicio y Técnicas de Estudio con IA", desc: "Senerva es la plataforma integral que combina nutrición cognitiva, ejercicio inteligente, recetas nootrópicas y técnicas de estudio con IA para transformar tu rendimiento." },
  platform: { title: "Plataforma IA — 5 Agentes Especializados | Senerva", desc: "Accede a NutriCoach, FitMind, ChefNeuro, MindFlow y Senerva AI. 5 agentes de inteligencia artificial especializados en salud y rendimiento cognitivo." },
  how:      { title: "Cómo Funciona Senerva — Metodología Neurocientífica", desc: "Descubre el método Senerva: 4 pasos basados en neurociencia para mejorar tu concentración, memoria y rendimiento académico." },
  pricing:  { title: "Precios y Planes — Senerva", desc: "Empieza gratis con Senerva. Planes Free, Pro y Team para individuos, estudiantes y equipos." },
  blog:     { title: "Blog — Neurociencia, Nutrición y Aprendizaje | Senerva", desc: "Artículos científicos sobre nutrición cognitiva, ejercicio y técnicas de estudio para mejorar tu rendimiento." },
  about:    { title: "Sobre Nosotros — El Equipo Senerva", desc: "Conoce al equipo de expertos en nutrición, ejercicio y neurociencia que hay detrás de Senerva." },
  privacy:  { title: "Política de Privacidad | Senerva", desc: "Información sobre el tratamiento de datos personales en Senerva conforme al RGPD y la LOPDGDD." },
  legal:    { title: "Aviso Legal | Senerva", desc: "Aviso legal de Senerva conforme a la Ley de Servicios de la Sociedad de la Información (LSSI-CE)." },
  cookies:  { title: "Política de Cookies | Senerva", desc: "Información sobre las cookies utilizadas en senerva.com conforme a la normativa de la AEPD." },
};

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo({ size = 36, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
        <rect width="52" height="52" rx="13" fill={light ? "rgba(255,255,255,0.15)" : B.green} />
        <path d="M26 14V34" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M26 18C22.5 18 20 20.5 20 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 18C29.5 18 32 20.5 32 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 24C22.5 24 20 26.5 20 29" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 24C29.5 24 32 26.5 32 29" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="23" r="2.2" fill="white" opacity="0.9" />
        <circle cx="32" cy="23" r="2.2" fill="white" opacity="0.9" />
        <circle cx="20" cy="29" r="2.2" fill="white" opacity="0.7" />
        <circle cx="32" cy="29" r="2.2" fill="white" opacity="0.7" />
        <circle cx="26" cy="14" r="2.8" fill="white" />
      </svg>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: size * 0.72, fontWeight: 700, color: light ? "#fff" : B.text, lineHeight: 1, letterSpacing: "-0.01em" }}>Senerva</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: size * 0.26, fontWeight: 600, color: light ? "rgba(255,255,255,0.6)" : B.textLt, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 1 }}>Sano · Neural · Vivo</div>
      </div>
    </div>
  );
}

// ─── COOKIE BANNER (AEPD Compliant 2024) ─────────────────────────────────────
function CookieBanner({ onAccept, onReject, onConfig }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: B.white, borderTop: `2px solid ${B.border}`,
      boxShadow: "0 -8px 32px rgba(22,36,22,0.12)",
      padding: "20px 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: 700, color: B.text, marginBottom: 6 }}>🍪 Utilizamos cookies</div>
          <p style={{ fontSize: "0.8rem", color: B.textMid, lineHeight: 1.6, margin: 0 }}>
            Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso de la web. Puedes aceptarlas, rechazarlas o configurarlas. Consulta nuestra{" "}
            <span onClick={onConfig} style={{ color: B.green, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Política de Cookies</span>.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={onConfig} style={{ padding: "9px 18px", borderRadius: 9, border: `1.5px solid ${B.border}`, background: "transparent", color: B.textMid, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
            Configurar
          </button>
          <button onClick={onReject} style={{ padding: "9px 18px", borderRadius: 9, border: `1.5px solid ${B.border}`, background: B.white, color: B.text, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
            Rechazar
          </button>
          <button onClick={onAccept} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 12px rgba(30,138,74,0.25)" }}>
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER MODAL ───────────────────────────────────────────────────────────
function RegisterModal({ onClose }) {
  const { login: authLogin } = useAuth();
  const [mode, setMode] = useState("register"); // register | login | forgot
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", goal: "", privacy: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const goals = [
    { id: "student", icon: "📚", label: "Estudiante", desc: "Mejorar rendimiento académico" },
    { id: "worker", icon: "💼", label: "Profesional", desc: "Rendir más en el trabajo" },
    { id: "athlete", icon: "🏃", label: "Deportista", desc: "Combinar físico y mente" },
    { id: "health", icon: "🌿", label: "Bienestar", desc: "Mejorar salud general" },
  ];

  const handleRegister = async () => {
    setError(""); setLoading(true);
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password, goal: form.goal });
      authLogin(data.user, data.token);
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      authLogin(data.user, data.token);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError(""); setLoading(true);
    try {
      const { forgotPassword } = await import("./lib/api");
      await forgotPassword(form.email);
      setSuccess("Si el email existe recibirás un correo en breve.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(22,36,22,0.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: B.white, borderRadius: 24, width: "100%", maxWidth: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>

        {/* Top */}
        <div style={{ background: `linear-gradient(135deg, ${B.green}, ${B.teal})`, padding: "26px 30px 22px" }}>
          <Logo size={30} light />
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>
              {mode === "register" ? (step === 1 ? "Crea tu cuenta gratis" : step === 2 ? "¿Cuál es tu objetivo?" : "¡Bienvenido!") : mode === "login" ? "Iniciar sesión" : "Recuperar contraseña"}
            </div>
            <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.68)", marginTop: 3 }}>
              {mode === "register" ? "Sin tarjeta · Acceso inmediato" : mode === "login" ? "Accede a tu cuenta Senerva" : "Te enviamos un enlace por email"}
            </div>
          </div>
          {mode === "register" && (
            <div style={{ display: "flex", gap: 5, marginTop: 18 }}>
              {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? "#fff" : "rgba(255,255,255,0.22)", transition: "all 0.3s" }} />)}
            </div>
          )}
        </div>

        <div style={{ padding: "26px 30px 30px" }}>

          {/* ERROR */}
          {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "0.8rem", marginBottom: 14 }}>{error}</div>}
          {success && <div style={{ padding: "10px 14px", borderRadius: 8, background: B.greenLt, border: `1px solid ${B.border}`, color: B.green, fontSize: "0.8rem", marginBottom: 14 }}>{success}</div>}

          {/* REGISTER STEP 1 */}
          {mode === "register" && step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[{ k: "name", l: "Nombre completo", t: "text", p: "Tu nombre" }, { k: "email", l: "Email", t: "email", p: "hola@ejemplo.com" }, { k: "password", l: "Contraseña", t: "password", p: "Mínimo 8 caracteres" }].map(f => (
                <div key={f.k}>
                  <label style={{ fontSize: "0.76rem", fontWeight: 600, color: B.textMid, display: "block", marginBottom: 5 }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${B.border}`, fontSize: "0.86rem", fontFamily: "inherit", color: B.text, outline: "none", background: B.cream, boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = B.green} onBlur={e => e.target.style.borderColor = B.border}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <input type="checkbox" id="privacy" checked={form.privacy} onChange={e => setForm(p => ({ ...p, privacy: e.target.checked }))} style={{ marginTop: 2, accentColor: B.green, cursor: "pointer" }} />
                <label htmlFor="privacy" style={{ fontSize: "0.75rem", color: B.textMid, lineHeight: 1.5, cursor: "pointer" }}>
                  He leído y acepto la <span style={{ color: B.green, fontWeight: 600 }}>Política de Privacidad</span> y los <span style={{ color: B.green, fontWeight: 600 }}>Términos de uso</span>. *
                </label>
              </div>
              <button onClick={() => { setError(""); if (form.privacy && form.name && form.email && form.password) setStep(2); else setError("Completa todos los campos y acepta la política de privacidad."); }}
                style={{ width: "100%", padding: "12px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", cursor: "pointer" }}>
                Continuar →
              </button>
              <div style={{ textAlign: "center", fontSize: "0.74rem", color: B.textLt }}>
                ¿Ya tienes cuenta? <span onClick={() => { setMode("login"); setError(""); }} style={{ color: B.green, cursor: "pointer", fontWeight: 600 }}>Iniciar sesión</span>
              </div>
            </div>
          )}

          {/* REGISTER STEP 2 */}
          {mode === "register" && step === 2 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                {goals.map(g => (
                  <div key={g.id} onClick={() => setForm(p => ({ ...p, goal: g.id }))} style={{ padding: "14px 12px", borderRadius: 12, cursor: "pointer", border: `2px solid ${form.goal === g.id ? B.green : B.border}`, background: form.goal === g.id ? B.greenLt : B.white, textAlign: "center", transition: "all 0.18s" }}>
                    <div style={{ fontSize: "1.6rem", marginBottom: 5 }}>{g.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: form.goal === g.id ? B.green : B.text }}>{g.label}</div>
                    <div style={{ fontSize: "0.68rem", color: B.textLt, marginTop: 2 }}>{g.desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { if (form.goal) handleRegister(); else setError("Selecciona un objetivo."); }}
                disabled={loading}
                style={{ width: "100%", padding: "12px", borderRadius: 9, border: "none", background: loading ? B.border : `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: loading ? B.textLt : "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Creando cuenta..." : "Crear mi cuenta gratis →"}
              </button>
            </div>
          )}

          {/* REGISTER STEP 3 */}
          {mode === "register" && step === 3 && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 14 }}>🎉</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, color: B.text, marginBottom: 8 }}>¡Bienvenido, {form.name.split(" ")[0]}!</div>
              <div style={{ fontSize: "0.83rem", color: B.textMid, lineHeight: 1.7, marginBottom: 22 }}>Hemos enviado un email de confirmación a <strong>{form.email}</strong>. Revisa tu bandeja de entrada.</div>
              <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", cursor: "pointer" }}>Acceder a la plataforma →</button>
            </div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[{ k: "email", l: "Email", t: "email", p: "tu@email.com" }, { k: "password", l: "Contraseña", t: "password", p: "Tu contraseña" }].map(f => (
                <div key={f.k}>
                  <label style={{ fontSize: "0.76rem", fontWeight: 600, color: B.textMid, display: "block", marginBottom: 5 }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${B.border}`, fontSize: "0.86rem", fontFamily: "inherit", color: B.text, outline: "none", background: B.cream, boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = B.green} onBlur={e => e.target.style.borderColor = B.border}
                  />
                </div>
              ))}
              <div style={{ textAlign: "right" }}>
                <span onClick={() => { setMode("forgot"); setError(""); }} style={{ fontSize: "0.74rem", color: B.green, cursor: "pointer", fontWeight: 600 }}>¿Olvidaste tu contraseña?</span>
              </div>
              <button onClick={handleLogin} disabled={loading}
                style={{ width: "100%", padding: "12px", borderRadius: 9, border: "none", background: loading ? B.border : `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: loading ? B.textLt : "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Entrando..." : "Iniciar sesión →"}
              </button>
              <div style={{ textAlign: "center", fontSize: "0.74rem", color: B.textLt }}>
                ¿No tienes cuenta? <span onClick={() => { setMode("register"); setError(""); setStep(1); }} style={{ color: B.green, cursor: "pointer", fontWeight: 600 }}>Registrarse gratis</span>
              </div>
            </div>
          )}

          {/* FORGOT */}
          {mode === "forgot" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={{ fontSize: "0.76rem", fontWeight: 600, color: B.textMid, display: "block", marginBottom: 5 }}>Email</label>
                <input type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${B.border}`, fontSize: "0.86rem", fontFamily: "inherit", color: B.text, outline: "none", background: B.cream, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = B.green} onBlur={e => e.target.style.borderColor = B.border}
                />
              </div>
              <button onClick={handleForgot} disabled={loading}
                style={{ width: "100%", padding: "12px", borderRadius: 9, border: "none", background: loading ? B.border : `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: loading ? B.textLt : "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Enviando..." : "Enviar enlace →"}
              </button>
              <div style={{ textAlign: "center", fontSize: "0.74rem", color: B.textLt }}>
                <span onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ color: B.green, cursor: "pointer", fontWeight: 600 }}>← Volver al login</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, onRegister, onPlatform, isAuthenticated, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [{ id: "home", l: "Inicio" }, { id: "platform", l: "Plataforma IA" }, { id: "how", l: "Cómo funciona" }, { id: "pricing", l: "Precios" }, { id: "blog", l: "Blog" }, { id: "about", l: "Nosotros" }];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(247,251,245,0.97)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? B.border : "transparent"}`, boxShadow: scrolled ? "0 2px 20px rgba(30,138,74,0.07)" : "none", transition: "all 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Logo size={32} /></button>
        <nav style={{ display: "flex", gap: 2, marginLeft: 28 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: page === l.id ? B.cream2 : "transparent", color: page === l.id ? B.green : B.textMid, fontWeight: page === l.id ? 600 : 400, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" }}
              onMouseEnter={e => { if (page !== l.id) e.target.style.background = B.cream2; }}
              onMouseLeave={e => { if (page !== l.id) e.target.style.background = "transparent"; }}
            >{l.l}</button>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", gap: 9, alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <div style={{ fontSize: "0.82rem", color: B.textMid, fontWeight: 600 }}>
                Hola, {user?.name?.split(" ")[0]} 👋
              </div>
              <button onClick={onPlatform} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
                Mi plataforma ✦
              </button>
              <button onClick={onLogout} style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${B.border}`, background: B.white, color: B.textMid, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onRegister()} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${B.border}`, background: B.white, color: B.text, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" }}
                onMouseEnter={e => { e.target.style.borderColor = B.green; e.target.style.color = B.green; }}
                onMouseLeave={e => { e.target.style.borderColor = B.border; e.target.style.color = B.text; }}
              >Iniciar sesión</button>
              <button onClick={onRegister} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(30,138,74,0.28)", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
              >Registrarse gratis ✦</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage, onRegister }) {
  const pillars = [
    { icon: "🥦", title: "NutriCoach", color: B.green, bg: B.greenLt, desc: "Planes de alimentación cognitiva personalizados con IA" },
    { icon: "🏃", title: "FitMind", color: B.coral, bg: B.coralLt, desc: "Rutinas que activan el BDNF y potencian tu cerebro" },
    { icon: "🍳", title: "ChefNeuro", color: B.gold, bg: B.goldLt, desc: "Recetas nootrópicas rápidas y deliciosas" },
    { icon: "🧠", title: "MindFlow", color: B.teal, bg: B.tealLt, desc: "Técnicas de estudio neurocientíficas integradas" },
  ];
  const stats = [{ n: "5", l: "Agentes IA" }, { n: "+40%", l: "Más concentración" }, { n: "4", l: "Pilares integrados" }, { n: "24/7", l: "Disponible" }];
  const testimonials = [
    { name: "Sara M.", role: "Estudiante de Medicina", avatar: "👩‍🎓", text: "En 3 semanas mejoré mis notas un 30%. Los planes de NutriCoach y MindFlow juntos son increíbles.", stars: 5 },
    { name: "Carlos R.", role: "Ingeniero de Software", avatar: "👨‍💻", text: "Nunca había conectado mi alimentación con mi productividad. Senerva cambió mi forma de trabajar.", stars: 5 },
    { name: "Lucía T.", role: "Opositora", avatar: "👩‍⚕️", text: "Las rutinas de FitMind antes de estudiar son un game changer. Me concentro el doble.", stars: 5 },
  ];
  return (
    <main>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "80px 24px 90px", background: B.cream }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${B.greenLt} 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 20, background: B.greenLt, border: `1.5px solid ${B.border}`, marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.green }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: B.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>Plataforma de alto rendimiento · IA</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.4rem,4.5vw,3.8rem)", fontWeight: 700, color: B.text, lineHeight: 1.08, margin: "0 0 22px" }}>
              Come bien.<br />Muévete.<br /><span style={{ color: B.green }}>Aprende mejor.</span>
            </h1>
            <p style={{ fontSize: "0.97rem", color: B.textMid, lineHeight: 1.8, marginBottom: 32, maxWidth: 460 }}>
              La primera plataforma que conecta <strong style={{ color: B.text }}>nutrición, ejercicio, recetas y técnicas de estudio</strong> en un sistema holístico de IA para transformar tu rendimiento.
            </p>
            <div style={{ display: "flex", gap: 11, marginBottom: 28, flexWrap: "wrap" }}>
              <button onClick={onRegister} style={{ padding: "13px 26px", borderRadius: 10, background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.97rem", fontFamily: "inherit", boxShadow: "0 6px 22px rgba(30,138,74,0.3)", transition: "all 0.22s" }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 28px rgba(30,138,74,0.4)"; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 6px 22px rgba(30,138,74,0.3)"; }}
              >Empezar gratis — es rápido ✦</button>
              <button onClick={() => setPage("how")} style={{ padding: "13px 22px", borderRadius: 10, background: B.white, color: B.text, border: `1.5px solid ${B.border}`, cursor: "pointer", fontWeight: 600, fontSize: "0.97rem", fontFamily: "inherit", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = B.green; e.currentTarget.style.color = B.green; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.color = B.text; }}
              >Ver cómo funciona</button>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Sin tarjeta de crédito", "Acceso inmediato", "5 agentes IA gratis"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: B.textMid }}>
                  <span style={{ color: B.green, fontWeight: 700 }}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
            {pillars.map((p, i) => (
              <div key={i} onClick={() => setPage("platform")} style={{ padding: "20px 16px", borderRadius: 16, background: p.bg, border: `1.5px solid ${p.color}20`, cursor: "pointer", transition: "all 0.25s", animation: `floatY ${3.5 + i * 0.6}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 28px ${p.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: "1.9rem", marginBottom: 7 }}>{p.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.95rem", fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.title}</div>
                <div style={{ fontSize: "0.72rem", color: B.textMid, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: `linear-gradient(135deg, ${B.green}, ${B.teal})`, padding: "28px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center", gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.3rem", fontWeight: 700, color: "#fff" }}>{s.n}</div>
              <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section style={{ padding: "72px 24px", background: B.cream2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: B.green, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 9 }}>Testimonios</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.1rem", fontWeight: 700, color: B.text, margin: 0 }}>Lo que dicen nuestros usuarios</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ padding: "26px 22px", borderRadius: 18, background: B.white, border: `1.5px solid ${B.border}` }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>{Array(t.stars).fill("★").map((s, j) => <span key={j} style={{ color: B.gold, fontSize: "0.95rem" }}>{s}</span>)}</div>
                <p style={{ fontSize: "0.86rem", color: B.textMid, lineHeight: 1.75, margin: "0 0 18px", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: B.greenLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.86rem", color: B.text }}>{t.name}</div>
                    <div style={{ fontSize: "0.72rem", color: B.textLt }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg, ${B.green}, ${B.teal})`, borderRadius: 26, padding: "64px 52px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.2 }}>Tu cerebro también tiene hambre.</div>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "0.96rem", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>Únete a miles de personas que ya rinden al máximo con Senerva. Empieza hoy, gratis.</p>
              <button onClick={onRegister} style={{ padding: "14px 36px", borderRadius: 11, background: "#fff", color: B.green, border: "none", cursor: "pointer", fontWeight: 800, fontSize: "1rem", fontFamily: "'Cormorant Garamond',serif", boxShadow: "0 8px 26px rgba(0,0,0,0.16)", transition: "all 0.22s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              >Registrarme gratis ahora →</button>
              <div style={{ marginTop: 14, fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Sin tarjeta · Sin compromiso · Cancela cuando quieras</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── PLATFORM PAGE ────────────────────────────────────────────────────────────
const AGENTS = [
  { id: "master", icon: "✦", name: "Senerva AI", label: "Plan Maestro", color: B.green, bg: B.cream2, desc: "Planes holísticos que integran nutrición, ejercicio, recetas y estudio.", prompts: ["Plan semanal completo para estudiante universitario", "Protocolo de alto rendimiento de 30 días", "Mi rutina diaria ideal integrando todo", "Cómo transformar mi rendimiento en 4 semanas"], system: `Eres Senerva AI, el agente maestro de la plataforma Senerva. Hablas en español con autoridad y motivación. Creas PLANES MAESTROS que combinan 🥦 nutrición cognitiva, 🏃 ejercicio para el cerebro, 🍳 recetas nootrópicas y 🧠 técnicas de estudio. Siempre das horarios detallados, explicas la sinergia entre elementos, usas ciencia (BDNF, neuroplasticidad, cortisol) y eres motivador. Formato estructurado con secciones y emojis.` },
  { id: "nutri", icon: "🥦", name: "NutriCoach", label: "Nutrición", color: B.green, bg: B.greenLt, desc: "Planes de alimentación cognitiva personalizados.", prompts: ["Plan semanal para estudiar mejor", "Qué comer antes de un examen", "Desayuno energético rápido", "10 alimentos que mejoran la memoria"], system: `Eres NutriCoach de Senerva. Experto en nutrición cognitiva. Hablas en español con calidez. Das planes nutricionales con alimentos, cantidades y horarios. Explicas cómo cada nutriente impacta en el cerebro (omega-3, antioxidantes, glucemia, neuroprotectores). Usas ingredientes accesibles en España. Formato claro con secciones y emojis.` },
  { id: "fit", icon: "🏃", name: "FitMind", label: "Ejercicio", color: B.coral, bg: B.coralLt, desc: "Rutinas que activan el BDNF y potencian tu cerebro.", prompts: ["Rutina de 15 min antes de estudiar", "Ejercicios para activar el cerebro", "Plan semanal para estudiante", "Cómo el ejercicio mejora el estudio"], system: `Eres FitMind de Senerva. Coach de entrenamiento especializado en la conexión cerebro-cuerpo. Hablas en español con energía. Diseñas rutinas de 10-60 min. Explicas cómo el ejercicio aumenta el BDNF, mejora memoria y concentración. Das alternativas para casa, gym o exterior. Especificas series, repeticiones y descansos. Formato estructurado con emojis.` },
  { id: "chef", icon: "🍳", name: "ChefNeuro", label: "Recetas", color: B.gold, bg: B.goldLt, desc: "Recetas nootrópicas rápidas y deliciosas.", prompts: ["Receta anti-fatiga mental en 10 min", "Smoothie nootrópico para estudiar", "Snacks saludables para estudiar", "Meal prep semanal para estudiantes"], system: `Eres ChefNeuro de Senerva. Chef en gastronomía nootrópica. Hablas en español con entusiasmo. Creas recetas de 5-20 min con ingredientes accesibles en España. Incluyes: nombre, tiempo, dificultad, ingredientes exactos, pasos numerados. Explicas qué nutrientes nootrópicos tiene cada receta. Formato visual con emojis.` },
  { id: "mind", icon: "🧠", name: "MindFlow", label: "Estudios", color: B.teal, bg: B.tealLt, desc: "Técnicas neurocientíficas integradas con tu plan.", prompts: ["Plan de estudio para examen en 7 días", "Técnicas para memorizar más rápido", "Protocolo 4 horas sin cansancio", "Optimizar horario de estudio"], system: `Eres MindFlow de Senerva. Experto en neurociencia del aprendizaje. Hablas en español con claridad. Usas: Pomodoro, repetición espaciada, retrieval practice, interleaving. Integras nutrición y ejercicio en el plan. Explicas el ritmo circadiano. Creas horarios detallados. Usas ciencia (BDNF, cortisol, neuroplasticidad). Formato de plan estructurado.` },
];

function PlatformPage({ onRegister }) {
  const [active, setActive] = useState("master");
  const [convos, setConvos] = useState(Object.fromEntries(AGENTS.map(a => [a.id, []])));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convos, active]);
  const agent = AGENTS.find(a => a.id === active);
  const convo = convos[active];

  const send = async (text) => {
    const msg = (text || input).trim(); if (!msg || loading) return;
    const userMsg = { role: "user", content: msg };
    setConvos(p => ({ ...p, [active]: [...p[active], userMsg] }));
    setInput(""); setLoading(true);
    try {
      const history = [...convos[active], userMsg];
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: agent.system, messages: history }) });
      const data = await res.json();
      setConvos(p => ({ ...p, [active]: [...p[active], { role: "assistant", content: data.content?.[0]?.text || "Error." }] }));
    } catch { setConvos(p => ({ ...p, [active]: [...p[active], { role: "assistant", content: "❌ Error de conexión." }] })); }
    finally { setLoading(false); }
  };

  const fmt = (t) => t
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^## (.+)$/gm, `<div style="font-size:.98rem;font-weight:800;color:${agent.color};margin:13px 0 6px;font-family:'Cormorant Garamond',serif">$1</div>`)
    .replace(/^### (.+)$/gm, `<div style="font-size:.88rem;font-weight:700;color:${B.text};margin:10px 0 4px">$1</div>`)
    .replace(/^[-•] (.+)$/gm, `<div style="display:flex;gap:7px;margin:3px 0"><span style="color:${agent.color};font-weight:700;flex-shrink:0">·</span><span>$1</span></div>`)
    .replace(/^(\d+)\. (.+)$/gm, `<div style="display:flex;gap:7px;margin:4px 0"><span style="font-weight:800;color:${agent.color};min-width:18px;flex-shrink:0">$1.</span><span>$2</span></div>`)
    .replace(/\n\n/g, `<div style="height:8px"></div>`).replace(/\n/g, "<br/>");

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", overflow: "hidden" }}>
      <aside style={{ width: 230, flexShrink: 0, borderRight: `1.5px solid ${B.border}`, background: B.white, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "16px 13px 10px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: B.textLt, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 11 }}>Agentes IA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {AGENTS.map(ag => (
              <button key={ag.id} onClick={() => setActive(ag.id)} style={{ padding: "11px 12px", borderRadius: 10, border: `1.5px solid ${active === ag.id ? ag.color : B.border}`, background: active === ag.id ? ag.bg : "transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.18s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.15rem" }}>{ag.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.81rem", fontWeight: 700, color: active === ag.id ? ag.color : B.text }}>{ag.name}</div>
                    <div style={{ fontSize: "0.66rem", color: B.textLt }}>{ag.label}</div>
                  </div>
                  {convos[ag.id].length > 0 && <div style={{ fontSize: "0.6rem", fontWeight: 700, color: ag.color, background: `${ag.color}15`, padding: "2px 6px", borderRadius: 8 }}>{Math.floor(convos[ag.id].length / 2)}</div>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "auto", padding: "13px", borderTop: `1px solid ${B.border}` }}>
          <button onClick={onRegister} style={{ width: "100%", padding: "9px", borderRadius: 8, background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", border: "none", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>✦ Cuenta gratis →</button>
          <div style={{ fontSize: "0.64rem", color: B.textLt, textAlign: "center", marginTop: 7 }}>Senerva · IA Platform</div>
        </div>
      </aside>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: B.cream }}>
        <div style={{ padding: "13px 20px", borderBottom: `1.5px solid ${B.border}`, background: B.white, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: agent.bg, border: `1.5px solid ${agent.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>{agent.icon}</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: 700, color: agent.color }}>{agent.name}</div>
            <div style={{ fontSize: "0.7rem", color: B.textLt }}>{agent.desc}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
            <span style={{ fontSize: "0.68rem", color: B.textLt }}>Online</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 15 }}>
          {convo.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 20 }}>
              <div style={{ fontSize: "3rem" }}>{agent.icon}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, color: B.text, marginBottom: 6 }}>Hola, soy {agent.name}</div>
                <div style={{ fontSize: "0.84rem", color: B.textMid, maxWidth: 380, lineHeight: 1.7 }}>{agent.desc}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, maxWidth: 480, width: "100%" }}>
                {agent.prompts.map((p, i) => (
                  <button key={i} onClick={() => send(p)} style={{ padding: "10px 13px", borderRadius: 10, background: B.white, border: `1.5px solid ${B.border}`, color: B.textMid, fontSize: "0.76rem", cursor: "pointer", textAlign: "left", lineHeight: 1.4, fontFamily: "inherit", transition: "all 0.18s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = agent.color; e.currentTarget.style.color = agent.color; e.currentTarget.style.background = agent.bg; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.color = B.textMid; e.currentTarget.style.background = B.white; }}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}
          {convo.map((msg, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
              {msg.role === "assistant" && <div style={{ width: 30, height: 30, borderRadius: 8, background: agent.bg, border: `1.5px solid ${agent.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0, marginTop: 2 }}>{agent.icon}</div>}
              <div style={{ maxWidth: "70%", padding: msg.role === "user" ? "9px 14px" : "12px 16px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px", background: msg.role === "user" ? `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)` : B.white, border: msg.role === "user" ? "none" : `1.5px solid ${B.border}`, color: msg.role === "user" ? "#fff" : B.text, fontSize: "0.83rem", lineHeight: 1.7, boxShadow: msg.role === "user" ? `0 3px 12px ${agent.color}25` : "0 2px 8px rgba(0,0,0,0.04)" }} dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
              {msg.role === "user" && <div style={{ width: 30, height: 30, borderRadius: 8, background: B.cream2, border: `1.5px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0, marginTop: 2 }}>👤</div>}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: agent.bg, border: `1.5px solid ${agent.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem" }}>{agent.icon}</div>
              <div style={{ padding: "12px 16px", borderRadius: "4px 14px 14px 14px", background: B.white, border: `1.5px solid ${B.border}`, display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: agent.color, animation: "dotPulse 1.3s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {convo.length > 0 && (
          <div style={{ padding: "5px 20px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {agent.prompts.slice(0, 3).map((p, i) => (
              <button key={i} onClick={() => send(p)} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${B.border}`, background: B.white, color: B.textLt, fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.18s" }}
                onMouseEnter={e => { e.target.style.borderColor = agent.color; e.target.style.color = agent.color; }}
                onMouseLeave={e => { e.target.style.borderColor = B.border; e.target.style.color = B.textLt; }}
              >{p}</button>
            ))}
          </div>
        )}
        <div style={{ padding: "11px 20px 16px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: B.white, borderRadius: 12, border: `1.5px solid ${B.border}`, padding: "7px 9px" }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={`Pregunta a ${agent.name}...`} rows={2}
              style={{ flex: 1, border: "none", background: "transparent", color: B.text, fontSize: "0.84rem", resize: "none", fontFamily: "inherit", lineHeight: 1.5, outline: "none" }} />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: loading || !input.trim() ? B.border : `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)`, color: loading || !input.trim() ? B.textLt : "#fff", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "1rem", flexShrink: 0, transition: "all 0.18s" }}>→</button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────
function BlogPage() {
  const [selected, setSelected] = useState(null);
  const posts = [
    {
      cat: "Nutrición", color: B.green, bg: B.greenLt, icon: "🥦",
      title: "Los 10 alimentos que más mejoran la memoria según la neurociencia",
      excerpt: "Descubre qué alimentos activan el hipocampo y mejoran tu concentración de forma comprobada.",
      time: "6 min", date: "12 Mar 2025",
      slug: "alimentos-memoria-neurociencia",
      content: `
## Los 10 alimentos que más mejoran la memoria según la neurociencia

La ciencia del aprendizaje ha demostrado que lo que comes impacta directamente en la capacidad de tu cerebro para formar, retener y recuperar recuerdos. Estos son los 10 alimentos más respaldados por la investigación.

### 1. Nueces — La forma del cerebro no es casualidad
Las nueces tienen más omega-3 que casi cualquier otro fruto seco. Un estudio de la Universidad de California demostró que consumir un puñado al día mejora la memoria de trabajo en adultos jóvenes. Contienen además vitamina E, un potente antioxidante que protege las neuronas del daño oxidativo.

**Cómo incluirlas:** Un puñado (30g) a media mañana o antes de estudiar.

### 2. Arándanos — Antioxidantes que llegan al cerebro
Los flavonoides de los arándanos cruzan la barrera hematoencefálica y se acumulan en el hipocampo, la región cerebral responsable del aprendizaje y la memoria. Estudios del Tufts University confirman mejoras en la memoria espacial.

**Cómo incluirlos:** En el desayuno con avena o en un smoothie pre-estudio.

### 3. Salmón y pescado azul — Omega-3 estructural
El DHA (ácido docosahexaenoico) es literalmente el material con el que están hechas las membranas neuronales. Sin suficiente DHA en la dieta, la transmisión entre neuronas se vuelve menos eficiente. El salmón, la caballa y las sardinas son las mejores fuentes.

**Objetivo:** 2-3 raciones semanales de 150g.

### 4. Aguacate — Grasas saludables para el flujo sanguíneo cerebral
El aguacate mejora el flujo sanguíneo cerebral gracias a sus grasas monoinsaturadas. Un mejor riego sanguíneo significa más oxígeno y glucosa disponible para las neuronas durante el estudio.

### 5. Cúrcuma — El antiinflamatorio cerebral más potente
La curcumina, principio activo de la cúrcuma, atraviesa la barrera hematoencefálica y tiene efectos antiinflamatorios directos sobre el cerebro. Aumenta el BDNF (Factor Neurotrófico Derivado del Cerebro), la proteína responsable de la creación de nuevas neuronas.

**Truco:** Siempre combinarla con pimienta negra para aumentar la biodisponibilidad un 2.000%.

### 6. Huevos — Colina para la acetilcolina
La colina de los huevos es precursora de la acetilcolina, el neurotransmisor clave en la memoria y el aprendizaje. Dos huevos al día aportan el 50% de los requerimientos diarios de colina.

### 7. Té verde — L-teanina + cafeína: la combinación perfecta
A diferencia del café solo, el té verde combina cafeína con L-teanina, un aminoácido que produce un estado de "alerta relajada" — perfecta para estudiar. Mejora el tiempo de reacción, la memoria y la función cognitiva sin los picos de ansiedad del café.

### 8. Brócoli y vegetales crucíferos — Vitamina K para el cerebro
El brócoli contiene vitamina K en altas concentraciones, esencial para la formación de esfingolípidos, un tipo de grasa que está densamente empaquetada en las células cerebrales. También contiene glucosinolatos que protegen las neuronas del envejecimiento.

### 9. Semillas de calabaza — Zinc, hierro y magnesio
El zinc regula la comunicación nerviosa. El hierro lleva oxígeno al cerebro. El magnesio facilita el aprendizaje. Las semillas de calabaza son una de las pocas fuentes que concentran los tres minerales más importantes para la función cognitiva.

### 10. Chocolate negro (+70% cacao) — Flavonoides y flujo sanguíneo
El cacao puro mejora el flujo sanguíneo cerebral en un 8% según estudios de Oxford. Sus flavonoides también estimulan la plasticidad sináptica, facilitando la formación de nuevas conexiones neuronales.

---

## El plan de acción de Senerva

No necesitas comer los 10 cada día. Con una estrategia de rotación semanal y usando los agentes de Senerva para crear tu plan personalizado, puedes incorporar todos estos alimentos de forma natural y deliciosa.

**Pide a NutriCoach que te diseñe un plan semanal con estos ingredientes →**
      `
    },
    { cat: "Ejercicio", color: B.coral, bg: B.coralLt, icon: "🏃", title: "Por qué 20 minutos de ejercicio duplican tu capacidad de estudio", excerpt: "La ciencia detrás del BDNF y cómo una rutina matinal transforma tu rendimiento cognitivo.", time: "5 min", date: "8 Mar 2025", slug: "ejercicio-bdnf-estudio", content: "Próximamente..." },
    { cat: "Recetas", color: B.gold, bg: B.goldLt, icon: "🍳", title: "5 smoothies nootrópicos para preparar en menos de 5 minutos", excerpt: "Recetas ricas en omega-3, antioxidantes y neuroprotectores para antes de estudiar.", time: "4 min", date: "5 Mar 2025", slug: "smoothies-nootropicos", content: "Próximamente..." },
    { cat: "Estudios", color: B.teal, bg: B.tealLt, icon: "🧠", title: "Retrieval practice: la técnica de estudio más poderosa que nadie usa", excerpt: "Por qué releer apuntes es lo menos eficiente y qué técnica la reemplaza con resultados 3x mejores.", time: "7 min", date: "1 Mar 2025", slug: "retrieval-practice-tecnica-estudio", content: "Próximamente..." },
  ];

  if (selected) {
    const post = posts.find(p => p.slug === selected);
    return (
      <main style={{ padding: "52px 24px", maxWidth: 760, margin: "0 auto" }}>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: B.green, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", fontFamily: "inherit", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>← Volver al blog</button>
        <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 8, background: post.bg, fontSize: "0.72rem", fontWeight: 700, color: post.color, marginBottom: 16 }}>{post.cat}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: B.text, margin: "0 0 12px", lineHeight: 1.2 }}>{post.title}</h1>
        <div style={{ display: "flex", gap: 16, fontSize: "0.78rem", color: B.textLt, marginBottom: 36 }}>
          <span>{post.date}</span><span>·</span><span>{post.time} lectura</span>
        </div>
        <div style={{ fontSize: "0.92rem", color: B.textMid, lineHeight: 1.85 }}
          dangerouslySetInnerHTML={{ __html: post.content
            .replace(/^## (.+)$/gm, `<h2 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:${B.text};margin:36px 0 14px">$1</h2>`)
            .replace(/^### (.+)$/gm, `<h3 style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:${post.color};margin:24px 0 8px">$1</h3>`)
            .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${B.text}">$1</strong>`)
            .replace(/\n\n/g, '<br/><br/>')
          }}
        />
      </main>
    );
  }

  return (
    <main style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: B.green, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Blog Senerva</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.4rem", fontWeight: 700, color: B.text, margin: "0 0 12px" }}>Ciencia aplicada a tu vida</h1>
        <p style={{ color: B.textMid, fontSize: "0.92rem", maxWidth: 480, margin: "0 auto" }}>Artículos semanales sobre nutrición cognitiva, ejercicio y técnicas de aprendizaje.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
        {posts.map((p, i) => (
          <div key={i} onClick={() => setSelected(p.slug)} style={{ borderRadius: 18, overflow: "hidden", border: `1.5px solid ${B.border}`, background: B.white, cursor: "pointer", transition: "all 0.22s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 28px ${p.color}12`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ padding: "36px 32px", background: p.bg, display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ fontSize: "2.8rem" }}>{p.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 700, color: p.color, lineHeight: 1.25 }}>{p.title}</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 7, background: p.bg, fontSize: "0.68rem", fontWeight: 700, color: p.color, marginBottom: 10 }}>{p.cat}</div>
              <p style={{ fontSize: "0.84rem", color: B.textMid, lineHeight: 1.7, margin: "0 0 14px" }}>{p.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.73rem", color: B.textLt }}>
                <span>{p.date}</span><span style={{ color: p.color, fontWeight: 600 }}>Leer artículo →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── RECIPES PAGE (dentro de Blog) ───────────────────────────────────────────
function RecipePage() {
  const recipe = {
    name: "Smoothie Nootrópico del Estudiante",
    time: "5 min", difficulty: "Muy fácil", servings: "1 persona",
    icon: "🥤", color: B.green,
    tags: ["Pre-estudio", "Desayuno", "Sin gluten", "Vegano"],
    ingredients: [
      "1 plátano maduro congelado",
      "1 puñado de espinacas baby (30g)",
      "1 cucharada de semillas de chía",
      "1 cucharadita de cúrcuma en polvo",
      "1 pizca de pimienta negra",
      "200ml de leche de avena",
      "1 cucharada de mantequilla de almendras",
      "5-6 arándanos frescos o congelados",
      "1 cucharadita de miel (opcional)",
    ],
    steps: [
      { n: 1, text: "Coloca todos los ingredientes en la batidora en este orden: líquidos primero, luego sólidos." },
      { n: 2, text: "Tritura a velocidad alta durante 60 segundos hasta obtener una textura completamente lisa." },
      { n: 3, text: "Si queda demasiado espeso, añade un poco más de leche de avena y bate 10 segundos más." },
      { n: 4, text: "Sirve inmediatamente en un vaso alto. Decora con unos arándanos y una pizca de cúrcuma." },
    ],
    nutrients: [
      { name: "Omega-3", value: "2.4g", benefit: "Membranas neuronales" },
      { name: "Antioxidantes", value: "Alto", benefit: "Protección neuronal" },
      { name: "Curcumina", value: "200mg", benefit: "Aumenta BDNF" },
      { name: "Proteína", value: "8g", benefit: "Neurotransmisores" },
    ],
    why: "Este smoothie combina los ingredientes más estudiados para la mejora cognitiva. La cúrcuma con pimienta negra aumenta la biodisponibilidad de la curcumina un 2.000%. Los arándanos aportan flavonoides que mejoran el flujo sanguíneo cerebral. Las semillas de chía son ricas en omega-3 esencial para la plasticidad sináptica.",
  };

  return (
    <main style={{ padding: "52px 24px", maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 8, background: B.greenLt, fontSize: "0.72rem", fontWeight: 700, color: B.green, marginBottom: 18 }}>Receta Nootrópica</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: B.text, margin: "0 0 8px", lineHeight: 1.2 }}>{recipe.name}</h1>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        {[`⏱ ${recipe.time}`, `👨‍🍳 ${recipe.difficulty}`, `🍽 ${recipe.servings}`].map((t, i) => (
          <span key={i} style={{ fontSize: "0.8rem", color: B.textMid, background: B.cream2, padding: "4px 12px", borderRadius: 8, border: `1px solid ${B.border}` }}>{t}</span>
        ))}
        {recipe.tags.map((t, i) => <span key={i} style={{ fontSize: "0.75rem", color: B.green, background: B.greenLt, padding: "4px 12px", borderRadius: 8, fontWeight: 600 }}>{t}</span>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 32 }}>
        <div style={{ padding: "24px", borderRadius: 16, background: B.white, border: `1.5px solid ${B.border}` }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 700, color: B.text, marginBottom: 16 }}>🧾 Ingredientes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: "0.84rem", color: B.textMid }}>
                <span style={{ color: B.green, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>·</span>{ing}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "24px", borderRadius: 16, background: B.white, border: `1.5px solid ${B.border}` }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 700, color: B.text, marginBottom: 16 }}>📋 Preparación</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {recipe.steps.map(s => (
              <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", fontWeight: 800, fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{s.n}</div>
                <div style={{ fontSize: "0.84rem", color: B.textMid, lineHeight: 1.6 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "22px 24px", borderRadius: 16, background: B.greenLt, border: `1.5px solid ${B.border}`, marginBottom: 22 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 700, color: B.green, marginBottom: 14 }}>🔬 Perfil nootrópico</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {recipe.nutrients.map((n, i) => (
            <div key={i} style={{ padding: "12px", borderRadius: 10, background: B.white, border: `1px solid ${B.border}`, textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: B.green }}>{n.value}</div>
              <div style={{ fontSize: "0.76rem", fontWeight: 600, color: B.text, marginTop: 2 }}>{n.name}</div>
              <div style={{ fontSize: "0.68rem", color: B.textLt, marginTop: 3 }}>{n.benefit}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px", borderRadius: 14, background: B.white, border: `1.5px solid ${B.border}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: 700, color: B.text, marginBottom: 10 }}>🧠 ¿Por qué funciona?</div>
        <p style={{ fontSize: "0.85rem", color: B.textMid, lineHeight: 1.75, margin: 0 }}>{recipe.why}</p>
      </div>
    </main>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ onRegister }) {
  const team = [
    { icon: "👨‍⚕️", name: "Dr. Alejandro Torres", role: "CEO & Nutricionista Cognitivo", spec: "20 años en neurociencia nutricional. Ex-investigador Universidad Complutense de Madrid.", linkedin: "#", twitter: "#" },
    { icon: "🏋️", name: "Elena Martínez", role: "CTO & Coach de Rendimiento", spec: "Especialista en BDNF y neuroplasticidad. Entrenadora de atletas olímpicos durante 12 años.", linkedin: "#", twitter: "#" },
    { icon: "🧑‍🍳", name: "Marcos Ruiz", role: "Director Gastronómico", spec: "Pionero en gastronomía nootrópica. Autor del libro 'Cocina para tu cerebro' (Ed. Planeta, 2023).", linkedin: "#", twitter: "#" },
    { icon: "🧬", name: "Dra. Sofía Navarro", role: "Directora Científica", spec: "PhD Neurociencia Cognitiva (UAM). Investigadora en técnicas de aprendizaje acelerado.", linkedin: "#", twitter: "#" },
  ];
  return (
    <main style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: B.green, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Sobre nosotros</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.4rem", fontWeight: 700, color: B.text, margin: "0 0 16px" }}>La historia detrás de Senerva</h1>
        <p style={{ color: B.textMid, fontSize: "0.93rem", maxWidth: 580, margin: "0 auto", lineHeight: 1.8 }}>Senerva nació de una pregunta simple: ¿por qué nadie conecta la alimentación, el ejercicio y el estudio en un sistema coherente? Tras años de investigación, creamos la plataforma que nos hubiera gustado tener.</p>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${B.green}, ${B.teal})`, borderRadius: 22, padding: "48px", marginBottom: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>Nuestra misión</div>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.92rem", lineHeight: 1.8, marginBottom: 24 }}>Democratizar el acceso al alto rendimiento cognitivo. Que cualquier estudiante, profesional o deportista pueda beneficiarse de la misma ciencia que usan los atletas de élite.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {[["2024", "Fundación"], ["+5K", "Beta users"], ["4.9★", "Valoración"]].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.7rem", fontWeight: 700, color: "#fff" }}>{s[0]}</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "🔬", title: "Basado en ciencia", desc: "Sin mitos. Solo evidencia publicada." },
            { icon: "🎯", title: "Para todos", desc: "Con ingredientes y tiempo reales." },
            { icon: "🤝", title: "Integral", desc: "Los 4 pilares conectados." },
            { icon: "📈", title: "Medible", desc: "Resultados concretos en 7 días." },
          ].map((v, i) => (
            <div key={i} style={{ padding: "18px 16px", borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: 7 }}>{v.icon}</div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.82rem", marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: B.green, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 9 }}>El equipo</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.9rem", fontWeight: 700, color: B.text, margin: 0 }}>Los expertos detrás de Senerva</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {team.map((t, i) => (
            <div key={i} style={{ padding: "26px 20px", borderRadius: 18, background: B.white, border: `1.5px solid ${B.border}`, textAlign: "center", transition: "all 0.22s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 28px rgba(30,138,74,0.1)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 60, height: 60, borderRadius: 16, background: B.greenLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.9rem", margin: "0 auto 14px" }}>{t.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: B.text, fontSize: "0.97rem", marginBottom: 3, lineHeight: 1.2 }}>{t.name}</div>
              <div style={{ fontSize: "0.73rem", fontWeight: 600, color: B.green, marginBottom: 10 }}>{t.role}</div>
              <div style={{ fontSize: "0.74rem", color: B.textLt, lineHeight: 1.55, marginBottom: 14 }}>{t.spec}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <a href={t.linkedin} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${B.border}`, fontSize: "0.7rem", color: B.textMid, textDecoration: "none", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.target.style.borderColor = B.green; e.target.style.color = B.green; }}
                  onMouseLeave={e => { e.target.style.borderColor = B.border; e.target.style.color = B.textMid; }}
                >LinkedIn</a>
                <a href={t.twitter} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${B.border}`, fontSize: "0.7rem", color: B.textMid, textDecoration: "none", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.target.style.borderColor = B.green; e.target.style.color = B.green; }}
                  onMouseLeave={e => { e.target.style.borderColor = B.border; e.target.style.color = B.textMid; }}
                >Twitter / X</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT FORM */}
      <div style={{ background: B.cream2, borderRadius: 22, padding: "44px", border: `1.5px solid ${B.border}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 700, color: B.text, marginBottom: 8 }}>¿Quieres contactarnos?</div>
        <p style={{ color: B.textMid, fontSize: "0.86rem", marginBottom: 26, lineHeight: 1.7 }}>Escríbenos a <strong>hola@senerva.com</strong> o usa este formulario. Te respondemos en menos de 24 horas.</p>
        <ContactForm />
      </div>
    </main>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", privacy: false });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message || !form.privacy) return;
    setSent(true);
  };
  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ fontSize: "3rem", marginBottom: 12 }}>✉️</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, color: B.text, marginBottom: 8 }}>¡Mensaje enviado!</div>
      <div style={{ fontSize: "0.84rem", color: B.textMid }}>Te respondemos en menos de 24 horas en <strong>{form.email}</strong></div>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {[{ k: "name", l: "Nombre", t: "text", p: "Tu nombre", full: false }, { k: "email", l: "Email", t: "email", p: "tu@email.com", full: false }, { k: "subject", l: "Asunto", t: "text", p: "¿En qué podemos ayudarte?", full: true }].map(f => (
        <div key={f.k} style={{ gridColumn: f.full ? "span 2" : "span 1" }}>
          <label style={{ fontSize: "0.76rem", fontWeight: 600, color: B.textMid, display: "block", marginBottom: 5 }}>{f.l}</label>
          <input type={f.t} placeholder={f.p} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
            style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${B.border}`, fontSize: "0.85rem", fontFamily: "inherit", color: B.text, outline: "none", background: B.white, boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = B.green} onBlur={e => e.target.style.borderColor = B.border}
          />
        </div>
      ))}
      <div style={{ gridColumn: "span 2" }}>
        <label style={{ fontSize: "0.76rem", fontWeight: 600, color: B.textMid, display: "block", marginBottom: 5 }}>Mensaje</label>
        <textarea placeholder="Escribe tu mensaje aquí..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4}
          style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${B.border}`, fontSize: "0.85rem", fontFamily: "inherit", color: B.text, outline: "none", background: B.white, resize: "vertical", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = B.green} onBlur={e => e.target.style.borderColor = B.border}
        />
      </div>
      <div style={{ gridColumn: "span 2", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <input type="checkbox" id="contactPrivacy" checked={form.privacy} onChange={e => setForm(p => ({ ...p, privacy: e.target.checked }))} style={{ marginTop: 2, accentColor: B.green, cursor: "pointer" }} />
        <label htmlFor="contactPrivacy" style={{ fontSize: "0.74rem", color: B.textMid, lineHeight: 1.5, cursor: "pointer" }}>
          He leído y acepto la <span style={{ color: B.green, fontWeight: 600 }}>Política de Privacidad</span>. Consiento el tratamiento de mis datos para atender mi consulta. *
        </label>
      </div>
      <div style={{ gridColumn: "span 2" }}>
        <button onClick={handleSubmit} style={{ padding: "11px 28px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 3px 12px rgba(30,138,74,0.22)" }}>Enviar mensaje →</button>
      </div>
    </div>
  );
}

// ─── LEGAL PAGES ─────────────────────────────────────────────────────────────
function LegalPage({ type, setPage }) {
  const sections = {
    privacy: {
      title: "Política de Privacidad",
      lastUpdate: "Marzo 2025",
      content: [
        { h: "1. Responsable del Tratamiento", t: `En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), te informamos que el responsable del tratamiento de tus datos personales es:\n\n**Senerva** · hola@senerva.com · senerva.com\n\nDomicilio social: España` },
        { h: "2. Datos que Recogemos", t: `Recogemos los siguientes datos personales:\n\n· **Registro:** Nombre, dirección de email y contraseña cifrada.\n· **Perfil:** Objetivo de uso (estudiante, profesional, deportista, bienestar).\n· **Contacto:** Datos que nos facilitas a través del formulario de contacto.\n· **Uso:** Datos de navegación y uso de la plataforma (cookies técnicas).\n\nNO recogemos datos especialmente sensibles (salud, datos bancarios directamente) sin tu consentimiento explícito.` },
        { h: "3. Finalidad y Base Legal", t: `Tratamos tus datos para:\n\n· **Gestionar tu cuenta y acceso** a la plataforma (base: ejecución de contrato).\n· **Personalizar los planes de los agentes IA** según tu objetivo (base: ejecución de contrato).\n· **Enviarte comunicaciones de servicio** sobre tu cuenta (base: ejecución de contrato).\n· **Enviarte newsletter** sobre contenidos de la plataforma, solo si das tu consentimiento explícito (base: consentimiento).\n· **Análisis de uso** para mejorar la plataforma (base: interés legítimo).` },
        { h: "4. Conservación de Datos", t: `Conservamos tus datos mientras mantengas una cuenta activa en Senerva. Si eliminas tu cuenta, procederemos a la supresión de tus datos en un plazo máximo de 30 días, salvo obligación legal de conservación.` },
        { h: "5. Cesión de Datos a Terceros", t: `No cedemos tus datos a terceros para fines comerciales. Únicamente los compartimos con:\n\n· **Anthropic (Claude AI):** Para procesar las consultas a los agentes IA. Los datos enviados a la IA se tratan conforme a la política de privacidad de Anthropic.\n· **Proveedores de hosting:** El servidor VPS donde se aloja la plataforma.\n\nTodos los proveedores cuentan con garantías adecuadas de protección de datos.` },
        { h: "6. Tus Derechos", t: `Tienes derecho a:\n\n· **Acceder** a tus datos personales.\n· **Rectificar** datos inexactos.\n· **Suprimir** tus datos ("derecho al olvido").\n· **Limitar** el tratamiento de tus datos.\n· **Portabilidad** de tus datos.\n· **Oponerte** al tratamiento en determinadas circunstancias.\n\nPuedes ejercer estos derechos enviando un email a **hola@senerva.com** con el asunto "Derechos RGPD". También puedes presentar una reclamación ante la **Agencia Española de Protección de Datos (AEPD)** en www.aepd.es.` },
        { h: "7. Seguridad", t: `Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos: cifrado HTTPS, contraseñas cifradas con hash, acceso restringido a datos personales y copias de seguridad periódicas.` },
      ]
    },
    legal: {
      title: "Aviso Legal",
      lastUpdate: "Marzo 2025",
      content: [
        { h: "1. Identificación del Titular", t: `En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), te informamos:\n\n**Denominación:** Senerva\n**Email de contacto:** hola@senerva.com\n**Dominio:** senerva.com · senerva.es · senerva.app\n**País:** España` },
        { h: "2. Objeto y Ámbito de Aplicación", t: `El presente Aviso Legal regula el uso del sitio web senerva.com, titularidad de Senerva. El acceso y uso de este sitio web implica la aceptación plena y sin reservas de las presentes condiciones.` },
        { h: "3. Propiedad Intelectual e Industrial", t: `Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño, código fuente, denominación "Senerva") son propiedad de Senerva o dispone de licencia para su uso. Queda prohibida su reproducción, distribución, transformación o comunicación pública sin autorización expresa y por escrito.` },
        { h: "4. Responsabilidad", t: `Senerva no se responsabiliza de los daños derivados del uso incorrecto de la plataforma, de la interrupción del servicio por causas ajenas a su voluntad, ni de los contenidos generados por los usuarios. Los planes y recomendaciones de los agentes IA tienen carácter informativo y no constituyen asesoramiento médico, nutricional ni sanitario profesional. Consulta siempre con un profesional de la salud antes de realizar cambios significativos en tu dieta o rutina de ejercicio.` },
        { h: "5. Hipervínculos", t: `El sitio puede contener enlaces a sitios web de terceros. Senerva no controla ni se responsabiliza de sus contenidos, políticas de privacidad ni disponibilidad.` },
        { h: "6. Legislación Aplicable", t: `Las presentes condiciones se rigen por la legislación española. Para cualquier controversia derivada del uso del sitio, las partes se someten a los Juzgados y Tribunales de España.` },
      ]
    },
    cookies: {
      title: "Política de Cookies",
      lastUpdate: "Marzo 2025",
      content: [
        { h: "1. ¿Qué son las cookies?", t: `Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten al sitio recordar tus preferencias y mejorar tu experiencia de navegación.` },
        { h: "2. Cookies que utilizamos", t: `**Cookies estrictamente necesarias (no requieren consentimiento):**\n· \`session_id\` — Gestión de sesión de usuario registrado. Duración: sesión.\n· \`csrf_token\` — Seguridad del formulario. Duración: sesión.\n\n**Cookies de preferencias (requieren consentimiento):**\n· \`cookie_consent\` — Almacena tu elección sobre cookies. Duración: 12 meses.\n· \`lang_preference\` — Preferencia de idioma. Duración: 12 meses.\n\n**Cookies analíticas (requieren consentimiento):**\n· En caso de utilizar herramientas de analítica web en el futuro, se indicará aquí el detalle. Actualmente Senerva NO utiliza cookies de analítica de terceros.` },
        { h: "3. Cómo gestionar las cookies", t: `Al acceder a senerva.com por primera vez, aparecerá un banner que te permitirá:\n\n· **Aceptar todas** las cookies.\n· **Rechazar** las cookies no necesarias.\n· **Configurar** tus preferencias por categoría.\n\nPuedes cambiar tus preferencias en cualquier momento desde el pie de página (enlace "Configurar cookies").` },
        { h: "4. Desactivar cookies desde el navegador", t: `También puedes gestionar o eliminar cookies desde la configuración de tu navegador:\n\n· **Chrome:** Configuración → Privacidad y seguridad → Cookies\n· **Firefox:** Opciones → Privacidad y seguridad\n· **Safari:** Preferencias → Privacidad\n· **Edge:** Configuración → Privacidad, búsqueda y servicios\n\nTen en cuenta que desactivar todas las cookies puede afectar al funcionamiento de la plataforma.` },
        { h: "5. Actualizaciones de esta política", t: `Podemos actualizar esta Política de Cookies para reflejar cambios en las cookies que utilizamos. Te notificaremos cualquier cambio significativo mostrando de nuevo el banner de consentimiento.` },
        { h: "6. Contacto", t: `Para cualquier consulta sobre el uso de cookies, contacta con nosotros en **hola@senerva.com**.` },
      ]
    }
  };

  const s = sections[type];
  const renderText = (text) => text
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${B.text}">$1</strong>`)
    .replace(/·/g, `<span style="color:${B.green};font-weight:700;margin-right:6px">·</span>`)
    .replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');

  return (
    <main style={{ padding: "52px 24px", maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: B.green, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", marginBottom: 24, display: "flex", alignItems: "center", gap: 5 }}>← Volver al inicio</button>
      <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: B.textLt, letterSpacing: "0.12em", textTransform: "uppercase" }}>Legal</span>
        <span style={{ fontSize: "0.68rem", color: B.textLt }}>·</span>
        <span style={{ fontSize: "0.68rem", color: B.textLt }}>Última actualización: {s.lastUpdate}</span>
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: B.text, margin: "0 0 36px", lineHeight: 1.2 }}>{s.title}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {s.content.map((section, i) => (
          <div key={i} style={{ padding: "22px 24px", borderRadius: 14, background: B.white, border: `1.5px solid ${B.border}` }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 700, color: B.green, margin: "0 0 12px" }}>{section.h}</h2>
            <div style={{ fontSize: "0.86rem", color: B.textMid, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: renderText(section.t) }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 36, padding: "18px 22px", borderRadius: 12, background: B.greenLt, border: `1px solid ${B.border}` }}>
        <div style={{ fontSize: "0.82rem", color: B.textMid, lineHeight: 1.7 }}>
          ¿Tienes alguna pregunta sobre esta política? Escríbenos a <strong style={{ color: B.green }}>hola@senerva.com</strong>
        </div>
      </div>
    </main>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function PricingPage({ onRegister }) {
  const plans = [
    { plan: "Free", price: "0€", period: "para siempre", desc: "Para descubrir Senerva", highlight: false, color: B.textMid, features: [["2 agentes IA", true], ["5 consultas/día", true], ["Recetas básicas", true], ["Blog y contenido", true], ["Planes personalizados", false], ["Agente Maestro", false], ["Soporte prioritario", false]], cta: "Empezar gratis" },
    { plan: "Pro", price: "9€", period: "/mes", desc: "Para transformar tu rendimiento", highlight: true, color: B.green, features: [["5 agentes IA completos", true], ["Consultas ilimitadas", true], ["Recetas premium", true], ["Planes semanales personalizados", true], ["Agente Maestro integrador", true], ["Historial de conversaciones", true], ["Soporte 24h", true]], cta: "Probar 7 días gratis" },
    { plan: "Team", price: "29€", period: "/mes", desc: "Para equipos y academias", highlight: false, color: B.teal, features: [["Todo lo de Pro", true], ["Hasta 5 usuarios", true], ["Panel de equipo", true], ["Estadísticas de progreso", true], ["Onboarding dedicado", true], ["Facturación empresa", true], ["Account manager", true]], cta: "Contactar" },
  ];
  return (
    <main style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: B.green, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Precios</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.4rem", fontWeight: 700, color: B.text, margin: "0 0 12px" }}>Simple y transparente</h1>
        <p style={{ color: B.textMid, fontSize: "0.92rem" }}>Empieza gratis. Escala cuando notes los resultados.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr 1fr", gap: 18, alignItems: "start" }}>
        {plans.map((p, i) => (
          <div key={i} style={{ padding: "32px 26px", borderRadius: 20, background: p.highlight ? `linear-gradient(145deg, ${B.green}, ${B.teal})` : B.white, border: `2px solid ${p.highlight ? "transparent" : B.border}`, boxShadow: p.highlight ? "0 18px 48px rgba(30,138,74,0.22)" : "0 2px 12px rgba(0,0,0,0.04)", position: "relative" }}>
            {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: B.coral, color: "#fff", fontSize: "0.66rem", fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>✦ MÁS POPULAR</div>}
            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: p.highlight ? "rgba(255,255,255,0.6)" : B.textLt, marginBottom: 6 }}>{p.desc}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 700, color: p.highlight ? "#fff" : B.text, marginBottom: 5 }}>{p.plan}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.8rem", fontWeight: 700, color: p.highlight ? "#fff" : B.text, lineHeight: 1 }}>{p.price}</span>
              <span style={{ fontSize: "0.78rem", color: p.highlight ? "rgba(255,255,255,0.6)" : B.textLt }}>{p.period}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
              {p.features.map(([f, ok], j) => (
                <div key={j} style={{ display: "flex", gap: 9, alignItems: "center", opacity: ok ? 1 : 0.35 }}>
                  <span style={{ color: ok ? (p.highlight ? "#fff" : B.green) : B.textLt, fontWeight: 700, fontSize: "0.82rem" }}>{ok ? "✓" : "✗"}</span>
                  <span style={{ fontSize: "0.81rem", color: p.highlight ? (ok ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)") : (ok ? B.textMid : B.textLt) }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={onRegister} style={{ width: "100%", padding: "11px", borderRadius: 9, background: p.highlight ? "#fff" : `linear-gradient(135deg, ${B.green}, ${B.greenMid})`, color: p.highlight ? B.green : "#fff", border: "none", fontWeight: 700, fontSize: "0.87rem", cursor: "pointer", fontFamily: "inherit" }}>{p.cta}</button>
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── HOW PAGE ─────────────────────────────────────────────────────────────────
function HowPage({ onRegister }) {
  const steps = [
    { n: "01", icon: "👤", title: "Crea tu perfil en 60 segundos", color: B.green, bg: B.greenLt, desc: "Regístrate sin tarjeta de crédito. Cuéntanos tu objetivo y accede a los 5 agentes IA.", detail: ["Sin tarjeta de crédito", "Acceso inmediato", "Perfil personalizable", "5 agentes disponibles"] },
    { n: "02", icon: "🤖", title: "Habla con tu agente IA", color: B.teal, bg: B.tealLt, desc: "Elige el agente según tu necesidad o usa el Agente Maestro para un plan holístico completo.", detail: ["NutriCoach — Nutrición", "FitMind — Ejercicio", "ChefNeuro — Recetas", "MindFlow — Estudio", "Senerva AI — Plan Maestro"] },
    { n: "03", icon: "📋", title: "Recibe tu plan personalizado", color: B.coral, bg: B.coralLt, desc: "Horarios, recetas, rutinas y técnicas de estudio diseñadas específicamente para ti.", detail: ["Horarios con tiempos exactos", "Recetas paso a paso", "Rutinas adaptadas", "Técnicas según tu materia"] },
    { n: "04", icon: "🚀", title: "Resultados en 7 días", color: B.gold, bg: B.goldLt, desc: "La sinergia de los 4 pilares crea efectos que ningún factor logra por separado.", detail: ["+40% concentración", "Más energía diaria", "Memorización eficiente", "Menos estrés académico"] },
  ];
  return (
    <main style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: B.green, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Metodología</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.4rem", fontWeight: 700, color: B.text, margin: "0 0 14px" }}>Cómo funciona Senerva</h1>
        <p style={{ color: B.textMid, fontSize: "0.92rem", maxWidth: 500, margin: "0 auto" }}>4 pasos basados en neurociencia para transformar tu rendimiento.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 52 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", borderRadius: 20, overflow: "hidden", border: `1.5px solid ${B.border}`, background: B.white }}>
            <div style={{ padding: "38px 40px", order: i % 2 === 0 ? 1 : 2 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Paso {s.n}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 700, color: B.text, margin: "0 0 12px" }}>{s.title}</h3>
              <p style={{ fontSize: "0.86rem", color: B.textMid, lineHeight: 1.75, margin: "0 0 18px" }}>{s.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {s.detail.map((d, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: s.bg, border: `1.5px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.55rem", color: s.color, fontWeight: 800 }}>✓</span>
                    </div>
                    <span style={{ fontSize: "0.81rem", color: B.textMid }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", order: i % 2 === 0 ? 2 : 1, minHeight: 220 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "7rem", fontWeight: 700, color: `${s.color}18`, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "3.5rem", marginTop: -26 }}>{s.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: `linear-gradient(135deg, ${B.green}, ${B.teal})`, borderRadius: 22, padding: "44px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.9rem", fontWeight: 700, color: "#fff", marginBottom: 12 }}>¿Listo para empezar?</div>
        <p style={{ color: "rgba(255,255,255,0.77)", fontSize: "0.92rem", marginBottom: 26 }}>Crea tu cuenta gratis y accede a los 5 agentes IA ahora mismo.</p>
        <button onClick={onRegister} style={{ padding: "13px 34px", borderRadius: 10, background: "#fff", color: B.green, border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.97rem", fontFamily: "'Cormorant Garamond',serif", transition: "all 0.2s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >Registrarme gratis →</button>
      </div>
    </main>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: B.text, color: "rgba(255,255,255,0.6)", padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div>
            <Logo size={32} light />
            <p style={{ fontSize: "0.8rem", lineHeight: 1.75, margin: "14px 0 18px", maxWidth: 230, color: "rgba(255,255,255,0.5)" }}>La plataforma integral de alto rendimiento. Nutrición · Ejercicio · Recetas · Aprendizaje.</p>
            <div style={{ display: "flex", gap: 7 }}>
              {["📸", "🎵", "▶", "𝕏", "💼"].map((ic, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.background = B.green}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >{ic}</div>
              ))}
            </div>
          </div>
          {[
            { title: "Plataforma", links: [["platform", "Plataforma IA"], ["how", "Cómo funciona"], ["pricing", "Precios"]] },
            { title: "Contenido", links: [["blog", "Blog"], ["blog", "Recetas"], ["about", "Equipo"]] },
            { title: "Legal", links: [["privacy", "Política de Privacidad"], ["legal", "Aviso Legal"], ["cookies", "Política de Cookies"]] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 13 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map(([pg, label], j) => (
                  <button key={j} onClick={() => setPage(pg)} style={{ background: "none", border: "none", textAlign: "left", fontSize: "0.8rem", color: "rgba(255,255,255,0.48)", cursor: "pointer", padding: 0, fontFamily: "inherit", transition: "color 0.18s" }}
                    onMouseEnter={e => e.target.style.color = B.greenMid}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.48)"}
                  >{label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: "0.74rem" }}>© 2025 Senerva · senerva.com · senerva.es · senerva.app · hola@senerva.com</div>
          <div style={{ display: "flex", gap: 14 }}>
            {[["privacy","Privacidad"], ["legal","Aviso legal"], ["cookies","Cookies"]].map(([pg, l], i) => (
              <button key={i} onClick={() => setPage(pg)} style={{ background: "none", border: "none", fontSize: "0.74rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", transition: "color 0.18s", padding: 0 }}
                onMouseEnter={e => e.target.style.color = B.greenMid}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [showRegister, setShowRegister] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem("senerva_cookie_consent"));
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const seo = SEO[page] || SEO.home;
    document.title = seo.title;
    if (meta) meta.content = seo.desc;
  }, [page]);

  // Si intenta acceder a plataforma sin login, abre el modal
  const handlePlatformAccess = () => {
    if (isAuthenticated) {
      setPage("platform");
    } else {
      setShowRegister(true);
    }
  };

  const handleCookieAccept = () => { localStorage.setItem("senerva_cookie_consent", "accepted"); setCookieConsent("accepted"); };
  const handleCookieReject = () => { localStorage.setItem("senerva_cookie_consent", "rejected"); setCookieConsent("rejected"); };

  return (
    <div style={{ fontFamily: "'Outfit','Segoe UI',sans-serif", background: B.cream, minHeight: "100vh", color: B.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <Navbar
        page={page}
        setPage={setPage}
        onRegister={() => setShowRegister(true)}
        onPlatform={handlePlatformAccess}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => { logout(); setPage("home"); }}
      />

      {page === "home"     && <HomePage     setPage={setPage} onRegister={() => setShowRegister(true)} onPlatform={handlePlatformAccess} />}
      {page === "platform" && <PlatformPage onRegister={() => setShowRegister(true)} />}
      {page === "how"      && <HowPage      onRegister={() => setShowRegister(true)} />}
      {page === "pricing"  && <PricingPage  onRegister={() => setShowRegister(true)} />}
      {page === "blog"     && <BlogPage />}
      {page === "recipe"   && <RecipePage />}
      {page === "about"    && <AboutPage    onRegister={() => setShowRegister(true)} />}
      {page === "privacy"  && <LegalPage type="privacy" setPage={setPage} />}
      {page === "legal"    && <LegalPage type="legal"   setPage={setPage} />}
      {page === "cookies"  && <LegalPage type="cookies" setPage={setPage} />}

      {page !== "platform" && <Footer setPage={setPage} />}

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      {!cookieConsent && (
        <CookieBanner
          onAccept={handleCookieAccept}
          onReject={handleCookieReject}
          onConfig={() => setPage("cookies")}
        />
      )}

      <style>{`
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes dotPulse { 0%,100%{transform:scale(.55);opacity:.4} 50%{transform:scale(1);opacity:1} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:${B.cream2}; }
        ::-webkit-scrollbar-thumb { background:${B.border}; border-radius:2px; }
        textarea, input { box-sizing:border-box; }
      `}</style>
    </div>
  );
}