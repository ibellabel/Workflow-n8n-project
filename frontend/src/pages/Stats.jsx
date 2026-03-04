import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Target, Activity, Zap, TrendingUp, Users, BrainCircuit, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Stats() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const candidateId = user?.candidate_id;

  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/stats?candidate_id=${candidateId}`);
        setStatsData(res.data?.stats);
      } catch (error) {
        console.error("Error al obtener stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const s = statsData || { POSTULADO: 0, ENTREVISTA: 0, DESCARTADO: 0, TOTAL: 0 };
  const winRate = s.TOTAL > 0 ? Math.round((s.ENTREVISTA / s.TOTAL) * 100) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Activity className="h-8 w-8 text-indigo-600" />
          Métricas y Estadísticas
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Analiza el rendimiento de tu perfil frente al mercado laboral y las acciones tomadas por la IA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
               <Target className="h-5 w-5" />
             </div>
             <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Win Rate</h3>
           </div>
           <p className="text-4xl font-black text-slate-900">{winRate}<span className="text-2xl text-slate-400 font-medium">%</span></p>
           <p className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1">
             <TrendingUp className="h-3.5 w-3.5 text-green-500" /> Conversión a Entrevistas
           </p>
        </div>
        
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
               <BrainCircuit className="h-5 w-5" />
             </div>
             <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Postulaciones</h3>
           </div>
           <p className="text-4xl font-black text-slate-900">{s.TOTAL}</p>
           <p className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1">
             <TrendingUp className="h-3.5 w-3.5 text-green-500" /> Actividad Histórica
           </p>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
               <Zap className="h-5 w-5" />
             </div>
             <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">En Proceso</h3>
           </div>
           <p className="text-4xl font-black text-slate-900">{s.ENTREVISTA}</p>
           <p className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1">
             <span className="text-amber-600">Postulaciones</span> en etapa avanzada
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" /> Actividad Reciente
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData?.history || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="matches" name="Nuevos Matches" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMatches)" />
                <Line type="monotone" dataKey="postulaciones" name="Auto-Postulaciones" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" /> Demanda de tu Stack
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData?.skillsDemand || []} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="demand" name="Demanda %" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
