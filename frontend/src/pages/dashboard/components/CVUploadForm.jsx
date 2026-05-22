import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

function scoreColor(score) {
  if (score >= 75) return "#4CC9A4";
  if (score >= 50) return "#F5A623";
  return "#E24B4A";
}

function clasificacionLabel(score) {
  if (score >= 75) return "Perfil competitivo";
  if (score >= 50) return "Perfil en desarrollo";
  return "Requiere mejoras";
}

function clasificacionColors(score) {
  if (score >= 75) return { bg: "#E1F5EE", text: "#0F6E56" };
  if (score >= 50) return { bg: "#FEF3C7", text: "#92400E" };
  return { bg: "#FEE2E2", text: "#991B1B" };
}

function formatCurrency(value) {
  if (!value) return "No definido";
  return `$${Number(value).toLocaleString("es-CO")} COP`;
}

function unwrapPayload(payload) {
  if (Array.isArray(payload)) return unwrapPayload(payload[0]);
  if (payload?.json) return unwrapPayload(payload.json);
  if (payload?.response) return unwrapPayload(payload.response);
  return payload || {};
}

function parseWorkPreference(workPreferences) {
  if (!workPreferences) return "";

  if (typeof workPreferences !== "string") {
    return workPreferences.modalidad || workPreferences.modality || workPreferences.preference || "";
  }

  try {
    const parsed = JSON.parse(workPreferences);
    return parsed.modalidad || parsed.modality || parsed.preference || workPreferences;
  } catch {
    return workPreferences.replace(/^"|"$/g, "");
  }
}

function normalizeUploadResult({ uploadResponse, profile, fallback }) {
  const flowData = unwrapPayload(uploadResponse);
  const parsedCvData = flowData.parsed_cv_data || profile?.parsed_cv_data || {};
  const skills = parsedCvData.skills || parsedCvData.habilidades || flowData.skills || [];
  const score = Number(flowData.profile_score ?? flowData.score ?? profile?.profile_score ?? 0);
  const experienceYears = parsedCvData.experience_years ?? parsedCvData.years_experience ?? parsedCvData.experiencia_anios;
  const educationLevel = parsedCvData.education_level || parsedCvData.education || parsedCvData.nivel_educativo || "";
  const locationCity = flowData.location_city || profile?.location_city || fallback.locationCity || "";

  return {
    fullName: flowData.full_name || profile?.full_name || fallback.fullName || "Perfil actualizado",
    email: flowData.email || profile?.email || fallback.email || "",
    role: parsedCvData.role || parsedCvData.cargo || flowData.role || "Perfil profesional actualizado",
    summary: parsedCvData.summary || parsedCvData.resumen || "El flujo de n8n procesó tu CV y actualizó los datos clave de tu perfil para mejorar tus matches.",
    locationCity,
    expectedSalaryCop: flowData.expected_salary_cop || profile?.expected_salary_cop || fallback.salary,
    workPreference: fallback.workPreference || parseWorkPreference(profile?.work_preferences),
    educationLevel,
    experienceYears,
    profileScore: score,
    skills: Array.isArray(skills) ? skills.filter(Boolean) : [],
    debugInfo: parsedCvData.debug_info
  };
}

function buildDimensions(result) {
  const skillsScore = Math.min(100, Math.max(35, result.skills.length * 12));
  const experienceScore = result.experienceYears ? Math.min(100, 55 + Number(result.experienceYears) * 8) : 35;
  const educationScore = result.educationLevel ? 72 : 38;
  const presentationScore = result.debugInfo && result.debugInfo !== "OK" ? 55 : 78;
  const alignmentScore = result.profileScore || Math.round((skillsScore + experienceScore + educationScore) / 3);

  return {
    experiencia: Math.round(experienceScore),
    habilidades_tecnicas: Math.round(skillsScore),
    formacion: Math.round(educationScore),
    presentacion: Math.round(presentationScore),
    alineacion_cargo: Math.round(alignmentScore)
  };
}

function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(0);
  const normalizedScore = Math.max(0, Math.min(100, Number(score || 0)));
  const color = scoreColor(normalizedScore);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (animated / 100) * circ;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(normalizedScore), 200);
    return () => clearTimeout(t);
  }, [normalizedScore]);

  return (
    <div style={{ position: "relative", width: 130, height: 130 }}>
      <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <span style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{normalizedScore || "--"}</span>
        <span style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
}

function DimensionBar({ label, value, delay }) {
  const [width, setWidth] = useState(0);
  const color = scoreColor(value);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
      </div>
      <div style={{ height: 7, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${width}%`,
          background: color,
          borderRadius: 99,
          transition: "width 0.9s cubic-bezier(.4,0,.2,1)"
        }} />
      </div>
    </div>
  );
}

function SkillChip({ label, variant = "detected" }) {
  const styles = {
    detected: { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" },
    match: { bg: "#E1F5EE", text: "#0F6E56", border: "#6EE7B7" },
    gap: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" }
  };
  const s = styles[variant];
  const prefix = variant === "match" ? "✓ " : variant === "gap" ? "- " : "";

  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 99,
      fontSize: 12,
      background: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      margin: 3
    }}>
      {prefix}{label}
    </span>
  );
}

function InfoPill({ label, value }) {
  return (
    <div>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{value}</span>
      <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 4 }}>{label}</span>
    </div>
  );
}

export const CVUploadForm = ({ apiBaseUrl = DEFAULT_API_BASE_URL, session, onUploadSuccess, onViewMatches }) => {
  const [file, setFile] = useState(null);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [workPreference, setWorkPreference] = useState("Remoto");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  const candidateId = useMemo(() => {
    if (session?.candidate_id) return session.candidate_id;

    try {
      return JSON.parse(localStorage.getItem("hire_match_session"))?.candidate_id;
    } catch {
      return null;
    }
  }, [session]);

  const dimensions = result ? buildDimensions(result) : null;
  const score = result && dimensions
    ? result.profileScore || Math.round((dimensions.experiencia + dimensions.habilidades_tecnicas) / 2)
    : 0;
  const clsColors = clasificacionColors(score);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setErrorMessage("");
    setStatus("idle");
  };

  const loadFreshProfile = async () => {
    if (!candidateId) return null;

    try {
      const { data } = await axios.get(`${apiBaseUrl}/profile/${candidateId}`);
      return data;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Por favor selecciona un archivo PDF.");
      setStatus("error");
      return;
    }

    if (!candidateId) {
      setErrorMessage("No hay un perfil de candidato asociado a esta sesión.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      const formData = new FormData();
      formData.append("cv", file);
      formData.append("candidate_id", candidateId);
      formData.append("salary", expectedSalary);
      formData.append("work_preference", workPreference);

      const { data } = await axios.post(`${apiBaseUrl}/upload-cv`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const profile = await loadFreshProfile();

      setResult(normalizeUploadResult({
        uploadResponse: data,
        profile,
        fallback: {
          fullName: session?.full_name,
          email: session?.email,
          salary: expectedSalary,
          workPreference
        }
      }));
      setStatus("success");
      onUploadSuccess?.();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error?.response?.data?.details || error?.response?.data?.error || error.message || "Ocurrió un error al subir el CV.");
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage("");
  };

  const handleViewMatches = () => {
    onUploadSuccess?.();
    onViewMatches?.();
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .resultado-page * { box-sizing: border-box; }
        .resultado-upload-input {
          width: 100%; border: 1px solid #CBD5E1; border-radius: 10px;
          padding: 11px 13px; font-size: 13px; color: #0F172A;
          background: white; outline: none;
        }
        .resultado-upload-input:focus {
          border-color: #1A4FBD; box-shadow: 0 0 0 3px #DBEAFE;
        }
        .resultado-page .btn-primary {
          background: #1A4FBD; color: white; border: none;
          border-radius: 10px; padding: 11px 20px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }
        .resultado-page .btn-primary:hover { background: #0D3A8C; }
        .resultado-page .btn-primary:active { transform: scale(0.98); }
        .resultado-page .btn-primary:disabled {
          opacity: 0.6; cursor: not-allowed; transform: none;
        }
        .resultado-page .btn-outline {
          background: white; color: #1A4FBD;
          border: 1.5px solid #1A4FBD; border-radius: 10px;
          padding: 10px 20px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
        }
        .resultado-page .btn-outline:hover { background: #EFF6FF; }
        .resultado-page .card {
          background: white; border: 1px solid #E5E7EB;
          border-radius: 16px; padding: 20px 22px;
        }
        .resultado-page .section-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #94A3B8; margin-bottom: 12px;
        }
        @media (max-width: 900px) {
          .resultado-main-grid,
          .resultado-upload-grid,
          .resultado-skills-grid {
            grid-template-columns: 1fr !important;
          }
          .resultado-header {
            align-items: flex-start !important;
            flex-direction: column;
          }
        }
      `}</style>

      <div
        className="resultado-page"
        style={{
          background: "#F7F9FC",
          padding: "28px 32px",
          animation: "fadeIn 0.3s ease",
          borderRadius: 16
        }}
      >
        <div className="resultado-header" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 28
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: 0 }}>
              Resultados del análisis
            </h1>
            <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>
              CV analizado con el flujo inteligente de n8n
            </p>
          </div>

          {status === "success" && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn-outline" type="button" onClick={resetForm}>
                ← Subir otro CV
              </button>
              <button className="btn-primary" type="button" onClick={handleViewMatches}>
                Ver vacantes →
              </button>
            </div>
          )}
        </div>

        {status !== "success" && (
          <div className="card" style={{ maxWidth: 820, margin: "0 auto" }}>
            <p className="section-label">Subida de CV</p>
            <form onSubmit={handleSubmit}>
              {status === "error" && (
                <div style={{
                  background: "#FEE2E2",
                  color: "#991B1B",
                  border: "1px solid #FECACA",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 13,
                  marginBottom: 16
                }}>
                  {errorMessage}
                </div>
              )}

              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  Currículum (PDF)
                </span>
                <div style={{
                  border: "1.5px dashed #CBD5E1",
                  borderRadius: 16,
                  background: "#F8FAFC",
                  padding: 28,
                  textAlign: "center",
                  position: "relative"
                }}>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                  />
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    color: "#1A4FBD",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 10px",
                    fontWeight: 700
                  }}>
                    ↑
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", margin: "0 0 4px" }}>
                    {file ? file.name : "Haz clic para subir o arrastra tu PDF aquí"}
                  </p>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Tamaño máximo: 5MB"}
                  </p>
                </div>
              </label>

              <div className="resultado-upload-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <label>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Expectativa Salarial (COP)
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100000"
                    value={expectedSalary}
                    onChange={(event) => setExpectedSalary(event.target.value)}
                    placeholder="Ej. 4500000"
                    className="resultado-upload-input"
                  />
                </label>

                <label>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Modalidad de Trabajo
                  </span>
                  <select
                    value={workPreference}
                    onChange={(event) => setWorkPreference(event.target.value)}
                    className="resultado-upload-input"
                  >
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading" || !file || !expectedSalary}
                className="btn-primary"
                style={{ width: "100%" }}
              >
                {status === "loading" ? "Analizando con n8n..." : "Subir CV y guardar preferencias"}
              </button>
            </form>
          </div>
        )}

        {status === "success" && result && dimensions && (
          <>
            <div className="resultado-main-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr",
              gap: 16,
              marginBottom: 16
            }}>
              <div className="card">
                <p className="section-label">Puntaje general</p>
                <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
                  <ScoreRing score={score} />
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 700,
                      background: clsColors.bg,
                      color: clsColors.text,
                      marginBottom: 8
                    }}>
                      {clasificacionLabel(score)}
                    </span>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                      Perfil actualizado con los datos extraídos del CV y listo para recalcular oportunidades compatibles.
                    </p>
                    <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                      <InfoPill label="años exp." value={result.experienceYears ?? 0} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#4F46E5",
                        background: "#F5F3FF",
                        padding: "3px 10px",
                        borderRadius: 8
                      }}>
                        {result.educationLevel || "Formación no detectada"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 2px" }}>
                    {result.fullName}
                  </p>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                    {result.role}
                  </p>
                </div>

                <div style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "#F8FAFC",
                  borderRadius: 10,
                  borderLeft: "3px solid #1A4FBD"
                }}>
                  <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                    {result.summary}
                  </p>
                </div>
              </div>

              <div className="card">
                <p className="section-label">Desglose del score</p>
                <DimensionBar label="Experiencia laboral" value={dimensions.experiencia} delay={0} />
                <DimensionBar label="Habilidades técnicas" value={dimensions.habilidades_tecnicas} delay={80} />
                <DimensionBar label="Formación académica" value={dimensions.formacion} delay={160} />
                <DimensionBar label="Presentación del CV" value={dimensions.presentacion} delay={240} />
                <DimensionBar label="Alineación al perfil" value={dimensions.alineacion_cargo} delay={320} />

                <div style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: "1px solid #F3F4F6",
                  fontSize: 11,
                  color: "#94A3B8",
                  flexWrap: "wrap"
                }}>
                  {[
                    { color: "#4CC9A4", label: "75-100 Excelente" },
                    { color: "#F5A623", label: "50-74 Bueno" },
                    { color: "#E24B4A", label: "0-49 Mejorar" }
                  ].map((legend) => (
                    <div key={legend.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: legend.color }} />
                      {legend.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <p className="section-label">Habilidades</p>
              <div className="resultado-skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Detectadas en tu CV
                  </p>
                  {result.skills.length > 0 ? result.skills.map((skill) => (
                    <SkillChip key={skill} label={skill} variant="detected" />
                  )) : <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>No se detectaron habilidades visibles.</p>}
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0F6E56", marginBottom: 8 }}>
                    ✓ Listas para tus matches
                  </p>
                  {result.skills.slice(0, 5).map((skill) => (
                    <SkillChip key={skill} label={skill} variant="match" />
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#991B1B", marginBottom: 8 }}>
                    Datos complementarios
                  </p>
                  <SkillChip label={result.locationCity || "Ciudad no detectada"} variant="detected" />
                  <SkillChip label={formatCurrency(result.expectedSalaryCop)} variant="detected" />
                  <SkillChip label={result.workPreference || "Modalidad no definida"} variant="detected" />
                </div>
              </div>
            </div>

            <div style={{
              padding: "18px 22px",
              background: "#0D3A8C",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap"
            }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "white", margin: "0 0 4px" }}>
                  ¿Lista para aplicar?
                </p>
                <p style={{ fontSize: 12, color: "#93C5FD", margin: 0 }}>
                  Tus datos ya están disponibles para recalcular vacantes compatibles.
                </p>
              </div>
              <button
                className="btn-primary"
                style={{ background: "#4CC9A4", color: "#0F172A" }}
                onClick={handleViewMatches}
                type="button"
              >
                Ver vacantes recomendadas →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
