import { useState, useEffect } from "react";
import { Briefcase, Target, ClipboardList, LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          jobs (
            title,
            company_id
          )
        `);

      if (error) {
        console.error("Error cargando postulaciones:", error);
        return;
      }

      const formatted = data.map((app) => ({
        id: app.id,
        title: app.jobs?.title || "Sin título",
        company: "Empresa",
        status: app.status
      }));

      setApplications(formatted);
    };

    fetchApplications();
  }, []);

  const windows = [
    { id: "hire-match", name: "Hire match", icon: Briefcase },
    { id: "aspirations", name: "Aspiraciones", icon: Target },
    { id: "applications", name: "Mis postulaciones", icon: ClipboardList }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-bold text-slate-800">Magneto App</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {windows.map((w) => {
            const Icon = w.icon;
            const isActive = activeTab === w.id;

            return (
              <button
                key={w.id}
                onClick={() => setActiveTab(w.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {w.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
          <h1 className="font-bold">
            {windows.find((w) => w.id === activeTab)?.name}
          </h1>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-slate-50">

          {activeTab === "applications" && (
            <div className="space-y-6">

              {/* HEADER */}
              <div>
                <h2 className="text-2xl font-bold">Mis postulaciones</h2>
                <p className="text-slate-500">
                  Sigue el estado de cada solicitud en tiempo real
                </p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-slate-500">Total enviadas</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications.filter(a => a.status === "REVISION").length}
                  </p>
                  <p className="text-sm text-slate-500">En revisión</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter(a => a.status === "ENTREVISTA").length}
                  </p>
                  <p className="text-sm text-slate-500">Entrevistas</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-emerald-600">
                    {applications.filter(a => a.status === "OFERTA").length}
                  </p>
                  <p className="text-sm text-slate-500">Oferta</p>
                </div>
              </div>

              {/* PROCESO */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-4">
                  PROCESO TÍPICO DE UNA VACANTE
                </h3>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="relative flex justify-between items-center">

                    {/* BARRA */}
                    <div className="absolute top-3 left-0 w-full h-1 bg-slate-200 rounded-full"></div>
                    <div className="absolute top-3 left-0 h-1 bg-blue-500 w-2/5"></div>
                    <div className="absolute top-3 left-2/5 h-1 bg-green-500 w-1/5"></div>

                    {/* PASOS */}
                    {["Enviada","Revisión CV","Entrevista","Técnica","Oferta"].map((step, i) => {
                      const isBlue = i <= 1;
                      const isGreen = i === 2;

                      return (
                        <div key={i} className="flex flex-col items-center flex-1 z-10">

                          <div className={`w-6 h-6 rounded-full border-4 ${
                            isBlue
                              ? "bg-blue-500 border-blue-500"
                              : isGreen
                              ? "bg-green-500 border-green-500"
                              : "bg-white border-slate-300"
                          }`}></div>

                          <span className={`mt-2 text-sm ${
                            isBlue
                              ? "text-blue-600"
                              : isGreen
                              ? "text-green-600"
                              : "text-slate-400"
                          }`}>
                            {step}
                          </span>

                        </div>
                      );
                    })}

                  </div>
                </div>
              </div>

              {/* LISTA */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-semibold mb-4">
                  POSTULACIONES RECIENTES
                </h3>

                {applications.map((app) => {
                  const getColor = (status) => {
                    switch (status) {
                      case "ENTREVISTA":
                        return "bg-green-100 text-green-700";
                      case "POSTULADO":
                        return "bg-yellow-100 text-yellow-700";
                      default:
                        return "bg-blue-100 text-blue-700";
                    }
                  };

                  return (
                    <div key={app.id} className="flex justify-between border p-3 mb-2 rounded-lg">
                      <div>
                        <p className="font-semibold">{app.title}</p>
                        <p className="text-sm text-slate-500">{app.company}</p>
                      </div>

                      <span className={`text-xs px-3 py-1 rounded-full ${getColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}