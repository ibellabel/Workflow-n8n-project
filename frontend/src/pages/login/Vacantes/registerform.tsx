import { useState } from "react";

interface RegisterFormProps {
  onSubmit?: (data: { firstName: string; lastName: string; email: string; password: string; profile: string }) => void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ firstName, lastName, email, password, profile });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm mb-2" style={{ color: "#0F172A", fontWeight: 500 }}>
            Nombre
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Juan"
            className="w-full h-[42px] px-4 rounded-[10px] border-[1.5px] border-[#E2E8F0] focus:border-[#1A4FBD] focus:outline-none focus:ring-[3px] focus:ring-[#1A4FBD]/20 transition-all"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm mb-2" style={{ color: "#0F172A", fontWeight: 500 }}>
            Apellido
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Pérez"
            className="w-full h-[42px] px-4 rounded-[10px] border-[1.5px] border-[#E2E8F0] focus:border-[#1A4FBD] focus:outline-none focus:ring-[3px] focus:ring-[#1A4FBD]/20 transition-all"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm mb-2" style={{ color: "#0F172A", fontWeight: 500 }}>
          Correo electrónico
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="w-full h-[42px] px-4 rounded-[10px] border-[1.5px] border-[#E2E8F0] focus:border-[#1A4FBD] focus:outline-none focus:ring-[3px] focus:ring-[#1A4FBD]/20 transition-all"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>
      
      <div>
        <label htmlFor="reg-password" className="block text-sm mb-2" style={{ color: "#0F172A", fontWeight: 500 }}>
          Contraseña
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full h-[42px] px-4 rounded-[10px] border-[1.5px] border-[#E2E8F0] focus:border-[#1A4FBD] focus:outline-none focus:ring-[3px] focus:ring-[#1A4FBD]/20 transition-all"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>

      <div>
        <label htmlFor="profile" className="block text-sm mb-2" style={{ color: "#0F172A", fontWeight: 500 }}>
          Perfil profesional
        </label>
        <input
          id="profile"
          type="text"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          placeholder="ej. Desarrollador Frontend"
          className="w-full h-[42px] px-4 rounded-[10px] border-[1.5px] border-[#E2E8F0] focus:border-[#1A4FBD] focus:outline-none focus:ring-[3px] focus:ring-[#1A4FBD]/20 transition-all"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>

      <button
        type="submit"
        className="w-full h-[44px] rounded-[10px] text-white font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#1A4FBD", fontWeight: 600 }}
      >
        Crear cuenta gratis
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2E8F0]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white" style={{ color: "#64748B" }}>o continúa con</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="w-full h-[42px] rounded-[10px] border-[1.5px] border-[#E2E8F0] hover:border-[#1A4FBD] hover:text-[#1A4FBD] transition-colors flex items-center justify-center gap-2 font-semibold"
          style={{ color: "#0F172A", fontWeight: 600 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
            <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853"/>
            <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54756 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05"/>
            <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <button
          type="button"
          className="w-full h-[42px] rounded-[10px] border-[1.5px] border-[#E2E8F0] hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors flex items-center justify-center gap-2 font-semibold"
          style={{ color: "#0F172A", fontWeight: 600 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 0H1.5C0.67 0 0 0.67 0 1.5V16.5C0 17.33 0.67 18 1.5 18H16.5C17.33 18 18 17.33 18 16.5V1.5C18 0.67 17.33 0 16.5 0ZM5.4 15.3H2.7V6.75H5.4V15.3ZM4.05 5.58C3.15 5.58 2.43 4.86 2.43 3.96C2.43 3.06 3.15 2.34 4.05 2.34C4.95 2.34 5.67 3.06 5.67 3.96C5.67 4.86 4.95 5.58 4.05 5.58ZM15.3 15.3H12.6V11.16C12.6 10.17 12.58 8.91 11.25 8.91C9.9 8.91 9.69 9.96 9.69 11.1V15.3H6.99V6.75H9.57V7.95H9.6C9.96 7.29 10.83 6.6 12.12 6.6C14.85 6.6 15.3 8.43 15.3 10.77V15.3Z" fill="#0A66C2"/>
          </svg>
          LinkedIn
        </button>
      </div>
    </form>
  );
}
