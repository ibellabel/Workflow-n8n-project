const db = require('../../config/db');

class JobModel {
    async findCompanyById(companyId) {
        const result = await db.query(
            `SELECT id, email FROM users WHERE id = $1 AND role = 'COMPANY' AND is_active = true`,
            [companyId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }

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

    async getCompanyDashboard(companyId) {
        const summaryQuery = `
            SELECT
                COUNT(DISTINCT j.id)::int as total_jobs,
                COUNT(DISTINCT j.id) FILTER (WHERE j.is_active = true)::int as active_jobs,
                COUNT(DISTINCT j.id) FILTER (WHERE j.is_active = false)::int as inactive_jobs,
                COUNT(a.id)::int as total_applications,
                COUNT(a.id) FILTER (WHERE a.status = 'POSTULADO')::int as new_applications,
                COUNT(a.id) FILTER (WHERE a.status = 'ENTREVISTA')::int as interview_applications,
                ROUND(COALESCE(AVG(a.match_score), 0), 1) as average_match_score
            FROM jobs j
            LEFT JOIN applications a ON a.job_id = j.id
            WHERE j.company_id = $1
        `;

        const jobsQuery = `
            SELECT
                j.id as job_id,
                j.title,
                j.location,
                j.salary_range_min_cop,
                j.salary_range_max_cop,
                j.requirements,
                j.is_active,
                COUNT(a.id)::int as total_candidates,
                COUNT(a.id) FILTER (WHERE a.status = 'POSTULADO')::int as new_candidates,
                COUNT(a.id) FILTER (WHERE a.status = 'ENTREVISTA')::int as interview_candidates,
                COUNT(a.id) FILTER (WHERE a.status = 'DESCARTADO')::int as rejected_candidates,
                ROUND(COALESCE(AVG(a.match_score), 0), 1) as average_match_score,
                COALESCE(MAX(a.updated_at), NULL) as last_application_at
            FROM jobs j
            LEFT JOIN applications a ON a.job_id = j.id
            WHERE j.company_id = $1
            GROUP BY j.id
            ORDER BY last_application_at DESC NULLS LAST, j.title ASC
        `;

        const statusQuery = `
            SELECT a.status, COUNT(a.id)::int as count
            FROM applications a
            JOIN jobs j ON j.id = a.job_id
            WHERE j.company_id = $1
            GROUP BY a.status
            ORDER BY count DESC
        `;

        const recentApplicantsQuery = `
            SELECT
                a.id as application_id,
                a.status,
                a.match_score,
                a.match_reason,
                a.updated_at,
                j.id as job_id,
                j.title as job_title,
                c.id as candidate_id,
                c.full_name,
                c.email,
                c.location_city,
                c.expected_salary_cop,
                c.profile_score,
                c.parsed_cv_data
            FROM applications a
            JOIN jobs j ON j.id = a.job_id
            JOIN candidate_profiles c ON c.id = a.candidate_id
            WHERE j.company_id = $1
            ORDER BY a.updated_at DESC NULLS LAST, a.match_score DESC NULLS LAST
            LIMIT 12
        `;

        const [summary, jobs, statusDistribution, recentApplicants] = await Promise.all([
            db.query(summaryQuery, [companyId]),
            db.query(jobsQuery, [companyId]),
            db.query(statusQuery, [companyId]),
            db.query(recentApplicantsQuery, [companyId])
        ]);

        return {
            summary: summary.rows[0],
            jobs: jobs.rows,
            status_distribution: statusDistribution.rows,
            recent_applicants: recentApplicants.rows
        };
    }

    async getJobApplicants(jobId, companyId) {
        const query = `
            SELECT
                a.id as application_id,
                a.status,
                a.match_score,
                a.match_reason,
                a.updated_at,
                c.id as candidate_id,
                c.full_name,
                c.email,
                c.location_city,
                c.expected_salary_cop,
                c.work_preferences,
                c.parsed_cv_data,
                c.profile_score
            FROM applications a
            JOIN jobs j ON j.id = a.job_id
            JOIN candidate_profiles c ON c.id = a.candidate_id
            WHERE a.job_id = $1 AND j.company_id = $2
            ORDER BY a.match_score DESC NULLS LAST, a.updated_at DESC NULLS LAST
        `;
        const result = await db.query(query, [jobId, companyId]);
        return result.rows;
    }

    async createCompanyJob(companyId, jobData) {
        const query = `
            INSERT INTO jobs (
                company_id,
                title,
                requirements,
                salary_range_min_cop,
                salary_range_max_cop,
                location,
                is_active
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id as job_id, title, requirements, salary_range_min_cop, salary_range_max_cop, location, is_active
        `;

        const result = await db.query(query, [
            companyId,
            jobData.title,
            JSON.stringify(jobData.requirements || {}),
            jobData.salary_range_min_cop || null,
            jobData.salary_range_max_cop || null,
            jobData.location || null,
            jobData.is_active !== false
        ]);

        return result.rows[0];
    }
}

module.exports = new JobModel();
