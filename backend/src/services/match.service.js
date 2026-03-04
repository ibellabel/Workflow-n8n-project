const db = require('../config/db');

class MatchService {
    async findMatches(candidateId) {
        try {
            // Retrieve candidate from DB
            const candidateRes = await db.query(`SELECT * FROM candidate_profiles WHERE id = $1`, [candidateId]);
            if (candidateRes.rows.length === 0) throw new Error("Candidato no encontrado en Base de Datos");
            
            const candidate = candidateRes.rows[0];
            const candidateSkills = (candidate.parsed_cv_data && candidate.parsed_cv_data.skills) || [];
            if (candidateSkills.length === 0) {
                 await db.query(`INSERT INTO audit_logs (action, candidate_id, details) VALUES ('AUTO_MATCH_FIRED', $1, $2)`, [candidate.id, JSON.stringify({ error: 'No skills found' })]);
                 return { matches: [], error: "El candidato no tiene habilidades (skills) registradas en su CV." };
            }

            const workPrefs = candidate.work_preferences || {};
            const autoApply = candidate.auto_apply_enabled !== false; // por defecto true

            // Retrieve active jobs from DB
            const jobsRes = await db.query(`SELECT * FROM jobs WHERE is_active = true`);
            const jobs = jobsRes.rows;

            const matchedJobs = [];
            const userSkillsLower = candidateSkills.map(s => s.toLowerCase());

            for (const job of jobs) {
                const jobRequirements = job.requirements || {};
                const jobSkills = jobRequirements.skills || [];
                if (jobSkills.length === 0) continue;

                const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
                const commonSkills = jobSkillsLower.filter(s => userSkillsLower.includes(s));
                const matchScore = (commonSkills.length / jobSkillsLower.length) * 100;

                // Explicación textual generada como valor agregado (HU 13)
                const matchReasonParts = [];
                if (commonSkills.length > 0) {
                    matchReasonParts.push(`Compatibilidad del ${Math.round(matchScore)}% en habilidades clave (${commonSkills.join(', ')}).`);
                }
                if (workPrefs.modality && job.location && job.location.toLowerCase().includes(workPrefs.modality.toLowerCase())) {
                    matchReasonParts.push(`Modalidad de trabajo alineada a tus preferencias (${job.location}).`);
                }
                if (candidate.expected_salary_cop <= job.salary_range_max_cop) {
                    matchReasonParts.push(`Rango salarial ofertado cumple con tus expectativas.`);
                }
                const matchReason = matchReasonParts.join(' ');

                // Postulación Automática: Afinidad mayor al 50% y coincidencia de expectativas salariales
                if (matchScore >= 50 && candidate.expected_salary_cop <= job.salary_range_max_cop) {
                    matchedJobs.push({
                        job_id: job.id,
                        title: job.title,
                        match_score: matchScore,
                        match_reason: matchReason,
                        job_salary_max: job.salary_range_max_cop
                    });

                    // (HU14) Insertar aplicación automáticamente SOLAMENTE si auto-apply está encendido
                    if (autoApply) {
                        try {
                            await db.query(`
                                INSERT INTO applications (candidate_id, job_id, match_score, match_reason, status)
                                VALUES ($1, $2, $3, $4, 'POSTULADO')
                                ON CONFLICT (candidate_id, job_id) DO NOTHING
                            `, [candidate.id, job.id, matchScore, matchReason]);
                        } catch (appErr) {
                             console.error("Error insertando postulación en BD:", appErr.message);
                        }
                    }
                }
            }

            // Log de proceso global
            await db.query(
                `INSERT INTO audit_logs (action, candidate_id, details) VALUES ('AUTO_MATCH_FIRED', $1, $2)`, 
                [candidate.id, JSON.stringify({ matched_jobs_count: matchedJobs.length, auto_apply: autoApply })]
            );
            return { candidate_id: candidate.id, matches: matchedJobs };

        } catch (error) {
            console.error("Error in MatchService:", error);
            return { error: error.message };
        }
    }

    async getTopMatches(candidateId) {
        try {
            const query = `
                SELECT j.id as job_id, j.title, j.location, a.match_score, a.match_reason, a.status 
                FROM applications a 
                JOIN jobs j ON a.job_id = j.id 
                WHERE a.candidate_id = $1 
                ORDER BY a.match_score DESC 
                LIMIT 5
            `;
            const result = await db.query(query, [candidateId]);
            return { candidate_id: candidateId, top_matches: result.rows };
        } catch (error) {
            console.error("Error getting top matches:", error);
            return { error: error.message };
        }
    }

    async getJobRanking(jobId) {
        try {
            const query = `
                SELECT c.id as candidate_id, c.full_name, c.location_city, c.expected_salary_cop, c.parsed_cv_data, a.match_score, a.match_reason, a.status, a.updated_at 
                FROM applications a 
                JOIN candidate_profiles c ON a.candidate_id = c.id 
                WHERE a.job_id = $1 
                ORDER BY a.match_score DESC
            `;
            const result = await db.query(query, [jobId]);
            return { job_id: jobId, ranking: result.rows };
        } catch (error) {
            console.error("Error getting job ranking:", error);
            return { error: error.message };
        }
    }

    async getCandidateStats(candidateId) {
        try {
            const query = `
                SELECT status, COUNT(*) as count 
                FROM applications 
                WHERE candidate_id = $1 
                GROUP BY status
            `;
            const result = await db.query(query, [candidateId]);
            
            // Format stats beautifully
            const stats = { POSTULADO: 0, ENTREVISTA: 0, DESCARTADO: 0, TOTAL: 0 };
            result.rows.forEach(row => {
                stats[row.status] = parseInt(row.count, 10);
                stats.TOTAL += stats[row.status];
            });

            return { candidate_id: candidateId, stats };
        } catch (error) {
            console.error("Error getting candidate stats:", error);
            return { error: error.message };
        }
    }

    async getCompanyJobs(companyId) {
        try {
            const query = `
                SELECT j.id as job_id, j.title, j.location, j.salary_range_max_cop,
                       COUNT(a.id) as total_candidates,
                       SUM(CASE WHEN a.status = 'POSTULADO' THEN 1 ELSE 0 END) as new_candidates
                FROM jobs j
                LEFT JOIN applications a ON j.id = a.job_id
                WHERE j.company_id = $1
                GROUP BY j.id
                ORDER BY j.id DESC
            `;
            const result = await db.query(query, [companyId]);
            return { company_id: companyId, jobs: result.rows };
        } catch (error) {
            console.error("Error getting company jobs:", error);
            return { error: error.message };
        }
    }
}

module.exports = new MatchService();
