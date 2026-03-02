const matchService = require('../services/match.service');
const db = require('../config/db');

exports.matchJobs = async (req, res) => {
    try {
        const { candidate_id } = req.body;

        if (!candidate_id) {
            return res.status(400).json({ error: "Falta candidate_id en el cuerpo de la petición. El identificador del candidato es crítico para la trazabilidad DB." });
        }

        const result = await matchService.findMatches(candidate_id);
        
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        res.json({
            candidate_id: result.candidate_id,
            matches: result.matches,
            status: "success"
        });
    } catch (error) {
        console.error("Error en matchJobs controller:", error);
        res.status(500).json({ error: "Error interno en Match service buscando vacantes." });
    }
};

exports.getJobRanking = async (req, res) => {
    try {
        const { job_id } = req.params;
        if (!job_id) return res.status(400).json({ error: "Falta job_id en la ruta." });
        
        const result = await matchService.getJobRanking(job_id);
        if (result.error) return res.status(500).json({ error: result.error });
        
        res.json(result);
    } catch (error) {
        console.error("Error en getJobRanking controller:", error);
        res.status(500).json({ error: "Error interno al obtener el ranking de la vacante." });
    }
};
