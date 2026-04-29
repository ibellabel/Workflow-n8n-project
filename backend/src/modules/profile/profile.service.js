const profileModel = require('./profile.model');
const axios = require('axios');

class ProfileService {
    async calculateScore(candidateData) {
        const { id, skills, expected_salary_cop, experience_years, location_city, work_preference } = candidateData;
        
        // Base score for registering
        let score = 30;
        let feedback = [];

        // 1. Skills (Technical, Soft Skills, Languages) (Max +30)
        if (skills && Array.isArray(skills) && skills.length > 0) {
            if (skills.length >= 8) {
                score += 30;
                feedback.push("🌟 Excelente: Tienes una gran variedad de habilidades e idiomas registrados.");
            } else if (skills.length >= 4) {
                score += 20;
                feedback.push("✅ Bien: Tienes un buen conjunto de habilidades, pero agregar idiomas o competencias blandas (soft skills) podría destacar más tu perfil.");
            } else {
                score += 10;
                feedback.push("⚠️ Oportunidad: Tienes pocas habilidades registradas. Asegúrate de incluir conocimientos técnicos, herramientas y nivel de idiomas.");
            }
        } else {
            feedback.push("❌ Crítico: No tienes habilidades registradas. Las ofertas no podrán hacer match contigo.");
        }

        // 2. Experience Years (Max +15)
        if (experience_years !== undefined && experience_years !== null && experience_years !== 0) {
            score += 15;
            if (experience_years > 3) {
                feedback.push("✅ Experiencia sólida: Más de 3 años te posicionan bien para roles semi-senior o senior.");
            }
        } else {
            feedback.push("⚠️ Oportunidad: No has definido tus años de experiencia, o tienes 0. Destaca proyectos personales, voluntariados o prácticas académicas.");
        }

        // 3. Location (Max +10)
        if (location_city && location_city.trim() !== "") {
            score += 10;
        } else {
            feedback.push("⚠️ Oportunidad: Define tu ciudad de residencia para que te lleguen ofertas presenciales o híbridas.");
        }

        // 4. Expected Salary (Max +15)
        if (expected_salary_cop > 0) {
            score += 15;
            const avgMarketSalary = 5000000;
            if (expected_salary_cop > avgMarketSalary + 2000000) {
                feedback.push(`ℹ️ Información: Tu expectativa salarial ($${expected_salary_cop}) es más alta que el promedio actual ($${avgMarketSalary}). ¡Asegúrate de que tus habilidades y nivel de inglés lo justifiquen frente a los reclutadores!`);
            } else {
                feedback.push("✅ Bien: Tu expectativa salarial se encuentra dentro de rangos competitivos de mercado.");
            }
        } else {
            feedback.push("⚠️ Oportunidad: No has establecido una expectativa salarial. Muchos reclutadores filtran por este dato.");
        }

        let is_incomplete = score < 60;

        score = Math.min(100, Math.max(0, score));
        const feedbackStr = feedback.length > 0 ? feedback.join(" | ") : "Perfil estelar y alineado al mercado.";

        // Update real DB if id is provided using the Model
        if (id) {
            try {
                const parsedCvData = {
                    skills: skills || [],
                    experience_years: experience_years || 0
                };
                
                const updates = {
                    expected_salary_cop,
                    location_city,
                    work_preferences: work_preference,
                    parsed_cv_data: parsedCvData
                };

                await profileModel.updateProfileData(id, score, feedbackStr, updates);
                await profileModel.insertAuditLog('SCORING_CALCULATED', id, { score, incomplete: is_incomplete, feedback: feedbackStr, updates });
            } catch (err) {
                console.warn("No se pudo actualizar la BD (Score):", err.message);
            }
        }

        return { score, feedback: feedbackStr };
    }

    async triggerUploadCvWebhook(candidate_id, salary, work_preference, file) {
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/cv-upload'; 
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('cv', file.buffer, file.originalname);
        formData.append('candidate_id', candidate_id);
        formData.append('expected_salary_cop', salary);
        formData.append('work_preference', work_preference);
        
        const n8nRes = await axios.post(n8nWebhookUrl, formData, { headers: formData.getHeaders() });
        return n8nRes.data;
    }
}

module.exports = new ProfileService();
