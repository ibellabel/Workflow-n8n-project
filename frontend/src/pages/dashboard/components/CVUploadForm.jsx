import { useState } from "react";
import axios from "axios";
import { supabase } from "../../../../lib/supabaseClient";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, DollarSign, MapPin, Briefcase } from "lucide-react";

export const CVUploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [modality, setModality] = useState("Remoto");
  const [city, setCity] = useState("Bogotá"); // Ciudad por defecto si se requiere en el form, aunque la extraerá el CV
  
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Por favor selecciona un archivo PDF.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      const { data: { user } } = await supabase.auth.getUser();
      const candidateId = user?.id || "55555555-5555-5555-5555-555555555555";

      const formData = new FormData();
      formData.append("cv", file);
      formData.append("candidate_id", candidateId);
      formData.append("salary", expectedSalary);
      formData.append("city", city); 
      formData.append("modality", modality);

      const response = await axios.post("http://localhost:3001/api/upload-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setStatus("success");
      if (onUploadSuccess) onUploadSuccess();
      
    } catch (error) {
      console.error("Error uploading CV:", error);
      setStatus("error");
      setErrorMessage(error?.response?.data?.error || "Ocurrió un error al subir el CV.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-emerald-800 mb-2">¡CV Analizado con Éxito!</h3>
        <p className="text-emerald-600">Nuestra IA ha extraído tus habilidades y actualizado tu perfil. Ahora puedes revisar tus Matches.</p>
        <button 
          onClick={() => setStatus("idle")} 
          className="mt-6 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Subir otro documento
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Completa tu Perfil</h2>
        <p className="text-slate-500 mt-1">Sube tu CV en PDF y cuéntanos tus preferencias para hacer un mejor match.</p>
      </div>

      {status === "error" && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* File Upload Area */}
        <div className="group relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Currículum (PDF)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer relative overflow-hidden group-focus-within:border-indigo-500 group-focus-within:ring-4 group-focus-within:ring-indigo-500/10">
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-700 font-semibold">{file ? file.name : "Haz clic para subir o arrastra tu PDF aquí"}</p>
                <p className="text-slate-400 text-sm mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Tamaño máximo: 5MB"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salario Esperado */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Expectativa Salarial (COP)</label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input 
                type="number" 
                required
                min="0"
                step="100000"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="Ej. 4500000"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 transition-all font-medium"
              />
            </div>
          </div>

          {/* Preferencia de Trabajo */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Modalidad de Trabajo</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <select 
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 transition-all font-medium appearance-none bg-white"
              >
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === "loading" || !file || !expectedSalary}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center mt-8 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Analizando con IA...
            </>
          ) : (
            "Subir CV y Guardar Preferencias"
          )}
        </button>

      </form>
    </div>
  );
};
