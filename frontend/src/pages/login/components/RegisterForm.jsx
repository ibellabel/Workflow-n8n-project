import { useState } from "react";
import { Mail, Lock, User, Briefcase, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";

export const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CANDIDATE"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rol oculto, por defecto CANDIDATE */}
      <input type="hidden" name="role" value="CANDIDATE" />

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-indigo-600">
          Nombre completo
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-indigo-500 pointer-events-none" />
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="Juan Pérez"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-indigo-600">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-indigo-500 pointer-events-none" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="tu@correo.com"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-indigo-600">
          Crea tu Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-indigo-500 pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-11 pr-12 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="Mínimo 8 caracteres"
          />
          <button
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors bg-transparent border-none p-1 focus:outline-none"
             aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        {/* Shimmer effect inside button */}
        <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
        
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Creando cuenta...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-300" /> ¡Comienza Gratis!
          </div>
        )}
      </button>
      
      <p className="text-[11px] text-center text-slate-400 mt-4 leading-relaxed max-w-xs mx-auto">
        Al hacer clic, confirmas que aceptas nuestros <a href="#" className="underline hover:text-slate-600">Términos</a> y la <a href="#" className="underline hover:text-slate-600">Gestión por Inteligencia Artificial</a>.
      </p>
    </form>
  );
};

function CheckIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
