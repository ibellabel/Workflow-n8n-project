const db = require('../../config/db');

class JobModel {
    async getJobRanking(jobId) {
        const query = `
            SELECT c.id as candidate_id, c.full_name, c.location_city, c.expected_salary_cop, c.parsed_cv_data, a.match_score, a.match_reason, a.status, a.updated_at 
            FROM applications a 
            JOIN candidate_profiles c ON a.candidate_id = c.id 
            WHERE a.job_id = $1 
            ORDER BY a.match_score DESC
        `;
        const result = await db.query(query, [jobId]);
        return result.rows;
    }

    async getCompanyJobs(companyId) {
        const query = `
            SELECT j.id as job_id, j.title, j.location, j.salary_range_max_cop,
                   COUNT(a.id) as total_candidates,
                   SUM(CASE WHEN a.status = 'POSTULADO' THEN 1 ELSE 0 END) as new_candidates
            FROM jobs j
            LEFT JOIN applications a ON j.id = a.job_id
            WHERE j.company_id = $1
            GROUP BY j.id
            ORDER BY j.id DESC
        `;
        const result = await db.query(query, [companyId]);
        return result.rows;
    }
}

module.exports = new JobModel();
