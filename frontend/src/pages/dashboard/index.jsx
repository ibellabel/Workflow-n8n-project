import { useState } from "react";
import { Briefcase, Target, ClipboardList, LayoutDashboard, LogOut } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("hire-match");

  // Definición de las ventanas del dashboard
  const windows = [
    {
      id: "hire-match",
      name: "Hire match",
      icon: Briefcase,
      description: "Ofertas laborales con un alto nivel de compatibilidad con tu perfil."
    },
    {
      id: "aspirations",
      name: "Aspiraciones",
      icon: Target,
      description: "Ofertas laborales como meta de motivación y proyección corporativa."
    },
    {
      id: "applications",
      name: "Mis postulaciones",
      icon: ClipboardList,
      description: "Historial y estado actual de tus postulaciones en curso."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-bold tracking-tight text-slate-800">Magneto App</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu Principal</div>
          {windows.map((w) => {
            const Icon = w.icon;
            const isActive = activeTab === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setActiveTab(w.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 font-semibold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                {w.name}
              </button>
            );
          })}
        </nav>

        {/* User / Logout Area */}
        <div className="p-4 border-t border-slate-100">
          <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 text-slate-400" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:px-10 justify-between shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-800 hidden md:block">
              {windows.find(w => w.id === activeTab)?.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
               <span className="text-xs font-bold text-slate-500">U</span>
             </div>
          </div>
        </header>

        {/* Content Viewer (Placeholder for team) */}
        <div className="flex-1 overflow-auto p-6 md:p-10 bg-slate-50/50">
          {activeTab === "hire-match" && (
            <div className="h-full w-full border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 flex flex-col items-center justify-center text-center p-6">
              <Briefcase className="w-12 h-12 text-indigo-200 mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">Ventana: Hire Match</h2>
              <p className="text-slate-500 max-w-md">
                Espacio reservado para el equipo de desarrollo.<br/>
                Aquí se programará la lógica y visualización de ofertas con alto nivel de compatibilidad.
              </p>
            </div>
          )}

          {activeTab === "aspirations" && (
            <div className="h-full w-full border-2 border-dashed border-cyan-200 rounded-2xl bg-cyan-50/30 flex flex-col items-center justify-center text-center p-6">
              <Target className="w-12 h-12 text-cyan-200 mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">Ventana: Aspiraciones</h2>
              <p className="text-slate-500 max-w-md">
                Espacio reservado para el equipo de desarrollo.<br/>
                Aquí se mostrarán las ofertas "inalcanzables" para visualizar la progresión y meta corporativa.
              </p>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="h-full w-full border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30 flex flex-col items-center justify-center text-center p-6">
              <ClipboardList className="w-12 h-12 text-emerald-200 mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">Ventana: Mis Postulaciones</h2>
              <p className="text-slate-500 max-w-md">
                Espacio reservado para el equipo de desarrollo.<br/>
                Aquí se integrará la tabla de historial y estados de las postulaciones actuales.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
