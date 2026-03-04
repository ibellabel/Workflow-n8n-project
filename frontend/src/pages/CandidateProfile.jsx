import { useState, useEffect } from 'react';
import { Upload, CheckCircle, FileText, Briefcase, MapPin, Edit3, Loader2 } from 'lucide-react';
import axios from 'axios';
import CVUploadModal from '../components/profile/CVUploadModal';
import { useAuth } from '../context/AuthContext';

export default function CandidateProfile() {
  const { user } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const candidateId = user?.candidate_id;

  const fetchProfile = async () => {
    if (!candidateId) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(`http://localhost:3001/api/profile/${candidateId}`);
      setProfileData(res.data);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Si no hay datos, mostraremos al menos el UI base o valores por defecto
  const data = profileData || {};

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mi Perfil Profesional</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona tus habilidades, aspiraciones y visualiza tu score en el mercado actual.
          </p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500/50"
        >
          <Upload className="h-4 w-4" />
          Subir / Actualizar CV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - main profile info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit3 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 leading-none to-blue-50 text-3xl font-bold text-indigo-600 ring-1 ring-inset ring-indigo-500/20 shadow-inner">
                {data.full_name ? data.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '👤'}
              </div>
              <div className="pt-1">
                <h2 className="text-2xl font-bold text-slate-900">{data.full_name || 'Agrega tu nombre'}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-slate-400" /> {data.parsed_cv_data?.role || 'Rol sin especificar'}</span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" /> {data.location_city || 'Ciudad sin especificar'}</span>
                </div>
                
                <div className="mt-5 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Habilidades Destacadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.parsed_cv_data?.skills?.length > 0 ? (
                      data.parsed_cv_data.skills.map(skill => (
                        <span key={skill} className="rounded-lg bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 transition-colors cursor-default">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">Sube tu CV para extraer habilidades IA automáticamente.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl group hover:border-indigo-200 transition-colors">
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                 <FileText className="h-5 w-5" />
               </div>
               Tu Análisis de IA
             </h3>
             <div className="mt-4 rounded-xl bg-slate-50/50 p-4 border border-slate-100">
               <p className="text-sm leading-relaxed text-slate-600">
                 {data.feedback_notes || 'Sube tu hoja de vida primero. La Inteligencia Artificial analizará tu perfil y dejará aquí sus notas...'}
               </p>
             </div>
          </div>
        </div>

        {/* Right column - Score and Quick actions */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm relative group cursor-pointer transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 opacity-50 blur-2xl z-0 transition-transform group-hover:scale-110"></div>
            
            <div className="p-6 relative z-10 text-center">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Magneto Match Score</h3>
              
              <div className="mt-6 flex flex-col items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] ring-1 ring-slate-100">
                  <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-slate-100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    {/* Progress Circle (85%) */}
                    <path
                      className="text-indigo-600 transition-all duration-1000 ease-out"
                      strokeDasharray="85, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center justify-center pt-1">
                    <span className="text-4xl font-extrabold tracking-tighter text-slate-900">{data.profile_score || 0}<span className="text-xl text-slate-400 font-medium">%</span></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mt-1">{data.profile_score ? 'Cálculo IA' : 'Sin Score'}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                <CheckCircle className="h-3.5 w-3.5" />
                Perfil Altamente Competitivo
              </div>
              
              <p className="mt-4 text-xs text-slate-500 leading-relaxed px-2">
                Basado en 245 vacantes activas en roles similares durante los últimos 30 días.
              </p>
            </div>
          </div>
          
          {/* Preferences Widget */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
             <h4 className="text-sm font-bold text-slate-900 mb-4">Aspiraciones Actuales</h4>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs font-medium mb-1">
                   <span className="text-slate-500">Salario Base (COP)</span>
                   <span className="text-slate-900">{data.expected_salary_cop ? '$' + Number(data.expected_salary_cop).toLocaleString('es-CO') : 'No definido'}</span>
                 </div>
                 <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full w-4/5"></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-medium mb-1">
                   <span className="text-slate-500">Modalidad Ideal</span>
                   <span className="text-slate-900">100% Remoto</span>
                 </div>
                 <div className="flex gap-1 mt-1">
                   <div className="h-1.5 w-1/3 rounded-full bg-indigo-500"></div>
                   <div className="h-1.5 w-1/3 rounded-full bg-slate-200"></div>
                   <div className="h-1.5 w-1/3 rounded-full bg-slate-200"></div>
                 </div>
               </div>
             </div>
             <button className="mt-5 w-full rounded-xl bg-slate-50 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
               Ajustar Preferencias
             </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CVUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadSuccess={fetchProfile}
      />
    </div>
  );
}
