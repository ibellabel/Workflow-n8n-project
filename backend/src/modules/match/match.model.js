const db = require('../../config/db');

class MatchModel {
    async getCandidateById(candidateId) {
        const res = await db.query(
            `SELECT * FROM candidate_profiles WHERE user_id = $1 OR id = $1`,
            [candidateId]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    async getActiveJobs() {
        const res = await db.query(`SELECT * FROM jobs WHERE is_active = true`);
        return res.rows;
    }

    async insertAuditLog(action, candidateId, details) {
        await db.query(
            `INSERT INTO audit_logs (action, candidate_id, details) VALUES ($1, $2, $3)`, 
            [action, candidateId, JSON.stringify(details)]
        );
    }

    async insertApplication(candidateId, jobId, matchScore, matchReason, status) {
        await db.query(`
            INSERT INTO applications (candidate_id, job_id, match_score, match_reason, status)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (candidate_id, job_id) DO NOTHING
        `, [candidateId, jobId, matchScore, matchReason, status]);
    }

    async getTopMatches(candidateId) {
        const query = `
            SELECT j.id as job_id, j.title, j.location, a.match_score, a.match_reason, a.status 
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id 
            WHERE a.candidate_id = $1 
            ORDER BY a.match_score DESC 
            LIMIT 5
        `;
        const result = await db.query(query, [candidateId]);
        return result.rows;
    }

    async getCandidateStats(candidateId) {
        const query = `
            SELECT status, COUNT(*) as count 
            FROM applications 
            WHERE candidate_id = $1 
            GROUP BY status
        `;
        const result = await db.query(query, [candidateId]);
        return result.rows;
    }

    async getCandidateApplications(candidateId) {
        const query = `
            SELECT
                a.id,
                a.status,
                a.match_score,
                a.updated_at,
                j.id as job_id,
                j.title,
                j.location,
                u.email as company_email
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            LEFT JOIN users u ON j.company_id = u.id
            WHERE a.candidate_id = $1
            ORDER BY a.updated_at DESC NULLS LAST, a.match_score DESC NULLS LAST
        `;
        const result = await db.query(query, [candidateId]);
        return result.rows;
    }
}

module.exports = new MatchModel();
