import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('admin@plataforma.com');
  const [password, setPassword] = useState('hash_falso_123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If already logged in, redirect
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const res = await login(email, password);
    
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-blue-400/20 blur-3xl filter"></div>
      <div className="absolute top-[60%] -right-[10%] h-[60%] w-[40%] rounded-full bg-indigo-400/20 blur-3xl filter"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg ring-4 ring-indigo-50">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Bienvenido de vuelta</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Ingresa a Magneto AI y encuentra tu match ideal
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Contraseña
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 shadow-lg shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-slate-500">
            ¿No tienes una cuenta?{' '}
            <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Regístrate ahora
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
