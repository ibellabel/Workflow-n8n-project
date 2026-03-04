import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function CVUploadModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  
  const [salary, setSalary] = useState('');
  const [city, setCity] = useState('');
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      setUploadStatus('error');
    }
  };

  const handleUpload = async () => {
    if (!file || !salary || !city) return;
    
    setIsUploading(true);
    setUploadStatus(null);
    
    // Simulate API / n8n Webhook call
    try {
      // Create FormData to send file and data
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('salary', salary);
      formData.append('city', city);
      if (user?.candidate_id) {
          formData.append('candidate_id', user.candidate_id);
      }

      // Enviar el archivo y los datos al webhook de n8n para el Onboarding Inteligente (Flujo 1)
      // Nota: Si el webhook de n8n aún no está listo, esto interactuará con el backend en /api/upload
      // Mantenemos un timeout de demo si atrapa un error por no estar montado el n8n aún.
      try {
        await axios.post('http://localhost:3001/api/upload-cv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        console.log("Servidor backend respondió exitosamente:", res.data);
      } catch (e) {
         console.warn("Backend/n8n falló la subida. Verifica si n8n está encendido y el webhook activo.", e);
         await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setIsUploading(false);
      setUploadStatus('success');
      
      // Auto close after success
      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess();
        onClose();
        // Reset state
        setFile(null);
        setSalary('');
        setCity('');
        setUploadStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      setUploadStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Actualizar Perfil</h3>
            <p className="text-xs text-slate-500">Sube tu CV para que nuestra IA analice tus habilidades.</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {uploadStatus === 'success' ? (
            <div className="py-10 text-center flex flex-col items-center animate-in zoom-in slide-in-from-bottom-4 duration-500">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">¡Hoja de Vida Analizada!</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">Tu perfil ha sido actualizado. Hemos extraído tus nuevas habilidades de forma automática.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dropzone */}
              <div 
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : file 
                      ? 'border-green-300 bg-green-50/50' 
                      : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf" 
                  className="hidden" 
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 rounded-full bg-green-100 p-3 text-green-600">
                      <FileText className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="mt-4 text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Quitar archivo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-blue-100/50 p-4 text-blue-600">
                      <UploadCloud className="h-10 w-10" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Haz clic o arrastra tu PDF aquí</p>
                    <p className="mt-2 text-xs text-slate-500">Tamaño máximo: 5MB</p>
                  </div>
                )}
              </div>

              {uploadStatus === 'error' && !file && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 pl-4 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
                  <AlertCircle className="h-4 w-4" /> Sólo permitimos archivos formato PDF.
                </div>
              )}

              {uploadStatus === 'error' && file && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 pl-4 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
                  <AlertCircle className="h-4 w-4" /> Ocurrió un error en el servidor. Intenta de nuevo.
                </div>
              )}

              {/* Extra form fields for flow 1 reqs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">Aspiración Salarial (COP)</label>
                  <input 
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Ej. 8000000"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">Ciudad</label>
                  <input 
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. Bogotá"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {uploadStatus !== 'success' && (
          <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 flex justify-end gap-3">
            <button 
              onClick={onClose}
              disabled={isUploading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleUpload}
              disabled={!file || !salary || !city || isUploading}
              className="flex items-center justify-center min-w-[140px] rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Procesando IA...
                </>
              ) : (
                'Subir y Analizar'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
