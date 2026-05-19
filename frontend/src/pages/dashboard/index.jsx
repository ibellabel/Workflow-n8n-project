import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  PlusCircle,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
  Users
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const formatNumber = (value) => Number(value || 0).toLocaleString("es-CO");
const formatCurrency = (value) => value ? `$${formatNumber(value)} COP` : "No definido";
const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem("hire_match_session"));
  } catch {
    return null;
  }
};

const logout = () => {
  localStorage.removeItem("hire_match_session");
  window.location.href = "/login";
};

export default function DashboardPage() {
  const [session] = useState(getSession);

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return session.role === "COMPANY"
    ? <CompanyDashboard session={session} />
    : <CandidateDashboard session={session} />;
}

function CompanyDashboard({ session }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [createStatus, setCreateStatus] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    salary_range_min_cop: "",
    salary_range_max_cop: "",
    skills_required: "",
    english_level: "",
    experience_years: "",
    is_active: true
  });

  const companyId = session.company_id || session.id;

  const windows = [
    { id: "overview", name: "Resumen", icon: LayoutDashboard },
    { id: "jobs", name: "Vacantes", icon: Briefcase },
    { id: "applicants", name: "Postulantes", icon: Users },
    { id: "create-job", name: "Crear oferta", icon: PlusCircle }
  ];

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/empresa/${companyId}/dashboard`);
      setDashboard(data);
      setSelectedJobId((current) => current || data.jobs?.[0]?.job_id || null);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo cargar el dashboard empresarial.");
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const loadApplicants = async () => {
      if (!selectedJobId) {
        setApplicants([]);
        return;
      }

      setIsLoadingApplicants(true);
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/empresa/jobs/${selectedJobId}/applicants?company_id=${companyId}`
        );
        setApplicants(data.applicants || []);
      } catch (err) {
        setApplicants([]);
        setError(err.response?.data?.error || "No se pudieron cargar los postulantes.");
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    loadApplicants();
  }, [selectedJobId, companyId]);

  const selectedJob = useMemo(
    () => dashboard?.jobs?.find((job) => job.job_id === selectedJobId),
    [dashboard, selectedJobId]
  );

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;
    setJobForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const createJob = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    setCreateStatus(null);

    try {
      await axios.post(`${API_BASE_URL}/empresa/${companyId}/jobs`, {
        ...jobForm,
        skills_required: jobForm.skills_required.split(",").map((skill) => skill.trim()).filter(Boolean),
        experience_years: jobForm.experience_years ? Number(jobForm.experience_years) : null,
        salary_range_min_cop: jobForm.salary_range_min_cop || null,
        salary_range_max_cop: jobForm.salary_range_max_cop || null
      });

      setCreateStatus({ type: "success", message: "Oferta creada y guardada en la base de datos." });
      setJobForm({
        title: "",
        location: "",
        salary_range_min_cop: "",
        salary_range_max_cop: "",
        skills_required: "",
        english_level: "",
        experience_years: "",
        is_active: true
      });
      await loadDashboard();
      setActiveTab("jobs");
    } catch (err) {
      setCreateStatus({ type: "error", message: err.response?.data?.error || "No se pudo crear la oferta." });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardShell
      windows={windows}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={windows.find((windowItem) => windowItem.id === activeTab)?.name}
      brandLabel="Hire Match Empresas"
      brandIcon={Building2}
    >
      {isLoading ? (
        <LoadingBlock label="Cargando información empresarial..." />
      ) : error ? (
        <ErrorBlock message={error} />
      ) : (
        <>
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-indigo-600">Panel empresarial</p>
                  <h2 className="text-2xl font-bold text-slate-900">Hola, {dashboard.company.email}</h2>
                  <p className="text-slate-500">Vacantes, postulaciones y rendimiento de contratación desde la base de datos.</p>
                </div>
                <button
                  onClick={() => setActiveTab("create-job")}
                  className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Crear oferta
                </button>
              </div>

              <CompanyStats summary={dashboard.summary} />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">Vacantes publicadas</h3>
                      <p className="text-sm text-slate-500">Rendimiento por oferta laboral</p>
                    </div>
                  </div>
                  <JobList jobs={dashboard.jobs} onSelect={(jobId) => {
                    setSelectedJobId(jobId);
                    setActiveTab("applicants");
                  }} />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Estados de postulaciones</h3>
                  <StatusDistribution rows={dashboard.status_distribution} />
                </div>
              </div>

              <RecentApplicants applicants={dashboard.recent_applicants} />
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-6">
              <SectionHeader
                title="Vacantes publicadas"
                description="Todas las ofertas laborales asociadas a tu empresa."
                actionLabel="Nueva oferta"
                onAction={() => setActiveTab("create-job")}
              />
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <JobList jobs={dashboard.jobs} onSelect={(jobId) => {
                  setSelectedJobId(jobId);
                  setActiveTab("applicants");
                }} />
              </div>
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="space-y-6">
              <SectionHeader
                title="Postulantes por vacante"
                description="Selecciona una vacante para revisar candidatos, compatibilidad y estado."
              />

              <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-fit">
                  <h3 className="text-sm font-bold text-slate-600 mb-3">VACANTES</h3>
                  <div className="space-y-2">
                    {dashboard.jobs.map((job) => (
                      <button
                        key={job.job_id}
                        onClick={() => setSelectedJobId(job.job_id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedJobId === job.job_id
                            ? "border-indigo-200 bg-indigo-50 text-indigo-900"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-xs mt-1">{job.total_candidates} postulantes</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  {selectedJob ? (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{selectedJob.title}</h3>
                          <p className="text-sm text-slate-500">{selectedJob.location || "Ubicación no definida"}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
                          Match promedio {Math.round(Number(selectedJob.average_match_score || 0))}%
                        </span>
                      </div>

                      {isLoadingApplicants ? (
                        <LoadingBlock label="Cargando postulantes..." compact />
                      ) : (
                        <ApplicantList applicants={applicants} />
                      )}
                    </>
                  ) : (
                    <EmptyState icon={Briefcase} title="No hay vacantes" description="Crea una oferta laboral para empezar a recibir postulantes." />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "create-job" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <SectionHeader
                  title="Crear oferta laboral"
                  description="La vacante se guardará en PostgreSQL y quedará disponible para los procesos de match."
                />

                {createStatus && (
                  <div className={`mb-5 p-4 rounded-xl flex items-center gap-3 ${
                    createStatus.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  }`}>
                    {createStatus.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    <p className="font-medium">{createStatus.message}</p>
                  </div>
                )}

                <form onSubmit={createJob} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Título de la vacante" className="md:col-span-2">
                    <input name="title" value={jobForm.title} onChange={updateForm} required placeholder="Ej. Desarrollador Full Stack Senior" className="input" />
                  </FormField>

                  <FormField label="Ubicación">
                    <input name="location" value={jobForm.location} onChange={updateForm} placeholder="Ej. Bogotá, Remoto o Híbrido" className="input" />
                  </FormField>

                  <FormField label="Nivel de inglés">
                    <select name="english_level" value={jobForm.english_level} onChange={updateForm} className="input bg-white">
                      <option value="">No requerido</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </FormField>

                  <FormField label="Salario mínimo COP">
                    <input name="salary_range_min_cop" type="number" value={jobForm.salary_range_min_cop} onChange={updateForm} placeholder="4000000" className="input" />
                  </FormField>

                  <FormField label="Salario máximo COP">
                    <input name="salary_range_max_cop" type="number" value={jobForm.salary_range_max_cop} onChange={updateForm} placeholder="7000000" className="input" />
                  </FormField>

                  <FormField label="Años de experiencia">
                    <input name="experience_years" type="number" min="0" value={jobForm.experience_years} onChange={updateForm} placeholder="3" className="input" />
                  </FormField>

                  <FormField label="Habilidades requeridas">
                    <input name="skills_required" value={jobForm.skills_required} onChange={updateForm} placeholder="React, Node.js, SQL" className="input" />
                  </FormField>

                  <label className="md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <input type="checkbox" name="is_active" checked={jobForm.is_active} onChange={updateForm} className="w-4 h-4 accent-indigo-600" />
                    <span className="font-semibold text-slate-700">Publicar como vacante activa</span>
                  </label>

                  <div className="md:col-span-2 flex justify-end">
                    <button disabled={isCreating} className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 disabled:opacity-60">
                      {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                      Guardar oferta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}

function CandidateDashboard({ session }) {
  const [activeTab, setActiveTab] = useState("hire-match");
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [isLoadingTopMatches, setIsLoadingTopMatches] = useState(false);
  const [topMatchesError, setTopMatchesError] = useState(null);
  const [aspirationalMatches, setAspirationalMatches] = useState([]);
  const [isLoadingAspirations, setIsLoadingAspirations] = useState(false);
  const [aspirationsError, setAspirationsError] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [cvSalary, setCvSalary] = useState("");
  const [cvWorkPreference, setCvWorkPreference] = useState("Remoto");
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [uploadCvStatus, setUploadCvStatus] = useState(null);

  const windows = [
    { id: "hire-match", name: "Hire match", icon: Briefcase },
    { id: "aspirations", name: "Aspiraciones", icon: Target },
    { id: "applications", name: "Mis postulaciones", icon: ClipboardList },
    { id: "upload-cv", name: "Analizar CV", icon: UploadCloud }
  ];

  useEffect(() => {
    const candidateId = session.candidate_id;
    if (!candidateId) {
      setTopMatchesError("No hay perfil de candidato asociado a esta sesión.");
      return;
    }

    const fetchApplications = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/candidate-applications?candidate_id=${candidateId}`);
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Error cargando postulaciones:", err);
      }
    };

    const fetchAspirational = async () => {
      setIsLoadingAspirations(true);
      setAspirationsError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/aspirational-matches?candidate_id=${candidateId}`);
        setAspirationalMatches(res.data.matches || []);
      } catch (err) {
        setAspirationsError(err?.response?.data?.error || "Error al cargar empleos aspiracionales");
      } finally {
        setIsLoadingAspirations(false);
      }
    };

    const fetchTopMatches = async () => {
      setIsLoadingTopMatches(true);
      setTopMatchesError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/top-matches?candidate_id=${candidateId}`);
        setTopMatches(res.data.top_matches || []);
      } catch (err) {
        setTopMatchesError(err?.response?.data?.error || "Error al cargar matches");
      } finally {
        setIsLoadingTopMatches(false);
      }
    };

    fetchApplications();
    fetchAspirational();
    fetchTopMatches();
  }, [session.candidate_id]);

  const handleUploadCv = async (e) => {
  e.preventDefault();
  if (!cvFile) return;

  setIsUploadingCv(true);

  // Simulamos un pequeño delay para que se vea el loading
  setTimeout(() => {
    const resultado = {
      perfil: {
        nombre: session.full_name || "Candidato",
        titulo_profesional: "Profesional en análisis",
        resumen_ia: "Tu CV está siendo procesado. Los resultados reales estarán disponibles cuando el backend esté conectado.",
        años_experiencia: 2,
        nivel: "Intermedio",
      },
      score_total: 72,
      clasificacion: "medio",
      veredicto: "Perfil sólido — conecta el backend para ver tu score real",
      dimensiones: {
        experiencia: 70,
        habilidades_tecnicas: 65,
        formacion: 75,
        presentacion: 78,
        alineacion_cargo: 68,
      },
      habilidades_detectadas: ["React", "Node.js", "PostgreSQL", "Git", "CSS"],
      habilidades_match: ["React", "Node.js", "PostgreSQL"],
      habilidades_gap: ["Docker", "AWS", "CI/CD"],
      recomendaciones: [
        {
          tipo: "tip",
          titulo: "Agrega métricas a tu experiencia",
          detalle: "Cambia descripciones genéricas por logros con números concretos.",
          impacto: "Alto",
        },
        {
          tipo: "course",
          titulo: "Aprende Docker",
          detalle: "Docker es requerido en la mayoría de ofertas tech.",
          impacto: "Alto",
          recurso_url: "https://www.docker.com/get-started/",
        },
        {
          tipo: "warn",
          titulo: "Falta sección de proyectos",
          detalle: "Agregar proyectos personales aumenta tu visibilidad con reclutadores.",
          impacto: "Medio",
        },
      ],
    };

    navigate("/dashboard/resultados", { state: { resultado } });
    setIsUploadingCv(false);
  }, 2000);
};
     
  return (
    <DashboardShell
      windows={windows}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={windows.find((w) => w.id === activeTab)?.name}
      brandLabel="Hire Match"
      brandIcon={LayoutDashboard}
    >
      {activeTab === "hire-match" && (
        <MatchFeed
          title="Top Matches"
          description="Las vacantes más compatibles con tu perfil y habilidades"
          icon={Briefcase}
          iconClassName="from-emerald-500 to-teal-500 shadow-emerald-500/30"
          badgeClassName="bg-emerald-50 text-emerald-700"
          isLoading={isLoadingTopMatches}
          error={topMatchesError}
          jobs={topMatches}
          emptyIcon={Briefcase}
          emptyTitle="No hay matches disponibles"
          emptyDescription="Sigue mejorando tu perfil para conectar con oportunidades."
        />
      )}

      {activeTab === "aspirations" && (
        <MatchFeed
          title="Feed de Crecimiento"
          description="Trabajos desafiantes que impulsarán tu carrera al siguiente nivel"
          icon={TrendingUp}
          iconClassName="from-indigo-500 to-purple-500 shadow-indigo-500/30"
          badgeClassName="bg-indigo-50 text-indigo-700"
          isLoading={isLoadingAspirations}
          error={aspirationsError}
          jobs={aspirationalMatches}
          emptyIcon={Sparkles}
          emptyTitle="No hay retos disponibles ahora"
          emptyDescription="Sigue mejorando tu perfil, pronto encontrarás nuevos desafíos."
          aspirational
        />
      )}

      {activeTab === "applications" && (
        <CandidateApplications applications={applications} />
      )}

      {activeTab === "upload-cv" && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <UploadCloud size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Analizar mi CV</h2>
              <p className="text-slate-500">Sube tu hoja de vida para activar el onboarding inteligente con N8N</p>
            </div>
          </div>

          <form onSubmit={handleUploadCv} className="space-y-6">
            {uploadCvStatus && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${uploadCvStatus.type === "error" ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                {uploadCvStatus.type === "error" ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                <p>{uploadCvStatus.message}</p>
              </div>
            )}

            <FormField label="Archivo CV (PDF)">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" id="cv-upload" required />
                <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud className="w-10 h-10 text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium">
                    {cvFile ? cvFile.name : "Haz clic para seleccionar tu CV (solo PDF)"}
                  </span>
                </label>
              </div>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Expectativa salarial COP">
                <input type="number" value={cvSalary} onChange={(e) => setCvSalary(e.target.value)} placeholder="Ej. 5000000" className="input" required />
              </FormField>
              <FormField label="Preferencia de trabajo">
                <select value={cvWorkPreference} onChange={(e) => setCvWorkPreference(e.target.value)} className="input bg-white" required>
                  <option value="Remoto">Remoto</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </FormField>
            </div>

            <button type="submit" disabled={isUploadingCv || !cvFile} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isUploadingCv ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isUploadingCv ? "Procesando con N8N..." : "Analizar perfil"}
            </button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}

function DashboardShell({ windows, activeTab, setActiveTab, title, brandLabel, brandIcon, children }) {
  const BrandIcon = brandIcon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BrandIcon size={18} />
            </div>
            <span className="font-bold text-slate-800">{brandLabel}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {windows.map((windowItem) => {
            const Icon = windowItem.icon;
            const isActive = activeTab === windowItem.id;

            return (
              <button
                key={windowItem.id}
                onClick={() => setActiveTab(windowItem.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {windowItem.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
          <h1 className="font-bold">{title}</h1>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-slate-50">{children}</div>
      </main>
    </div>
  );
}

function CompanyStats({ summary }) {
  const stats = [
    { label: "Vacantes", value: summary.total_jobs, icon: Briefcase, color: "text-indigo-600" },
    { label: "Activas", value: summary.active_jobs, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Postulaciones", value: summary.total_applications, icon: Users, color: "text-blue-600" },
    { label: "Match promedio", value: `${Math.round(Number(summary.average_match_score || 0))}%`, icon: TrendingUp, color: "text-violet-600" }
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JobList({ jobs, onSelect }) {
  if (!jobs?.length) {
    return <EmptyState icon={Briefcase} title="No hay vacantes publicadas" description="Crea una oferta laboral para empezar a recibir postulaciones." />;
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const skills = job.requirements?.skills_required || job.requirements?.skills || [];
        return (
          <button key={job.job_id} onClick={() => onSelect(job.job_id)} className="w-full text-left border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-slate-900">{job.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${job.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {job.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location || "Sin ubicación"}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatCurrency(job.salary_range_max_cop)}</span>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.slice(0, 5).map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center min-w-[240px]">
                <Metric label="Postulantes" value={job.total_candidates} />
                <Metric label="Nuevos" value={job.new_candidates} />
                <Metric label="Match" value={`${Math.round(Number(job.average_match_score || 0))}%`} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ApplicantList({ applicants }) {
  if (!applicants?.length) {
    return <EmptyState icon={Users} title="Sin postulantes todavía" description="Cuando haya aplicaciones para esta vacante aparecerán aquí." />;
  }

  return (
    <div className="space-y-3">
      {applicants.map((applicant) => {
        const skills = applicant.parsed_cv_data?.skills || applicant.parsed_cv_data?.habilidades || [];
        return (
          <div key={applicant.application_id} className="border border-slate-200 rounded-xl p-4">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900">{applicant.full_name}</h4>
                <p className="text-sm text-slate-500">{applicant.email || "Sin email registrado"}</p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-2">
                  <span>{applicant.location_city || "Sin ciudad"}</span>
                  <span>{formatCurrency(applicant.expected_salary_cop)}</span>
                  <span>Perfil {Math.round(Number(applicant.profile_score || 0))}%</span>
                </div>
                {applicant.match_reason && (
                  <p className="mt-3 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3">{applicant.match_reason}</p>
                )}
                {Array.isArray(skills) && skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.slice(0, 6).map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex xl:flex-col items-center xl:items-end gap-3 shrink-0">
                <span className="text-2xl font-bold text-indigo-600">{Math.round(Number(applicant.match_score || 0))}%</span>
                <StatusBadge status={applicant.status} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentApplicants({ applicants }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Postulantes recientes</h3>
      <ApplicantList applicants={applicants} />
    </div>
  );
}

function StatusDistribution({ rows }) {
  if (!rows?.length) {
    return <EmptyState icon={ClipboardList} title="Sin estados" description="Todavía no hay postulaciones registradas." compact />;
  }

  const total = rows.reduce((sum, row) => sum + Number(row.count || 0), 0);
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const percent = total ? Math.round((Number(row.count) / total) * 100) : 0;
        return (
          <div key={row.status}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-slate-700">{row.status}</span>
              <span className="text-slate-500">{row.count}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MatchFeed({ title, description, icon, iconClassName, badgeClassName, isLoading, error, jobs, emptyIcon, emptyTitle, emptyDescription, aspirational }) {
  const FeedIcon = icon;
  const EmptyIcon = emptyIcon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr flex items-center justify-center shadow-lg ${iconClassName}`}>
          <FeedIcon className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-slate-500">{description}</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingBlock label="Cargando oportunidades..." />
      ) : error ? (
        <ErrorBlock message={error} />
      ) : jobs.length === 0 ? (
        <EmptyState icon={EmptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.job_id} className="bg-white rounded-xl border border-slate-100 p-6 overflow-hidden relative hover:shadow-xl transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${badgeClassName}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {aspirational ? "Empleo Aspiracional" : "Match Exitoso"}
                    </span>
                    <span className="text-slate-400 text-sm">{job.location || "Remoto"}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{job.title}</h3>
                  {aspirational && job.job_salary_max && (
                    <p className="text-slate-500">Salario de hasta: <strong className="text-slate-800">{formatCurrency(job.job_salary_max)}</strong></p>
                  )}
                  {job.match_reason && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4 inline-block w-full text-slate-600 text-sm">{job.match_reason}</div>
                  )}
                  {aspirational && job.missing_skills?.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-4">
                      <p className="text-sm font-semibold text-amber-800 mb-2">Habilidades por fortalecer</p>
                      <div className="flex flex-wrap gap-2">
                        {job.missing_skills.map((skill) => (
                          <span key={skill} className="bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-slate-500">{aspirational ? "Posible Match" : "Compatibilidad"}</p>
                  <p className="text-3xl font-bold text-indigo-600">{Math.round(job.match_score)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateApplications({ applications }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mis postulaciones</h2>
        <p className="text-slate-500">Sigue el estado de cada solicitud en tiempo real</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total enviadas" value={applications.length} />
        <MetricCard label="En revisión" value={applications.filter((a) => a.status === "REVISION").length} color="text-yellow-600" />
        <MetricCard label="Entrevistas" value={applications.filter((a) => a.status === "ENTREVISTA").length} color="text-green-600" />
        <MetricCard label="Oferta" value={applications.filter((a) => a.status === "OFERTA").length} color="text-emerald-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
        <h3 className="text-sm font-semibold mb-4">POSTULACIONES RECIENTES</h3>
        {applications.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Sin postulaciones" description="Cuando apliques a una vacante, aparecerá en esta lista." compact />
        ) : applications.map((app) => (
          <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between border border-slate-200 p-3 mb-2 rounded-lg gap-3">
            <div>
              <p className="font-semibold">{app.title}</p>
              <p className="text-sm text-slate-500">{app.company_email || "Empresa"}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500">{description}</p>
      </div>
      {actionLabel && (
        <button onClick={onAction} className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function FormField({ label, children, className = "" }) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-white border border-slate-200 p-2">
      <p className="font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function MetricCard({ label, value, color = "text-slate-900" }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    ENTREVISTA: "bg-green-100 text-green-700",
    POSTULADO: "bg-yellow-100 text-yellow-700",
    DESCARTADO: "bg-red-100 text-red-700",
    OFERTA: "bg-emerald-100 text-emerald-700",
    REVISION: "bg-blue-100 text-blue-700"
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status || "SIN ESTADO"}
    </span>
  );
}

function EmptyState({ icon, title, description, compact = false }) {
  const EmptyIcon = icon;

  return (
    <div className={`text-center ${compact ? "p-6" : "bg-white p-12 rounded-xl border border-slate-100"}`}>
      <EmptyIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="text-slate-500 mt-1">{description}</p>
    </div>
  );
}

function LoadingBlock({ label, compact = false }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-500 ${compact ? "p-6" : "p-12"}`}>
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function ErrorBlock({ message }) {
  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
