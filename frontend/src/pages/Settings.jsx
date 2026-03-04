import { useState } from 'react';
import { Settings as SettingsIcon, Zap, Globe, DollarSign, Plane, Bot, Shield, Save, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [preferences, setPreferences] = useState({
    modality: 'Remoto',
    salary: '8000000',
    travel: 'No',
  });

  const [toggles, setToggles] = useState({
    autoApply: true,
    emailAlerts: true,
    weeklyDigest: true, // HU21 related
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setSaved(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configuración & Preferencias</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ajusta los parámetros para que el Agente IA de Magneto busque exactamente lo que quieres.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all disabled:opacity-70"
        >
          {isSaving ? <Zap className="h-4 w-4 animate-pulse text-yellow-400" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar Cambios'}
        </button>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 pl-4 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          Tus preferencias y configuraciones automáticas se han actualizado correctamente en el sistema.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Work Preferences (HU11) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <SettingsIcon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Preferencias Laborales</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                  <Globe className="h-4 w-4 text-slate-400" />
                  Modalidad de Trabajo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Remoto', 'Híbrido', 'Presencial'].map(modo => (
                    <button
                      key={modo}
                      onClick={() => setPreferences({ ...preferences, modality: modo })}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        preferences.modality === modo
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {modo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  Salario Mínimo Esperado (COP)
                </label>
                <input
                  type="number"
                  value={preferences.salary}
                  onChange={(e) => setPreferences({ ...preferences, salary: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                />
                <p className="mt-1 text-xs text-slate-400">Descarta ofertas por debajo de este valor automáticamente.</p>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                  <Plane className="h-4 w-4 text-slate-400" />
                  Disponibilidad para Viajar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sí', 'No'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setPreferences({ ...preferences, travel: opt })}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        preferences.travel === opt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt === 'Sí' ? 'Ocasionalmente' : 'Prefiero no viajar'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Automation Settings (HU14 & HU21) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 opacity-10 blur-xl"></div>
            
            <div className="border-b border-indigo-100 bg-white/50 px-6 py-4 flex items-center gap-3 backdrop-blur-sm relative z-10">
              <div className="rounded-lg bg-indigo-600 p-2 text-white shadow-sm shadow-indigo-600/20">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-indigo-950">Agente Autopilot</h2>
            </div>
            
            <div className="p-6 space-y-6 relative z-10">
              {/* Toggle 1: Auto-Apply N8N */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Auto-Postulación Inteligente</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed pr-6">
                    El agente n8n evaluará las vacantes diarias. Si encuentra un <span className="font-semibold text-indigo-600">Match &gt; 85%</span>, enviará tu CV automáticamente a la empresa.
                  </p>
                </div>
                <button 
                  onClick={() => setToggles({ ...toggles, autoApply: !toggles.autoApply })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    toggles.autoApply ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    toggles.autoApply ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 2: Real-time alerts */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Alertas de Match Inmediatas</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed pr-6">
                    Te enviamos un email apenas encontremos una oportunidad altamente compatible, sin necesidad de esperar al cierre diario.
                  </p>
                </div>
                <button 
                  onClick={() => setToggles({ ...toggles, emailAlerts: !toggles.emailAlerts })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    toggles.emailAlerts ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    toggles.emailAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 3: Re-engagement (Weekly Digest) */}
               <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Resumen Semanal de Actividad</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed pr-6">
                    Recibe un informe si llevas tiempo sin actividad, con el Top de vacantes que el agente te guardó mientras estabas fuera.
                  </p>
                </div>
                <button 
                  onClick={() => setToggles({ ...toggles, weeklyDigest: !toggles.weeklyDigest })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    toggles.weeklyDigest ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    toggles.weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-t border-indigo-100 flex items-start gap-3 relative z-10">
               <Shield className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
               <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
                 Tus datos siempre estarán protegidos. Solo compartimos tu CV anonimizado hasta que apruebes una entrevista formalmente con la empresa reclutadora.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
