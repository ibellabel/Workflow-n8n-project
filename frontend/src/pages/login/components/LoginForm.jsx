import { useState } from "react";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit({
        email,
        password,
      });

      setSuccess(true);

    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="animate-in slide-in-from-top-2 p-3.5 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-2.5 shadow-sm">
          <svg
            className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <span className="font-medium text-red-800">
            {error}
          </span>
        </div>
      )}

      {success && (
        <div className="animate-in slide-in-from-top-2 p-3.5 bg-green-50/80 backdrop-blur-sm text-green-800 rounded-xl text-sm border border-green-200 flex items-center shadow-sm">
          <div className="mr-3 p-1 bg-green-100 rounded-full text-green-600">
            <CheckIcon className="w-4 h-4" />
          </div>

          <span className="font-bold tracking-tight">
            ¡Ingreso exitoso! Preparando tu dashboard...
          </span>
        </div>
      )}

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider transition-colors group-focus-within:text-indigo-600">
          Correo electrónico
        </label>

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-indigo-500 pointer-events-none" />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="tu@correo.com"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 flex justify-between uppercase tracking-wider transition-colors group-focus-within:text-indigo-600">
          <span>Contraseña</span>

          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-700 text-[11px] normal-case tracking-normal"
          >
            ¿La olvidaste?
          </a>
        </label>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-indigo-500 pointer-events-none" />

          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-slate-200/60 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
            placeholder="••••••••"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors bg-transparent border-none p-1 focus:outline-none"
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center mt-8 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none delay-0"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Verificando tú perfil...
          </div>
        ) : (
          "Ingresar a Magneto"
        )}
      </button>
    </form>
  );
};

function CheckIcon(props) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}