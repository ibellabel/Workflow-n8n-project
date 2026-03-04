import { Bell, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Import logout from context

  const handleSignOut = () => {
    logout(); // Limpia session
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md"></div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Magneto Pro
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              className="h-9 w-64 rounded-full border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Buscar vacantes..."
            />
          </div>
          <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <button 
            onClick={handleSignOut}
            title="Cerrar sesión"
            className="group relative h-8 w-8 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200 flex flex-shrink-0 items-center justify-center text-indigo-700 font-semibold cursor-pointer shadow-sm hover:shadow-md hover:from-red-100 hover:to-red-50 hover:border-red-200 hover:text-red-600 transition-all"
          >
            <User className="h-4 w-4 group-hover:hidden" />
            <LogOut className="h-4 w-4 hidden group-hover:block" />
          </button>
        </div>
      </div>
    </nav>
  );
}
