import { useState } from "react";
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await onSubmit(formData);

      setSuccessMessage(
        "¡Ingreso exitoso! Preparando tu dashboard..."
      );
    } catch (error) {
      setErrorMessage(
        error.message || "Credenciales inválidas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* SUCCESS */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl font-medium">
          {successMessage}
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">
          {errorMessage}
        </div>
      )}

      {/* EMAIL */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
          Correo Electrónico
        </label>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="email"
            required
            placeholder="tu@correo.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Contraseña
          </label>

          <button
            type="button"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            ¿La olvidaste?
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="w-full h-14 pl-12 pr-14 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-xl bg-[#0B132B] hover:bg-[#111c3f] text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Ingresando...
          </>
        ) : (
          "Ingresar a Magneto"
        )}
      </button>
    </form>
  );
}