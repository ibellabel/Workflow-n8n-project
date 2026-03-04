import { useState, useEffect } from 'react';
import { Building2, Users, Search, Filter, MapPin, Briefcase, Star, ChevronDown, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // In this MVP, we assume the logged in "company" User ID is in user.id
  const companyId = user?.id;

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/empresa/${companyId}/jobs`);
        const fetchedJobs = res.data || [];
        setJobs(fetchedJobs);
        if (fetchedJobs.length > 0) {
          setSelectedJob(fetchedJobs[0]);
        }
      } catch (error) {
        console.error("Error al obtener las vacantes de la empresa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [companyId]);

  useEffect(() => {
    if (!selectedJob) return;

    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/empresa/ranking/${selectedJob.job_id}`);
        setCandidates(res.data?.ranking || []);
      } catch (error) {
        console.error("Error al obtener candidatos:", error);
      }
    };
    fetchCandidates();
  }, [selectedJob]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-indigo-600" />
            Panel de Empresa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona tus vacantes y descubre los mejores talentos analizados por IA.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              className="h-9 w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
              placeholder="Buscar candidato o habilidad..."
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Filter className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Job Listings */}
        <div className="lg:col-span-1 border-r border-slate-200 pr-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" /> Tus Vacantes
          </h2>
          <div className="space-y-3">
            {jobs.length === 0 ? (
               <div className="text-sm text-slate-500 text-center py-4 border border-dashed rounded-xl border-slate-300">No hay vacantes creadas</div>
            ) : jobs.map((job) => (
               <div 
                 key={job.job_id} 
                 onClick={() => setSelectedJob(job)}
                 className={`rounded-xl p-4 cursor-pointer transition-all ${selectedJob?.job_id === job.job_id ? 'border border-indigo-200 bg-indigo-50 relative overflow-hidden' : 'border border-slate-200 hover:border-slate-300 bg-white text-slate-600'}`}
               >
                 {selectedJob?.job_id === job.job_id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>}
                 <h3 className={`text-sm font-bold truncate ${selectedJob?.job_id === job.job_id ? 'text-indigo-900' : 'text-slate-800'}`}>{job.title}</h3>
                 <p className={`text-xs mt-1 flex items-center gap-2 ${selectedJob?.job_id === job.job_id ? 'text-indigo-700/80' : 'text-slate-500'}`}>
                    <span>{job.total_candidates} Candidatos</span>
                    {Number(job.new_candidates) > 0 && <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-sm font-bold text-[10px]">{job.new_candidates} Nuevos</span>}
                 </p>
               </div>
            ))}
            <button className="w-full mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2">
               + Crear Vacante
            </button>
          </div>
        </div>

        {/* Main Content - Candidate List */}
        <div className="lg:col-span-3">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" /> Candidatos para <span className="text-indigo-600">{selectedJob?.title || 'Seleccionar Vacante'}</span>
              </h2>
              <button className="text-sm text-slate-500 flex items-center gap-1 font-medium hover:text-slate-800">
                Ordenar por: <span className="text-slate-900 font-bold flex items-center">Match de IA <ChevronDown className="h-4 w-4" /></span>
              </button>
           </div>
           
           <div className="space-y-4">
             {candidates.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                  Aún no hay candidatos postulados de forma automática.
                </div>
             ) : candidates.map(candidate => {
               const parsedData = candidate.parsed_cv_data || {};
               const skills = parsedData.skills || [];
               const appliedAt = candidate.updated_at ? new Date(candidate.updated_at).toLocaleDateString() : 'Ayer';
               
               return (
               <div key={candidate.candidate_id} className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-6">
                  {/* Score Gauge */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-100 pr-6">
                     <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-green-50">
                        <svg className="absolute inset-0 h-full w-full rotate-[-90deg] text-green-200" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${candidate.match_score}, 100`} />
                        </svg>
                        <span className="text-lg font-black text-green-700">{candidate.match_score}</span>
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">IA Match</span>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-grow">
                     <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {candidate.full_name} 
                            {candidate.match_score > 90 && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                          </h3>
                          <p className="text-sm font-medium text-slate-600">{parsedData.role || 'Rol Desconocido'}</p>
                        </div>
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/20">
                          {candidate.status}
                        </span>
                     </div>
                     
                     <div className="mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {candidate.location_city || 'Remoto'}</span>
                        <span className="flex items-center gap-1 text-slate-400">Aplicó: {appliedAt}</span>
                     </div>

                     <div className="mt-3 flex flex-wrap gap-2">
                        {skills.slice(0, 5).map(skill => (
                          <span key={skill} className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                            {skill}
                          </span>
                        ))}
                        {skills.length > 5 && <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-medium text-slate-400">+{skills.length - 5}</span>}
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-row md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 pl-0 md:pl-6">
                     <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm focus:ring-2 focus:ring-indigo-500/50 transition-colors">
                       <CheckCircle className="h-4 w-4" /> Avanzar
                     </button>
                     <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                       <XCircle className="h-4 w-4" /> Descartar
                     </button>
                  </div>
               </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
}
