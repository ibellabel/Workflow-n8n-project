const matchModel = require('./match.model');

class MatchService {
    async findMatches(candidateId) {
        try {
            const candidate = await matchModel.getCandidateById(candidateId);
            if (!candidate) throw new Error("Candidato no encontrado en Base de Datos");
            
            const candidateSkills = (candidate.parsed_cv_data && candidate.parsed_cv_data.skills) || [];
            if (candidateSkills.length === 0) {
                 await matchModel.insertAuditLog('AUTO_MATCH_FIRED', candidate.id, { error: 'No skills found' });
                 return { matches: [], error: "El candidato no tiene habilidades (skills) registradas en su CV." };
            }

            const workPrefs = candidate.work_preferences || {};
            const autoApply = candidate.auto_apply_enabled !== false; 

            const jobs = await matchModel.getActiveJobs();
            const matchedJobs = [];
            const userSkillsLower = candidateSkills.map(s => s.toLowerCase());

            for (const job of jobs) {
                const jobRequirements = job.requirements || {};
                const jobSkills = jobRequirements.skills || [];
                if (jobSkills.length === 0) continue;

                const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
                const commonSkills = jobSkillsLower.filter(s => userSkillsLower.includes(s));
                const matchScore = (commonSkills.length / jobSkillsLower.length) * 100;

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

                if (matchScore >= 50 && candidate.expected_salary_cop <= job.salary_range_max_cop) {
                    matchedJobs.push({
                        job_id: job.id,
                        title: job.title,
                        match_score: matchScore,
                        match_reason: matchReason,
                        job_salary_max: job.salary_range_max_cop
                    });

                    if (autoApply) {
                        try {
                            await matchModel.insertApplication(candidate.id, job.id, matchScore, matchReason, 'POSTULADO');
                        } catch (appErr) {
                             console.error("Error insertando postulación en BD:", appErr.message);
                        }
                    }
                }
            }

            await matchModel.insertAuditLog('AUTO_MATCH_FIRED', candidate.id, { matched_jobs_count: matchedJobs.length, auto_apply: autoApply });
            return { candidate_id: candidate.id, matches: matchedJobs };

        } catch (error) {
            console.error("Error in MatchService:", error);
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
            const aspirationalJobs = [];
            const userSkillsLower = candidateSkills.map(s => s.toLowerCase());

            for (const job of jobs) {
                const jobRequirements = job.requirements || {};
                const jobSkills = jobRequirements.skills || [];
                if (jobSkills.length === 0) continue;

                const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
                const commonSkills = jobSkillsLower.filter(s => userSkillsLower.includes(s));
                const missingSkills = jobSkillsLower.filter(s => !userSkillsLower.includes(s));
                const matchScore = (commonSkills.length / jobSkillsLower.length) * 100;

                // Definición de aspiracional: Match entre 20% y 49%, indica que puede aplicar pronto si mejora skills
                if (matchScore >= 10 && matchScore < 50) {
                    aspirationalJobs.push({
                        job_id: job.id,
                        title: job.title,
                        company_id: job.company_id,
                        match_score: matchScore,
                        missing_skills: jobSkills.filter(s => missingSkills.includes(s.toLowerCase())),
                        job_salary_max: job.salary_range_max_cop,
                        location: job.location
                    });
                }
            }

            // Ordenamos para mostrar los más alcanzables primero
            aspirationalJobs.sort((a, b) => b.match_score - a.match_score);

            return { candidate_id: candidate.id, matches: aspirationalJobs };
        } catch (error) {
            console.error("Error in findAspirationalMatches:", error);
            return { error: error.message };
        }
    }
}

module.exports = new MatchService();
