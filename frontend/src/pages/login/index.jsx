import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Logo } from "./components/Logo";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { CompanyRegisterForm } from "./components/CompanyRegisterForm";
import { ScorePreviewCard } from "./components/ScorePreviewCard";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // LOGIN
  const handleLogin = async (data) => {
    const { email, password } = data;

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Credenciales inválidas");
    }

    const userId = authData.user.id;

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (userData?.role === "COMPANY") {
      navigate("/company-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // REGISTRO USUARIO
  const handleRegister = async (data) => {
    const { fullName, email, password } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = authData.user;

    if (user) {
      await supabase.from("users").insert([
        {
          id: user.id,
          email,
          role: "CANDIDATE",
          is_active: true,
        },
      ]);

      await supabase.from("candidate_profiles").insert([
        {
          user_id: user.id,
          full_name: fullName,
        },
      ]);
    }

    alert("Usuario registrado correctamente");
    setActiveTab("login");
  };

  // REGISTRO EMPRESA
  const handleCompanyRegister = async (data) => {
    const {
      companyName,
      email,
      password,
      nit,
      headquarters,
    } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = authData.user;

    if (user) {
      await supabase.from("users").insert([
        {
          id: user.id,
          email,
          role: "COMPANY",
          is_active: true,
        },
      ]);

      await supabase.from("companies").insert([
        {
          user_id: user.id,
          company_name: companyName,
          nit: nit,
          headquarters: headquarters,
        },
      ]);
    }

    alert("Empresa registrada correctamente");
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">

      {/* LEFT PANEL */}
      <div className="lg:w-5/12 relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#233554] shadow-2xl z-10">

        {/* Background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-center p-6 bg-white/5 backdrop-blur-md border-b border-white/10">
          <Logo variant="compact" />
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex flex-col h-full p-12 lg:p-16 relative z-10 w-full max-w-xl mx-auto">

          {/* Logo */}
          <div
            className={`mb-16 transform transition-all duration-1000 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "-translate-y-8 opacity-0"
            }`}
          >
            <Logo />
          </div>

          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center">

            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-indigo-300 text-xs font-semibold w-fit mb-6 backdrop-blur-sm transform transition-all duration-700 delay-100 ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              IA de Próxima Generación
            </div>

            <h1
              className={`text-white mb-8 text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] transform transition-all duration-700 delay-200 ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              Impulsa tu carrera al{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                siguiente nivel
              </span>
            </h1>

            {/* Features */}
            <div
              className={`space-y-6 mb-12 transform transition-all duration-700 delay-300 ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              {[
                "Análisis semántico de tu CV",
                "Recomendaciones hyper-personalizadas",
                "Conexión directa con empresas Top",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/40 transition-all duration-300">
                    <Check
                      className="w-4 h-4 text-indigo-300"
                      strokeWidth={2.5}
                    />
                  </div>

                  <p className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors duration-300">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* Card */}
            <div
              className={`transform transition-all duration-1000 delay-500 hover:scale-[1.02] ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <div className="animate-float">
                <ScorePreviewCard />
              </div>
            </div>
          </div>

          <div
            className={`mt-12 text-slate-500 text-sm font-medium transform transition-all duration-700 delay-700 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            © {new Date().getFullYear()} Magneto AI • El poder del talento
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:w-7/12 flex-1 flex items-center justify-center p-6 lg:p-12 relative">

        {/* Blobs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-100 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-100 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <div
          className={`w-full max-w-md relative z-10 transition-all duration-700 transform ${
            mounted
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }`}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Bienvenido de vuelta
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Ingresa tus datos para acceder a tu dashboard
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100/80 mb-8 border border-slate-200/50">

              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                Inicia Sesión
              </button>

              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === "register"
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                Crea tu Cuenta
              </button>
            </div>

            {/* Forms */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

              {activeTab === "login" && (
                <LoginForm onSubmit={handleLogin} />
              )}

              {activeTab === "register" && (
                <RegisterForm onSubmit={handleRegister} />
              )}

              {activeTab === "company_register" && (
                <CompanyRegisterForm
                  onSubmit={handleCompanyRegister}
                  onBack={() => setActiveTab("login")}
                />
              )}
            </div>

            {/* Footer */}
            {activeTab !== "company_register" && (
              <>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="h-px bg-slate-200 flex-1"></div>

                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    O explora
                  </span>

                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setActiveTab("company_register")}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-4 focus:ring-slate-100"
                  >
                    Regístrate como Empresa
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}