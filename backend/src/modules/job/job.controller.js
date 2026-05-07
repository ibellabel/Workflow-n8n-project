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

exports.getCompanyDashboard = async (req, res) => {
    try {
        const { company_id } = req.params;
        if (!company_id) return res.status(400).json({ error: "Falta company_id en la ruta." });

        const company = await jobModel.findCompanyById(company_id);
        if (!company) {
            return res.status(404).json({ error: "Empresa no encontrada o inactiva." });
        }

        const dashboard = await jobModel.getCompanyDashboard(company_id);
        res.json({
            company: {
                id: company.id,
                email: company.email
            },
            ...dashboard
        });
    } catch (error) {
        console.error("Error en getCompanyDashboard controller:", error);
        res.status(500).json({ error: "Error interno al obtener el dashboard de empresa." });
    }
};

exports.getJobApplicants = async (req, res) => {
    try {
        const { job_id } = req.params;
        const { company_id } = req.query;

        if (!job_id) return res.status(400).json({ error: "Falta job_id en la ruta." });
        if (!company_id) return res.status(400).json({ error: "Falta company_id en los parámetros." });

        const applicants = await jobModel.getJobApplicants(job_id, company_id);
        res.json({ job_id, applicants });
    } catch (error) {
        console.error("Error en getJobApplicants controller:", error);
        res.status(500).json({ error: "Error interno al obtener postulantes de la vacante." });
    }
};

exports.createCompanyJob = async (req, res) => {
    try {
        const { company_id } = req.params;
        const {
            title,
            location,
            salary_range_min_cop,
            salary_range_max_cop,
            skills_required,
            english_level,
            experience_years,
            is_active
        } = req.body;

        if (!company_id) return res.status(400).json({ error: "Falta company_id en la ruta." });
        if (!title || !title.trim()) return res.status(400).json({ error: "El título de la vacante es requerido." });

        const company = await jobModel.findCompanyById(company_id);
        if (!company) {
            return res.status(404).json({ error: "Empresa no encontrada o inactiva." });
        }

        const requirements = {
            skills_required: Array.isArray(skills_required)
                ? skills_required.filter(Boolean)
                : String(skills_required || '').split(',').map((skill) => skill.trim()).filter(Boolean),
            english_level: english_level || null,
            experience_years: experience_years ? Number(experience_years) : null
        };

        const job = await jobModel.createCompanyJob(company_id, {
            title: title.trim(),
            location,
            salary_range_min_cop,
            salary_range_max_cop,
            requirements,
            is_active
        });

        res.status(201).json({ message: "Oferta laboral creada exitosamente.", job });
    } catch (error) {
        console.error("Error en createCompanyJob controller:", error);
        res.status(500).json({ error: "Error interno al crear la oferta laboral." });
    }
};
