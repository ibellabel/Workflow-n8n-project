// frontend/src/pages/Login/index.jsx
import { useState } from "react";
import { Check } from "lucide-react";
import { Logo } from "./components/Logo";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ScorePreviewCard } from "./components/ScorePreviewCard";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
     <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL - Hero Section */}
      <div 
        className="lg:w-[44%] bg-[#0D3A8C] relative overflow-hidden lg:min-h-screen"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      >
        {/* Mobile compact header */}
        <div className="lg:hidden flex items-center justify-center h-[120px] bg-gradient-to-r from-[#0D3A8C] to-[#1A4FBD] px-6">
          <Logo variant="compact" />
        </div>

        {/* Desktop content */}
        <div className="hidden lg:flex flex-col h-full p-12">
          {/* Logo */}
          <div className="mb-16">
            <Logo />
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h1 
              className="text-white mb-8 leading-tight"
              style={{ 
                fontSize: "2.5rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                lineHeight: "1.2"
              }}
            >
              Impulsa tu carrera con inteligencia artificial
            </h1>

            {/* Feature Bullets */}
            <div className="space-y-5 mb-12">
              {[
                "Análisis y score de tu hoja de vida",
                "Recomendaciones de mejora y cursos",
                "Match con ofertas laborales reales"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: "#4CC9A4" }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-white/90 text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* Score Preview Card */}
            <ScorePreviewCard />
          </div>

          {/* Footer Text */}
          <div className="mt-auto">
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tu carrera, potenciada por IA
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="lg:w-[56%] bg-[#F7F9FC] flex items-center justify-center px-6 py-12 lg:py-0">
        <div className="w-full max-w-[380px]">
          {/* Card Container */}
          <div 
            className="bg-white rounded-[16px] p-8"
            style={{ 
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)"
            }}
          >
            {/* Segmented Control Tabs */}
            <div 
              className="flex gap-1 p-1 rounded-[10px] mb-8"
              style={{ backgroundColor: "#EEF2FF" }}
            >
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 h-10 rounded-[8px] font-semibold text-sm transition-all ${
                  activeTab === "login"
                    ? "bg-white shadow-sm"
                    : "text-[#64748B] hover:text-[#1A4FBD]"
                }`}
                style={activeTab === "login" ? { color: "#1A4FBD", fontWeight: 600 } : { fontWeight: 600 }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 h-10 rounded-[8px] font-semibold text-sm transition-all ${
                  activeTab === "register"
                    ? "bg-white shadow-sm"
                    : "text-[#64748B] hover:text-[#1A4FBD]"
                }`}
                style={activeTab === "register" ? { color: "#1A4FBD", fontWeight: 600 } : { fontWeight: 600 }}
              >
                Registrarse
              </button>
            </div>

            {/* Forms */}
            {activeTab === "login" ? (
              <LoginForm onSubmit={(data) => console.log("Login:", data)} />
            ) : (
              <RegisterForm onSubmit={(data) => console.log("Register:", data)} />
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
              {activeTab === "login" ? (
                <>
                  ¿No tienes cuenta?{" "}
                  <button 
                    onClick={() => setActiveTab("register")}
                    className="font-semibold hover:underline"
                    style={{ color: "#1A4FBD" }}
                  >
                    Regístrate gratis
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <button 
                    onClick={() => setActiveTab("login")}
                    className="font-semibold hover:underline"
                    style={{ color: "#1A4FBD" }}
                  >
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}