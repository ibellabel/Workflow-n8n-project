const jobModel = require('./job.model');

exports.getJobRanking = async (req, res) => {
    try {
        const { job_id } = req.params;
        if (!job_id) return res.status(400).json({ error: "Falta job_id en la ruta." });
        
        const ranking = await jobModel.getJobRanking(job_id);
        res.json({ job_id, ranking });
    } catch (error) {
        console.error("Error en getJobRanking controller:", error);
        res.status(500).json({ error: "Error interno al obtener el ranking de la vacante." });
    }
};

exports.getCompanyJobs = async (req, res) => {
    try {
        const { company_id } = req.params;
        if (!company_id) return res.status(400).json({ error: "Falta company_id en la ruta." });
        
        const jobs = await jobModel.getCompanyJobs(company_id);
        res.json(jobs || []);
    } catch (error) {
        console.error("Error en getCompanyJobs controller:", error);
        res.status(500).json({ error: "Error interno al obtener las vacantes." });
    }
};
