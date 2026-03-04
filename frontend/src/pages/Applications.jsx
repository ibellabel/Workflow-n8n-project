import { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, Search, Filter, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Applications() {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const candidateId = user?.candidate_id;

  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/applications/${candidateId}`);
        setAppliedJobs(res.data || []);
      } catch (error) {
        console.error("Error al obtener postulaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [candidateId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ENTREVISTA':
        return <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/20">Entrevista Activa</span>;
      case 'DESCARTADO':
        return <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20">Descartado</span>;
      case 'POSTULADO':
        return <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/30">En Revisión</span>;
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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-indigo-600" />
            Mis Postulaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Seguimiento detallado de los procesos en los que estás participando.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              className="h-9 w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
              placeholder="Buscar empresa o rol..."
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Filter className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-12 md:col-span-5">Detalle del Rol</div>
          <div className="hidden md:block md:col-span-2">Aplicación</div>
          <div className="hidden md:block md:col-span-2 text-center">IA Match</div>
          <div className="col-span-12 md:col-span-3 text-right">Estado</div>
        </div>
        
        {/* Table Body */}
        <div className="divide-y divide-slate-100 min-h-[50vh]">
          {appliedJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              Aún no tienes postulaciones registradas en el sistema.
            </div>
          ) : appliedJobs.map((app) => (
            <div key={app.id} className="grid grid-cols-12 gap-4 items-center px-6 py-5 hover:bg-slate-50/50 transition-colors group">
              {/* Role details */}
              <div className="col-span-12 md:col-span-5 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100/80 text-slate-500 border border-slate-200 group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-sm transition-all">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{app.title}</h3>
                  <p className="text-sm font-medium text-slate-600">{app.company_email || 'Empresa'}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {app.location || 'Remoto'}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${app.salary_range_max_cop ? Number(app.salary_range_max_cop).toLocaleString('es-CO') : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="hidden md:flex md:col-span-2 flex-col justify-center">
                <span className="flex items-center gap-1.5 text-sm text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {new Date(app.date_applied).toLocaleDateString()}
                </span>
                <span className="mt-1 text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                  {app.via || 'Auto-Postulación (n8n)'}
                </span>
              </div>

              {/* Match Score */}
              <div className="hidden md:flex md:col-span-2 justify-center items-center">
                 <div className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${getScoreColor(app.match_score)}`}>
                   {app.match_score}%
                 </div>
              </div>

              {/* Status */}
              <div className="col-span-12 md:col-span-3 flex justify-between md:justify-end items-center md:flex-col md:items-end gap-2">
                <div className="md:hidden flex items-center gap-2">
                   <div className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${getScoreColor(app.match_score)}`}>
                     {app.match_score}% Match
                   </div>
                </div>
                {getStatusBadge(app.status)}
                
                {app.status === 'ENTREVISTA' && (
                  <button className="hidden md:block mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    Ver mensajes
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
