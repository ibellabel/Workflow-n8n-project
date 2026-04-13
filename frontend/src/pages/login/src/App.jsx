import { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"

function App() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    getApplications()
  }, [])

async function getApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      match_score,
      updated_at,
      jobs (
        title,
        location,
        salary_range_min_cop,
        salary_range_max_cop,
        company_id
      )
    `)

  if (error) console.log(error)
  else setApplications(data)
}

function formatDate(dateString) {
  if (!dateString) return ""

  const date = new Date(dateString.replace(" ", "T"))

  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

return (
  <div style={{
    background:"#f4f6fb",
    minHeight:"100vh",
    padding:"50px",
    fontFamily:"Arial"
  }}>
    
    <h1 style={{
      color:"#111827",
      marginBottom:30,
      fontSize:32
    }}>
      Postulaciones recientes
    </h1>

    {applications.map(app => (
      <div
        key={app.id}
        style={{
          background:"white",
          borderRadius:18,
          padding:28,
          marginBottom:22,
          boxShadow:"0 10px 20px rgba(0,0,0,0.08)"
        }}
      >
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <div>
            <h2 style={{margin:0, color:"#111827"}}>
              {app.jobs?.title}
            </h2>
            <p style={{color:"#6b7280", marginTop:4}}>
              📍 {app.jobs?.location}
            </p>
          </div>

          <span style={{
            background:"#dcfce7",
            color:"#166534",
            padding:"6px 16px",
            borderRadius:999,
            fontWeight:"bold"
          }}>
            {app.status}
          </span>
        </div>

        <p style={{marginTop:18, color:"#374151"}}>
           {app.jobs?.salary_range_min_cop} - {app.jobs?.salary_range_max_cop} COP
        </p>

        <div style={{
          display:"flex",
          justifyContent:"space-between",
          marginTop:20,
          color:"#374151"
        }}>
          <span> Match score: <b>{app.match_score}</b></span>
          <span> {formatDate(app.updated_at)}</span>
        </div>

      </div>
    ))}
  </div>
)
}

export default App