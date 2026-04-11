import { Star, TrendingUp } from "lucide-react";

export const ScorePreviewCard = () => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl"></div>
      
      <div className="flex justify-between items-start relative z-10 w-full mb-6">
         <div>
           <span className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">Perfil Analizado</span>
           <h3 className="text-white font-bold text-lg">Senior Frontend Developer</h3>
         </div>
         <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
           <Star className="text-green-400 h-3.5 w-3.5 fill-green-400" />
           <span className="text-green-400 text-sm font-bold tracking-wide">Top 5%</span>
         </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-white/70">Magneto AI Score</span>
          <span className="text-white font-bold flex items-center gap-1">
             94/100 <TrendingUp className="h-3 w-3 text-green-400" />
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-green-400 w-[94%] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
        </div>
      </div>
      
      <p className="text-white/80 text-xs leading-relaxed border-l-2 border-blue-400 pl-3">
        Tu experiencia con React y arquitecturas modulares te hace un candidato ideal para 12 vacantes exclusivas actuales.
      </p>
    </div>
  );
};
