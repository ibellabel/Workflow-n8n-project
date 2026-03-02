const db = require('../config/db');

class ScoringService {
    async calculateScore(candidateData) {
        const { id, skills, expected_salary_cop, experience_years, location_city } = candidateData;
        
        // Base logic for scoring (simulating AI reasoning or NLP matching)
        let score = 50;
        let feedback = [];

        let is_incomplete = (!skills || skills.length === 0 || experience_years === undefined || !location_city);
        if (is_incomplete) {
            feedback.push("⚠️ Tu perfil está incompleto. Faltan habilidades, años de experiencia o ciudad. Completarlo mejorará considerablemente tus recomendaciones.");
            score -= 15;
        }

        if (skills && Array.isArray(skills)) {
            if (skills.length > 5) score += 20;
            else if (skills.length > 2) score += 10;
            else feedback.push("Intenta agregar más habilidades clave a tu perfil.");
        }

        if (experience_years > 3) score += 20;
        else feedback.push("Considera destacar proyectos personales para respaldar tu experiencia.");

        // Simulate salary evaluation against market
        const avgMarketSalary = 5000000;
        if (expected_salary_cop > avgMarketSalary + 2000000) {
            score -= 10;
            feedback.push(`Tu aspiración está por encima del promedio del mercado para este rol (${avgMarketSalary} COP). Resalta certificaciones clave o un nivel alto de inglés para justificarlo.`);
        }

        score = Math.min(100, Math.max(0, score));
        const feedbackStr = feedback.length > 0 ? feedback.join(" ") : "Perfil muy competitivo y alineado al mercado actual.";

        // Update real DB if id is provided
        if (id) {
            try {
                await db.query(
                    `UPDATE candidate_profiles SET profile_score = $1, feedback_notes = $2 WHERE id = $3`,
                    [score, feedbackStr, id]
                );
                
                // Generar el log de auditoria de AI (HU20)
                await db.query(
                    `INSERT INTO audit_logs (action, candidate_id, details) VALUES ('SCORING_CALCULATED', $1, $2)`, 
                    [id, JSON.stringify({ score, incomplete: is_incomplete, feedback: feedbackStr })]
                );
            } catch (err) {
                console.warn("No se pudo actualizar la BD (Score):", err.message);
            }
        }

        return { score, feedback: feedbackStr };
    }
}

module.exports = new ScoringService();
