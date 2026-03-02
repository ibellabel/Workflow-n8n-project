const scoringService = require('../services/scoring.service');
const db = require('../config/db');

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
