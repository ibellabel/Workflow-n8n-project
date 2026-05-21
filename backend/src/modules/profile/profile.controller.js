const profileModel = require('./profile.model');
const profileService = require('./profile.service');

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await profileModel.getProfileById(id);
        
        if (!profile) return res.status(404).json({ error: "Perfil no encontrado" });
        res.json(profile);
    } catch (error) {
        console.error("Error en getProfile:", error);
        res.status(500).json({ error: "Error interno al obtener el perfil." });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const { id } = req.params;
        const applications = await profileModel.getApplicationsByCandidateId(id);
        res.json(applications);
    } catch (error) {
        console.error("Error en getApplications:", error);
        res.status(500).json({ error: "Error interno al obtener postulaciones." });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            full_name,
            location_city,
            expected_salary_cop,
            work_preferences,
            auto_apply_enabled
        } = req.body;

        const existingProfile = await profileModel.getProfileById(id);
        if (!existingProfile) {
            return res.status(404).json({ error: "Perfil no encontrado" });
        }

        const updatedProfile = await profileModel.updateProfileById(id, {
            full_name,
            location_city,
            expected_salary_cop: expected_salary_cop === "" ? null : expected_salary_cop,
            work_preferences,
            auto_apply_enabled
        });

        res.json({
            message: "Perfil actualizado correctamente",
            profile: updatedProfile
        });
    } catch (error) {
        console.error("Error en updateProfile:", error);
        res.status(500).json({ error: "Error interno al actualizar el perfil." });
    }
};

exports.scoreProfile = async (req, res) => {
    try {
        const { id, skills, expected_salary_cop, experience_years, location_city, work_preference, work_preferences } = req.body;
        
        if (!skills || !expected_salary_cop) {
            return res.status(400).json({ error: "Faltan datos requeridos (skills, expected_salary_cop)" });
        }

        const wp = work_preferences || work_preference;

        const result = await profileService.calculateScore({ 
            id, skills, expected_salary_cop, experience_years, location_city, work_preference: wp 
        });
        
        res.json({
            profile_score: result.score,
            feedback_notes: result.feedback,
            status: "success"
        });
    } catch (error) {
        console.error("Error en scoreProfile controller:", error);
        res.status(500).json({ error: "Error interno del servidor al evaluar el score del usuario." });
    }
};

exports.uploadCV = async (req, res) => {
    try {
        const { candidate_id, salary, work_preference } = req.body;
        const file = req.file;

        if (!candidate_id || !file) {
            return res.status(400).json({ error: "Faltan datos requeridos (candidate_id, cv file)" });
        }

        console.log(`[Upload CV] Recibido CV de candidate_id: ${candidate_id}, size: ${file.size} bytes`);

        try {
            const responseData = await profileService.triggerUploadCvWebhook(candidate_id, salary, work_preference, file);
            res.json({ message: "CV subido y procesado por n8n exitosamente", response: responseData });
        } catch (webhookError) {
             console.error("Error al notificar a n8n:", webhookError.message);
             res.status(502).json({ error: "No se pudo conectar con el flujo n8n", details: webhookError.message });
        }
    } catch (error) {
        console.error("Error en uploadCV controller:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar el CV." });
    }
};
