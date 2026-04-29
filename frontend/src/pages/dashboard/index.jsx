import { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, Target, ClipboardList, LayoutDashboard, LogOut, Sparkles, ChevronRight, TrendingUp, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("hire-match");
  const [applications, setApplications] = useState([]);

  // Top Matches state
  const [topMatches, setTopMatches] = useState([]);
  const [isLoadingTopMatches, setIsLoadingTopMatches] = useState(false);
  const [topMatchesError, setTopMatchesError] = useState(null);

  // Aspirational Match state
  const [aspirationalMatches, setAspirationalMatches] = useState([]);
  const [isLoadingAspirations, setIsLoadingAspirations] = useState(false);
  const [aspirationsError, setAspirationsError] = useState(null);

  // CV Upload state
  const [cvFile, setCvFile] = useState(null);
  const [cvSalary, setCvSalary] = useState('');
  const [cvWorkPreference, setCvWorkPreference] = useState('Remoto');
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [uploadCvStatus, setUploadCvStatus] = useState(null);

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

    const fetchAspirational = async () => {
      setIsLoadingAspirations(true);
      setAspirationsError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const candidateId = user?.id || "55555555-5555-5555-5555-555555555555";
        const res = await axios.get(`http://localhost:3001/api/aspirational-matches?candidate_id=${candidateId}`);
        setAspirationalMatches(res.data.matches || []);
      } catch (err) {
        console.error("Error fetching aspirational matches:", err);
        setAspirationsError(err?.response?.data?.error || "Error al cargar empleos aspiracionales");
      } finally {
        setIsLoadingAspirations(false);
      }
    };

    const fetchTopMatches = async () => {
      setIsLoadingTopMatches(true);
      setTopMatchesError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const candidateId = user?.id || "55555555-5555-5555-5555-555555555555";
        const res = await axios.get(`http://localhost:3001/api/top-matches?candidate_id=${candidateId}`);
        setTopMatches(res.data.top_matches || []);
      } catch (err) {
        console.error("Error fetching top matches:", err);
        setTopMatchesError(err?.response?.data?.error || "Error al cargar matches");
      } finally {
        setIsLoadingTopMatches(false);
      }
    };

    fetchApplications();
    fetchAspirational();
    fetchTopMatches();
  }, []);

  const windows = [
    { id: "hire-match", name: "Hire match", icon: Briefcase },
    { id: "aspirations", name: "Aspiraciones", icon: Target },
    { id: "applications", name: "Mis postulaciones", icon: ClipboardList },
    { id: "upload-cv", name: "Analizar CV", icon: UploadCloud }
  ];

  const handleUploadCv = async (e) => {
    e.preventDefault();
    if (!cvFile || !cvSalary || !cvWorkPreference) return;

    setIsUploadingCv(true);
    setUploadCvStatus(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const candidateId = user?.id || "55555555-5555-5555-5555-555555555555";

      const formData = new FormData();
      formData.append("candidate_id", candidateId);
      formData.append("salary", cvSalary);
      formData.append("work_preference", cvWorkPreference);
      formData.append("cv", cvFile);

      const res = await axios.post("http://localhost:3001/api/upload-cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setUploadCvStatus({ type: "success", message: res.data.message || "CV analizado exitosamente!" });
      setCvFile(null);
      setCvSalary("");
      setCvWorkPreference("Remoto");
    } catch (error) {
      console.error("Error uploading CV:", error);
      setUploadCvStatus({ type: "error", message: error.response?.data?.error || "Ocurrió un error al analizar el CV." });
    } finally {
      setIsUploadingCv(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-bold text-slate-800">Hire Match</span>
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

          {activeTab === "hire-match" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Briefcase className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Top Matches</h2>
                  <p className="text-slate-500">
                    Las vacantes más compatibles con tu perfil y habilidades
                  </p>
                </div>
              </div>

              {isLoadingTopMatches ? (
                <div className="flex justify-center p-12">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
              ) : topMatchesError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{topMatchesError}</p>
                </div>
              ) : topMatches.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border border-slate-100">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800">No hay matches disponibles</h3>
                  <p className="text-slate-500 mt-1">Sigue mejorando tu perfil para conectar con oportunidades.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {topMatches.map((job) => (
                    <div key={job.job_id} className="bg-white rounded-2xl border border-slate-100 p-6 overflow-hidden relative hover:shadow-xl transition-all group">
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Match Exitoso
                            </span>
                            <span className="text-slate-400 text-sm">{job.location || 'Remoto'}</span>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {job.title}
                            </h3>
                          </div>

                          {job.match_reason && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4 inline-block w-full text-slate-600 text-sm">
                              {job.match_reason}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end justify-center shrink-0">
                          <div className="text-right mb-4">
                            <p className="text-sm text-slate-500">Compatibilidad</p>
                            <p className="text-3xl font-bold text-emerald-600">{Math.round(job.match_score)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "aspirations" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Feed de Crecimiento</h2>
                  <p className="text-slate-500">
                    Trabajos desafiantes que impulsarán tu carrera al siguiente nivel
                  </p>
                </div>
              </div>

              {isLoadingAspirations ? (
                <div className="flex justify-center p-12">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : aspirationsError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{aspirationsError}</p>
                </div>
              ) : aspirationalMatches.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border border-slate-100">
                  <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800">No hay retos disponibles ahora</h3>
                  <p className="text-slate-500 mt-1">Sigue mejorando tu perfil, ¡pronto encontrarás nuevos desafíos!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {aspirationalMatches.map((job) => (
                    <div key={job.job_id} className="bg-white rounded-2xl border border-slate-100 p-6 overflow-hidden relative hover:shadow-xl transition-all group">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Target className="w-32 h-32" />
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Empleo Aspiracional
                            </span>
                            <span className="text-slate-400 text-sm">{job.location || 'Remoto'}</span>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-slate-500 mt-1">Salario de hasta: <strong className="text-slate-800">${job.job_salary_max?.toLocaleString('es-CO')} COP</strong></p>
                          </div>

                          {job.missing_skills && job.missing_skills.length > 0 && (
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 mt-4 inline-block w-full">
                              <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4" />
                                Habilidades Faltantes (Tu próximo reto):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {job.missing_skills.map((skill, idx) => (
                                  <span key={idx} className="bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end justify-center shrink-0">
                          <div className="text-right mb-4">
                            <p className="text-sm text-slate-500">Posible Match</p>
                            <p className="text-3xl font-bold text-slate-800">{Math.round(job.match_score)}%</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

          {activeTab === "upload-cv" && (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Analizar mi CV</h2>
                  <p className="text-slate-500">Sube tu hoja de vida para activar el onboarding inteligente con N8N</p>
                </div>
              </div>

              <form onSubmit={handleUploadCv} className="space-y-6">
                {uploadCvStatus && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${uploadCvStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                    {uploadCvStatus.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                    <p>{uploadCvStatus.message}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Archivo CV (PDF)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      className="hidden" 
                      id="cv-upload"
                      required
                    />
                    <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <UploadCloud className="w-10 h-10 text-slate-400" />
                      <span className="text-sm text-slate-600 font-medium">
                        {cvFile ? cvFile.name : "Haz clic para seleccionar tu CV (solo PDF)"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Expectativa Salarial (COP)</label>
                    <input 
                      type="number" 
                      value={cvSalary}
                      onChange={(e) => setCvSalary(e.target.value)}
                      placeholder="Ej. 5000000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Preferencia de Trabajo</label>
                    <select 
                      value={cvWorkPreference}
                      onChange={(e) => setCvWorkPreference(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                      required
                    >
                      <option value="Remoto">Remoto</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploadingCv || !cvFile}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploadingCv ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando con N8N...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analizar Perfil
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}