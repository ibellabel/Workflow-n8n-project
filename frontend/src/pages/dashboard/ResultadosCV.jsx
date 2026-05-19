// ResultadosCV.jsx
// Página que muestra los resultados del análisis de la hoja de vida con IA.
//
// CÓMO USAR:
// 1. Guarda este archivo en: frontend/src/pages/dashboard/ResultadosCV.jsx
//
// 2. En tu App.jsx agrega la ruta:
//      <Route path="/dashboard/resultados" element={<ResultadosCV />} />
//
// 3. Cuando conectes la API, desde AnalizarCV navega así:
//      navigate('/dashboard/resultados', { state: { resultado } })

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────
// Mientras no tengas el backend, la página usa estos datos.
// Cuando conectes la API, el useLocation() los reemplaza automáticamente.

const MOCK_RESULTADO = {
  perfil: {
    nombre: 'Laura Gómez',
    titulo_profesional: 'Desarrolladora Full Stack',
    resumen_ia:
      'Profesional con 4 años de experiencia en desarrollo web, enfocada en React y Node.js. Ha liderado proyectos de e-commerce y fintech en equipos ágiles.',
    años_experiencia: 4,
    nivel: 'Intermedio',
  },
  score_total: 72,
  clasificacion: 'medio',
  veredicto: 'Perfil sólido, con brechas técnicas puntuales para el cargo deseado',
  dimensiones: {
    experiencia: 80,
    habilidades_tecnicas: 65,
    formacion: 70,
    presentacion: 78,
    alineacion_cargo: 68,
  },
  habilidades_detectadas: [
    'React', 'Node.js', 'TypeScript', 'PostgreSQL',
    'Git', 'REST APIs', 'Scrum', 'CSS', 'HTML',
  ],
  habilidades_match: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs'],
  habilidades_gap: ['Docker', 'AWS', 'Kubernetes', 'CI/CD'],
  recomendaciones: [
    {
      tipo: 'course',
      titulo: 'Aprende Docker y contenedores',
      detalle: 'Docker es requerido en el 80% de las ofertas para tu cargo. Un curso de 10 horas te pone al nivel.',
      impacto: 'Alto',
      recurso_url: 'https://www.docker.com/get-started/',
    },
    {
      tipo: 'tip',
      titulo: 'Agrega métricas a tu experiencia laboral',
      detalle: 'Cambia "desarrollé funcionalidades" por "reduje el tiempo de carga en 40%". Los números destacan.',
      impacto: 'Alto',
    },
    {
      tipo: 'warn',
      titulo: 'Tu CV no menciona trabajo en equipo',
      detalle: 'Las empresas buscan colaboración. Agrega una línea sobre metodologías ágiles o trabajo con equipos distribuidos.',
      impacto: 'Medio',
    },
    {
      tipo: 'course',
      titulo: 'Certificación AWS Cloud Practitioner',
      detalle: 'La nube es la brecha más grande en tu perfil para roles Senior. AWS tiene una certificación de entrada accesible.',
      impacto: 'Alto',
      recurso_url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    },
    {
      tipo: 'tip',
      titulo: 'Añade proyectos personales a GitHub',
      detalle: 'Un perfil de GitHub activo con al menos 3 proyectos propios incrementa la tasa de respuesta.',
      impacto: 'Medio',
    },
  ],
}

// ─── Helpers de color ─────────────────────────────────────────────────────────

function scoreColor(score) {
  if (score >= 75) return '#4CC9A4'
  if (score >= 50) return '#F5A623'
  return '#E24B4A'
}

function clasificacionLabel(c) {
  if (c === 'alto') return 'Perfil competitivo'
  if (c === 'medio') return 'Perfil en desarrollo'
  return 'Requiere mejoras'
}

function clasificacionColors(c) {
  if (c === 'alto') return { bg: '#E1F5EE', text: '#0F6E56' }
  if (c === 'medio') return { bg: '#FEF3C7', text: '#92400E' }
  return { bg: '#FEE2E2', text: '#991B1B' }
}

function impactoColor(i) {
  if (i === 'Alto') return { bg: '#FEE2E2', text: '#991B1B' }
  if (i === 'Medio') return { bg: '#FEF3C7', text: '#92400E' }
  return { bg: '#F3F4F6', text: '#6B7280' }
}

function tipoConfig(tipo) {
  if (tipo === 'tip')    return { bg: '#EFF6FF', border: '#BFDBFE', icon: '#1A4FBD', symbol: '↑' }
  if (tipo === 'warn')   return { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706', symbol: '⚠' }
  return                        { bg: '#F5F3FF', border: '#DDD6FE', icon: '#4F46E5', symbol: '◆' }
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(0)
  const color = scoreColor(score)
  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (animated / 100) * circ

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg
        width="130"
        height="130"
        viewBox="0 0 130 130"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle cx="65" cy="65" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>/100</span>
      </div>
    </div>
  )
}

function DimensionBar({ label, value, delay }) {
  const [width, setWidth] = useState(0)
  const color = scoreColor(value)

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300 + delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
      </div>
      <div style={{ height: 7, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.9s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>
    </div>
  )
}

function SkillChip({ label, variant }) {
  const styles = {
    detected: { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
    match:    { bg: '#E1F5EE', text: '#0F6E56', border: '#6EE7B7' },
    gap:      { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
  }
  const s = styles[variant]
  const prefix = variant === 'match' ? '✓ ' : variant === 'gap' ? '— ' : ''

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 99,
      fontSize: 12,
      background: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      margin: '3px',
    }}>
      {prefix}{label}
    </span>
  )
}

function RecommendationCard({ rec, index }) {
  const t = tipoConfig(rec.tipo)
  const imp = impactoColor(rec.impacto)

  return (
    <div style={{
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      padding: '14px 16px',
      opacity: 0,
      animation: 'fadeUp 0.4s ease forwards',
      animationDelay: `${index * 80}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Ícono */}
        <div style={{
          width: 28, height: 28,
          borderRadius: 8,
          background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: t.icon,
          flexShrink: 0,
          border: `1px solid ${t.border}`,
        }}>
          {t.symbol}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 8, marginBottom: 4, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
              {rec.titulo}
            </span>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 99,
              background: imp.bg, color: imp.text, fontWeight: 600,
            }}>
              {rec.impacto}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            {rec.detalle}
          </p>
          {rec.recurso_url && (
            <a
              href={rec.recurso_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block', marginTop: 8,
                fontSize: 12, color: '#4F46E5', fontWeight: 500, textDecoration: 'none',
              }}
            >
              Ver recurso →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ResultadosCV() {
  const location = useLocation()
  const navigate = useNavigate()

  // Toma los datos del navigate() o usa el mock mientras desarrollas
  const resultado = location.state?.resultado ?? MOCK_RESULTADO

  const clsColors = clasificacionColors(resultado.clasificacion)

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
        .btn-primary {
          background: #1A4FBD; color: white; border: none;
          border-radius: 10px; padding: 11px 20px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-primary:hover { background: #0D3A8C; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-outline {
          background: white; color: #1A4FBD;
          border: 1.5px solid #1A4FBD; border-radius: 10px;
          padding: 10px 20px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
        }
        .btn-outline:hover { background: #EFF6FF; }
        .card {
          background: white; border: 1px solid #E5E7EB;
          border-radius: 16px; padding: 20px 22px;
        }
        .section-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #94A3B8; margin-bottom: 12px;
        }
      `}</style>

      <div
        className="resultado-page"
        style={{
          minHeight: '100vh',
          background: '#F7F9FC',
          padding: '28px 32px',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 28,
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Resultados del análisis
            </h1>
            <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
              CV analizado con inteligencia artificial
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-outline" onClick={() => navigate('/dashboard/analizar-cv')}>
              ← Subir otro CV
            </button>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Ver vacantes →
            </button>
          </div>
        </div>

        {/* Score + Dimensiones */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.6fr',
          gap: 16, marginBottom: 16,
        }}>
          {/* Score */}
          <div className="card">
            <p className="section-label">Puntaje general</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <ScoreRing score={resultado.score_total} />
              <div>
                <span style={{
                  display: 'inline-block', padding: '4px 12px',
                  borderRadius: 99, fontSize: 11, fontWeight: 700,
                  background: clsColors.bg, color: clsColors.text, marginBottom: 8,
                }}>
                  {clasificacionLabel(resultado.clasificacion)}
                </span>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                  {resultado.veredicto}
                </p>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
                      {resultado.perfil.años_experiencia}
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 4 }}>años exp.</span>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: '#4F46E5',
                    background: '#F5F3FF', padding: '3px 10px', borderRadius: 8,
                  }}>
                    {resultado.perfil.nivel}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
                {resultado.perfil.nombre}
              </p>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                {resultado.perfil.titulo_profesional}
              </p>
            </div>

            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: '#F8FAFC', borderRadius: 10,
              borderLeft: '3px solid #1A4FBD',
            }}>
              <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {resultado.perfil.resumen_ia}
              </p>
            </div>
          </div>

          {/* Dimensiones */}
          <div className="card">
            <p className="section-label">Desglose del score</p>
            <DimensionBar label="Experiencia laboral"   value={resultado.dimensiones.experiencia}          delay={0} />
            <DimensionBar label="Habilidades técnicas"  value={resultado.dimensiones.habilidades_tecnicas} delay={80} />
            <DimensionBar label="Formación académica"   value={resultado.dimensiones.formacion}            delay={160} />
            <DimensionBar label="Presentación del CV"   value={resultado.dimensiones.presentacion}         delay={240} />
            <DimensionBar label="Alineación al cargo"   value={resultado.dimensiones.alineacion_cargo}     delay={320} />

            <div style={{
              display: 'flex', gap: 16, marginTop: 16,
              paddingTop: 14, borderTop: '1px solid #F3F4F6',
              fontSize: 11, color: '#94A3B8',
            }}>
              {[
                { color: '#4CC9A4', label: '75–100 Excelente' },
                { color: '#F5A623', label: '50–74 Bueno' },
                { color: '#E24B4A', label: '0–49 Mejorar' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Habilidades */}
        <div className="card" style={{ marginBottom: 16 }}>
          <p className="section-label">Habilidades</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Detectadas en tu CV
              </p>
              {resultado.habilidades_detectadas.map(h => (
                <SkillChip key={h} label={h} variant="detected" />
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0F6E56', marginBottom: 8 }}>
                ✓ Coinciden con el cargo
              </p>
              {resultado.habilidades_match.map(h => (
                <SkillChip key={h} label={h} variant="match" />
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#991B1B', marginBottom: 8 }}>
                — Te faltan estas
              </p>
              {resultado.habilidades_gap.map(h => (
                <SkillChip key={h} label={h} variant="gap" />
              ))}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 16,
          }}>
            <p className="section-label" style={{ margin: 0 }}>
              Recomendaciones para mejorar
            </p>
            <span style={{
              fontSize: 11, color: '#64748B',
              background: '#F1F5F9', padding: '3px 10px', borderRadius: 99,
            }}>
              {resultado.recomendaciones.length} sugerencias
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {resultado.recomendaciones.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          padding: '18px 22px', background: '#0D3A8C',
          borderRadius: 16, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>
              ¿Lista para aplicar?
            </p>
            <p style={{ fontSize: 12, color: '#93C5FD', margin: 0 }}>
              Encontramos vacantes compatibles con tu perfil actual
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ background: '#4CC9A4', color: '#0F172A' }}
            onClick={() => navigate('/dashboard')}
          >
            Ver vacantes recomendadas →
          </button>
        </div>
      </div>
    </>
  )
}