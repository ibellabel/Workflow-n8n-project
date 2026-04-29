const matchModel = require('./match.model');

class MatchService {

    async calculateAIAffinityBatch(candidate, jobs) {
        if (!process.env.GEMINI_API_KEY || jobs.length === 0) {
            console.warn("No GEMINI_API_KEY provided or no jobs available. Using basic algorithm.");
            return this.basicMatchAlgorithmBatch(candidate, jobs);
        }

        try {
            const { GoogleGenAI } = require('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            const candidateSkills = (candidate.parsed_cv_data && candidate.parsed_cv_data.skills) || [];
            const expectedSalary = candidate.expected_salary_cop;
            const workPrefs = candidate.work_preferences || {};

            const jobsList = jobs.map(j => ({
                id: j.id,
                title: j.title,
                skills: (j.requirements && j.requirements.skills) ? j.requirements.skills : [],
                max_salary: j.salary_range_max_cop,
                location: j.location
            }));

            const prompt = `Eres un reclutador experto. Evalúa la compatibilidad de un candidato con múltiples ofertas de trabajo.
Candidato:
- Habilidades: ${candidateSkills.join(', ')}
- Salario esperado: ${expectedSalary} COP
- Preferencias de trabajo: ${JSON.stringify(workPrefs)}

Ofertas de Trabajo:
${JSON.stringify(jobsList, null, 2)}

Para cada oferta, calcula un match_score (0 a 100). Considera similitud semántica (ej. 'React' es igual a 'ReactJS', 'Node' a 'Node.js').
Devuelve SOLO UN JSON válido con un arreglo llamado "matches" de la siguiente manera:
{
  "matches": [
    {
      "job_id": <id de la oferta>,
      "match_score": <número>,
      "match_reason": "<explicación breve de por qué diste ese puntaje>",
      "missing_skills": ["<habilidad que le falta 1>", "<habilidad que le falta 2>"]
    }
  ]
}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            let text = response.text;
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                text = text.substring(firstBrace, lastBrace + 1);
            }
            
            const result = JSON.parse(text);
            return result.matches || [];

        } catch (error) {
            console.error("Error llamando a Gemini, usando algoritmo básico:", error.message);
            return this.basicMatchAlgorithmBatch(candidate, jobs);
        }
    }

    basicMatchAlgorithmBatch(candidate, jobs) {
        const candidateSkills = (candidate.parsed_cv_data && candidate.parsed_cv_data.skills) || [];
        const userSkillsLower = candidateSkills.map(s => s.toLowerCase());
        const expectedSalary = candidate.expected_salary_cop;

        return jobs.map(job => {
            const jobSkills = (job.requirements && job.requirements.skills) ? job.requirements.skills : [];
            const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
            const commonSkills = jobSkillsLower.filter(s => userSkillsLower.includes(s));
            const missingSkills = jobSkillsLower.filter(s => !userSkillsLower.includes(s));
            const matchScore = jobSkillsLower.length > 0 ? (commonSkills.length / jobSkillsLower.length) * 100 : 0;
            
            let matchReason = `Compatibilidad del ${Math.round(matchScore)}% en habilidades clave.`;
            if (expectedSalary <= job.salary_range_max_cop) matchReason += " Salario alineado.";
            
            return {
                job_id: job.id,
                match_score: matchScore,
                match_reason: matchReason,
                missing_skills: missingSkills
            };
        });
    }

    async findMatches(candidateId) {
        try {
            const candidate = await matchModel.getCandidateById(candidateId);
            if (!candidate) throw new Error("Candidato no encontrado en Base de Datos");
            
            const candidateSkills = (candidate.parsed_cv_data && candidate.parsed_cv_data.skills) || [];
            if (candidateSkills.length === 0) {
                 await matchModel.insertAuditLog('AUTO_MATCH_FIRED', candidate.id, { error: 'No skills found' });
                 return { matches: [], error: "El candidato no tiene habilidades (skills) registradas en su CV." };
            }

            const autoApply = candidate.auto_apply_enabled !== false; 
            const jobs = await matchModel.getActiveJobs();
            
            // Calculamos el match de todos los jobs en una sola llamada usando IA (si hay API Key)
            const aiMatches = await this.calculateAIAffinityBatch(candidate, jobs);
            const matchedJobs = [];

            for (const aiMatch of aiMatches) {
                const job = jobs.find(j => j.id === aiMatch.job_id);
                if (!job) continue;

                if (aiMatch.match_score >= 50 && candidate.expected_salary_cop <= job.salary_range_max_cop) {
                    matchedJobs.push({
                        job_id: job.id,
                        title: job.title,
                        match_score: aiMatch.match_score,
                        match_reason: aiMatch.match_reason,
                        job_salary_max: job.salary_range_max_cop
                    });

                    if (autoApply) {
                        try {
                            await matchModel.insertApplication(candidate.id, job.id, aiMatch.match_score, aiMatch.match_reason, 'POSTULADO');
                        } catch (appErr) {
                             console.error("Error insertando postulación en BD:", appErr.message);
                        }
                    }
                }
            }

            await matchModel.insertAuditLog('AUTO_MATCH_FIRED', candidate.id, { matched_jobs_count: matchedJobs.length, auto_apply: autoApply });
            return { candidate_id: candidate.id, matches: matchedJobs };

        } catch (error) {
            console.error("Error en MatchService (findMatches):", error);
            return { error: error.message };
        }
    }

    async findAspirationalMatches(candidateId) {
        try {
            const candidate = await matchModel.getCandidateById(candidateId);
            if (!candidate) throw new Error("Candidato no encontrado en Base de Datos");
            
            const candidateSkills = (candidate.parsed_cv_data && candidate.parsed_cv_data.skills) || [];
            if (candidateSkills.length === 0) {
                 return { matches: [], error: "El candidato no tiene habilidades registradas para calcular metas aspiracionales." };
            }

            const jobs = await matchModel.getActiveJobs();
            const aiMatches = await this.calculateAIAffinityBatch(candidate, jobs);
            const aspirationalJobs = [];

            for (const aiMatch of aiMatches) {
                const job = jobs.find(j => j.id === aiMatch.job_id);
                if (!job) continue;

                // Definición de aspiracional: Match entre 10% y 49%
                if (aiMatch.match_score >= 10 && aiMatch.match_score < 50) {
                    aspirationalJobs.push({
                        job_id: job.id,
                        title: job.title,
                        company_id: job.company_id,
                        match_score: aiMatch.match_score,
                        missing_skills: aiMatch.missing_skills || [],
                        job_salary_max: job.salary_range_max_cop,
                        location: job.location
                    });
                }
            }

            // Ordenamos para mostrar los más alcanzables primero
            aspirationalJobs.sort((a, b) => b.match_score - a.match_score);

            return { candidate_id: candidate.id, matches: aspirationalJobs };
        } catch (error) {
            console.error("Error en findAspirationalMatches:", error);
            return { error: error.message };
        }
    }
}

module.exports = new MatchService();
