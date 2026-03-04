import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Building2, TrendingUp, Sparkles, Navigation, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


export default function Dashboard() {
  const { user } = useAuth();
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const candidateId = user?.candidate_id;

  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [topMatchesRes, appsRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/top-matches?candidate_id=${candidateId}`),
          axios.get(`http://localhost:3001/api/applications/${candidateId}`)
        ]);
        
        setSuggestedJobs(topMatchesRes.data?.top_matches || []);
        // Take only top 3 recent applications for the dashboard widget
        setAppliedJobs((appsRes.data || []).slice(0, 3));
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [candidateId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ENTREVISTA':
        return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Entrevista Activa</span>;
      case 'DESCARTADO':
        return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Descartado</span>;
      case 'POSTULADO':
        return <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">En Revisión</span>;
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 ring-green-600/20';
    if (score >= 80) return 'text-blue-600 bg-blue-50 ring-blue-600/20';
    if (score >= 70) return 'text-amber-600 bg-amber-50 ring-amber-600/20';
    return 'text-red-600 bg-red-50 ring-red-600/20';
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard de Vacantes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Descubre oportunidades con alto nivel de compatibilidad gracias a nuestro algoritmo de IA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Suggested Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-indigo-500" />
               Vacantes Sugeridas (Magneto Match)
             </h2>
             <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver todas</button>
          </div>

          <div className="space-y-4">
            {suggestedJobs.length === 0 ? (
               <div className="text-center py-8 text-slate-500">No hay vacantes sugeridas en este momento.</div>
            ) : suggestedJobs.map((job) => (
              <div key={job.job_id} className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all hover:shadow-md hover:border-indigo-200 group">
                {/* Match Score Badge */}
                <div className="absolute top-5 right-5 flex flex-col items-end">
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${getScoreColor(job.matchScore)}`}>
                    <TrendingUp className="h-3.5 w-3.5" />
                    {job.matchScore}% Match
                  </div>
                  <span className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">{job.postedAt}</span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-slate-500 border border-slate-200 ring-1 ring-white shadow-inner">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="pr-20"> {/* Padding right to avoid overlap with absolute badge */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase-first">{job.title}</h3>
                    <p className="text-sm font-medium text-slate-600">{job.company || 'Empresa Confidencial'}</p>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location || 'Remoto'}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${job.salary_range_max_cop ? Number(job.salary_range_max_cop).toLocaleString('es-CO') : 'N/A'}</span>
                      <span className="flex items-center gap-1"><BrifecaseIcon type={job.type || 'Tiempo Completo'} /> {job.type || 'Tiempo Completo'}</span>
                    </div>
                  </div>
                </div>

                {/* Match Reason AI Box */}
                <div className="mt-5 rounded-xl bg-indigo-50/50 p-3.5 border border-indigo-100/50 flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-indigo-100 p-1 text-indigo-600">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-900">¿Por qué este rol es para ti?</h4>
                    <p className="mt-0.5 text-sm text-indigo-800/80 leading-relaxed">{job.matchReason}</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 shadow-sm shadow-slate-900/20 focus:ring-2 focus:ring-slate-900/40">
                    Postulación Rápida (n8n Auto)
                  </button>
                  <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Track Applications */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-500" />
            Mis Postulaciones
          </h2>

          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-1 shadow-sm backdrop-blur-xl">
             <div className="flex flex-col">
               {appliedJobs.length === 0 ? (
                 <div className="p-4 text-center text-sm text-slate-500">Sin postulaciones recientes</div>
               ) : appliedJobs.map((app, idx) => (
                 <div key={app.id} className={`p-4 ${idx !== appliedJobs.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50/50 transition-colors cursor-pointer group rounded-xl`}>
                   <div className="flex justify-between items-start mb-1">
                     <h4 className="text-sm font-bold text-slate-900 truncate pr-4">{app.title}</h4>
                     {getStatusBadge(app.status)}
                   </div>
                   <div className="flex justify-between items-end mt-2">
                     <div>
                       <p className="text-xs font-medium text-slate-600">{app.company_email || 'Empresa'}</p>
                       <p className="text-[10px] text-slate-400 mt-0.5">Aplicado: {new Date(app.date_applied).toLocaleDateString()}</p>
                     </div>
                     <div className="text-right">
                       <span className="text-xs font-bold text-indigo-600">{app.match_score}% Match</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl text-center">
               <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Explorar historial completo →</button>
             </div>
          </div>
          
          {/* Quick Stats Widget */}
          <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-blue-600 to-indigo-700 p-5 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
             <h3 className="text-sm font-medium text-blue-100">Resumen Semanal</h3>
             <div className="mt-4 grid grid-cols-2 gap-4">
               <div>
                 <p className="text-3xl font-bold">{suggestedJobs.length}</p>
                 <p className="text-xs text-blue-200 mt-1">Nuevos Matches</p>
               </div>
               <div>
                 <p className="text-3xl font-bold">{appliedJobs.length}</p>
                 <p className="text-xs text-blue-200 mt-1">Recientes</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple helper component for icons
function BrifecaseIcon({ type }) {
  if (type.includes('Tiempo Completo')) return <Briefcase className="h-3.5 w-3.5" />;
  if (type.includes('Freelance')) return <Clock className="h-3.5 w-3.5" />;
  return <Briefcase className="h-3.5 w-3.5" />;
}
