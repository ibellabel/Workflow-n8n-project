import { useState } from "react";
import { Mail, Lock, Briefcase, Building, MapPin, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";

export const CompanyRegisterForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    taxId: "",
    location: "",
    role: "COMPANY"
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
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Registro Empresarial</h3>
          <p className="text-sm text-slate-500">Únete a cientos de empresas contratando con IA</p>
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-cyan-600">
          Razón Social / Empresa
        </label>
        <div className="relative">
          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-cyan-500 pointer-events-none" />
          <input
            type="text"
            name="companyName"
            required
            value={formData.companyName}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="Tech Solutions S.A."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-cyan-600">
            NIT / ID Fiscal
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-cyan-500 pointer-events-none" />
            <input
              type="text"
              name="taxId"
              required
              value={formData.taxId}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium text-sm"
              placeholder="900.123.456-7"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-cyan-600">
            Sede Principal
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-cyan-500 pointer-events-none" />
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium text-sm"
              placeholder="Ciudad, País"
            />
          </div>
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-cyan-600">
          Correo Corporativo
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-cyan-500 pointer-events-none" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="hr@empresa.com"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-cyan-600">
          Contraseña Administrador
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-cyan-500 pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-11 pr-12 py-2.5 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="Mínimo 8 caracteres"
          />
          <button
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors bg-transparent border-none p-1 focus:outline-none"
             aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
        
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Registrando empresa...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-300" /> Convertirse en Partner
          </div>
        )}
      </button>

      <button
         type="button"
         onClick={onBack}
         className="w-full mt-3 h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
      >
        Volver atrás
      </button>
    </form>
  );
};
