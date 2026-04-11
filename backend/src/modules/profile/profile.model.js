const db = require('../../config/db');

class ProfileModel {
    async getProfileById(id) {
        const res = await db.query(
            'SELECT * FROM candidate_profiles WHERE user_id = $1 OR id = $1',
            [id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    async getApplicationsByCandidateId(candidateId) {
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
        const res = await db.query(query, [candidateId]);
        return res.rows;
    }

    async updateProfileScore(id, score, feedbackStr) {
        await db.query(
            `UPDATE candidate_profiles SET profile_score = $1, feedback_notes = $2 WHERE id = $3`,
            [score, feedbackStr, id]
        );
    }

    async insertAuditLog(action, candidateId, details) {
        await db.query(
            `INSERT INTO audit_logs (action, candidate_id, details) VALUES ($1, $2, $3)`, 
            [action, candidateId, JSON.stringify(details)]
        );
    }
}

module.exports = new ProfileModel();
