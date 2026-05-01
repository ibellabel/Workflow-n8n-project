const matchService = require('./match.service');
const matchModel = require('./match.model');

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

exports.getTopMatches = async (req, res) => {
    try {
        const { candidate_id } = req.query;
        if (!candidate_id) return res.status(400).json({ error: "Falta candidate_id en los parámetros." });
        
        const top_matches = await matchModel.getTopMatches(candidate_id);
        res.json({ candidate_id, top_matches });
    } catch (error) {
        console.error("Error en getTopMatches controller:", error);
        res.status(500).json({ error: "Error interno al obtener top matches." });
    }
};

exports.getStats = async (req, res) => {
    try {
        const { candidate_id } = req.query;
        if (!candidate_id) return res.status(400).json({ error: "Falta candidate_id en los parámetros." });
        
        const rawStats = await matchModel.getCandidateStats(candidate_id);
        
        const stats = { POSTULADO: 0, ENTREVISTA: 0, DESCARTADO: 0, TOTAL: 0 };
        rawStats.forEach(row => {
            stats[row.status] = parseInt(row.count, 10);
            stats.TOTAL += stats[row.status];
        });

        res.json({ candidate_id, stats });
    } catch (error) {
        console.error("Error en getStats controller:", error);
        res.status(500).json({ error: "Error interno al obtener estadísticas." });
    }
};

exports.getCandidateApplications = async (req, res) => {
    try {
        const { candidate_id } = req.query;
        if (!candidate_id) return res.status(400).json({ error: "Falta candidate_id en los parámetros." });

        const applications = await matchModel.getCandidateApplications(candidate_id);
        res.json({ candidate_id, applications });
    } catch (error) {
        console.error("Error en getCandidateApplications controller:", error);
        res.status(500).json({ error: "Error interno al obtener postulaciones del candidato." });
    }
};

exports.getAspirationalMatches = async (req, res) => {
    try {
        const { candidate_id } = req.query;
        if (!candidate_id) return res.status(400).json({ error: "Falta candidate_id en los parámetros." });
        
        const result = await matchService.findAspirationalMatches(candidate_id);
        
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        res.json({
            candidate_id: result.candidate_id,
            matches: result.matches,
            status: "success"
        });
    } catch (error) {
        console.error("Error en getAspirationalMatches controller:", error);
        res.status(500).json({ error: "Error interno en Match service buscando vacantes aspiracionales." });
    }
};
