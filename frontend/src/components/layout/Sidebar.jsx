import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Briefcase, Settings, BarChart2, Building2 } from 'lucide-react';

const navItems = [
  { icon: UserCircle, label: 'Mi Perfil', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Mis Postulaciones', path: '/applications' },
  { icon: BarChart2, label: 'Match Stats', path: '/stats' },
  { icon: Settings, label: 'Preferencias', path: '/settings' },
  { icon: Building2, label: 'Panel Empresa', path: '/empresa' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white/50 backdrop-blur-xl transition-transform">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
        
        <div className="mt-auto pt-6">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-4 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10 blur-xl"></div>
            <h4 className="font-semibold text-sm relative z-10">Mejora tu Score</h4>
            <p className="mt-1 text-xs text-indigo-100 relative z-10">Agrega tus habilidades técnicas para matches más precisos.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-3 w-full rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/30 transition-colors backdrop-blur-sm relative z-10"
            >
              Completar Perfil
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
