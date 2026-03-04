const scoringService = require('../services/scoring.service');
const db = require('../config/db');
const axios = require('axios'); // Add axios for webhook call

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM candidate_profiles WHERE user_id = $1 OR id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Perfil no encontrado" });
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en getProfile:", error);
        res.status(500).json({ error: "Error interno al obtener el perfil." });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT a.id, a.match_score, a.match_reason, a.status, a.updated_at as date_applied, 
                   j.id as job_id, j.title, j.location, j.salary_range_min_cop, j.salary_range_max_cop,
                   u.email as company_email
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN users u ON j.company_id = u.id
            WHERE a.candidate_id = $1
            ORDER BY a.updated_at DESC
        `;
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error en getApplications:", error);
        res.status(500).json({ error: "Error interno al obtener postulaciones." });
    }
};

exports.scoreProfile = async (req, res) => {
    try {
        const { id, skills, expected_salary_cop, experience_years } = req.body;
        
        if (!skills || !expected_salary_cop) {
            return res.status(400).json({ error: "Faltan datos requeridos (skills, expected_salary_cop)" });
        }

        const result = await scoringService.calculateScore({ id, skills, expected_salary_cop, experience_years });
        
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
        const { candidate_id, salary, city } = req.body;
        const file = req.file;

        if (!candidate_id || !file) {
            return res.status(400).json({ error: "Faltan datos requeridos (candidate_id, cv file)" });
        }

        console.log(`[Upload CV] Recibido CV de candidate_id: ${candidate_id}, size: ${file.size} bytes`);

        // Llamar al Webhook de n8n pasando el archivo y los datos
        // URL asume que n8n está corriendo en local en el puerto 5678
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/cv-upload'; 
        
        try {
            // Use axios to send precisely a FormData object readable by n8n
            const FormData = require('form-data');
            const formData = new FormData();
            formData.append('cv', file.buffer, file.originalname);
            formData.append('candidate_id', candidate_id);
            formData.append('expected_salary_cop', salary);
            formData.append('city', city);
            
            const n8nRes = await axios.post(n8nWebhookUrl, formData, { headers: formData.getHeaders() });
            
            res.json({ message: "CV subido y procesado por n8n exitosamente", response: n8nRes.data });
        } catch (webhookError) {
             console.error("Error al notificar a n8n:", webhookError.message);
             res.status(502).json({ error: "No se pudo conectar con el flujo n8n", details: webhookError.message });
        }
    } catch (error) {
        console.error("Error en uploadCV controller:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar el CV." });
    }
};

exports.getTopMatches = async (req, res) => {
    try {
        const { candidate_id } = req.query;
        if (!candidate_id) return res.status(400).json({ error: "Falta candidate_id en los parámetros." });
        
        // MatchService ahora incluye getTopMatches
        const matchService = require('../services/match.service');
        const result = await matchService.getTopMatches(candidate_id);
        
        if (result.error) return res.status(500).json({ error: result.error });
        res.json(result);
    } catch (error) {
        console.error("Error en getTopMatches controller:", error);
        res.status(500).json({ error: "Error interno al obtener top matches." });
    }
};

exports.getStats = async (req, res) => {
    try {
        const { candidate_id } = req.query;
        if (!candidate_id) return res.status(400).json({ error: "Falta candidate_id en los parámetros." });
        
        const matchService = require('../services/match.service');
        const result = await matchService.getCandidateStats(candidate_id);
        
        if (result.error) return res.status(500).json({ error: result.error });
        res.json(result);
    } catch (error) {
        console.error("Error en getStats controller:", error);
        res.status(500).json({ error: "Error interno al obtener estadísticas." });
    }
};
