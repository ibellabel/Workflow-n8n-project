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

    async updateProfileById(id, updates) {
    const fields = [];
    const values = [];
    let index = 1;

    if (updates.full_name !== undefined) {
        fields.push(`full_name = $${index++}`);
        values.push(updates.full_name);
    }

    if (updates.location_city !== undefined) {
        fields.push(`location_city = $${index++}`);
        values.push(updates.location_city);
    }

    if (updates.expected_salary_cop !== undefined) {
        fields.push(`expected_salary_cop = $${index++}`);
        values.push(updates.expected_salary_cop);
    }

    if (updates.work_preferences !== undefined) {
        fields.push(`work_preferences = $${index++}`);
        values.push(
            Array.isArray(updates.work_preferences)
                ? JSON.stringify(updates.work_preferences)
                : updates.work_preferences
        );
    }

    if (updates.auto_apply_enabled !== undefined) {
        fields.push(`auto_apply_enabled = $${index++}`);
        values.push(Boolean(updates.auto_apply_enabled));
    }

    if (updates.parsed_cv_data !== undefined) {
        fields.push(`parsed_cv_data = $${index++}::jsonb`);
        values.push(JSON.stringify(updates.parsed_cv_data));
    }

    if (fields.length === 0) {
        return this.getProfileById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
        UPDATE candidate_profiles
        SET ${fields.join(", ")}
        WHERE id = $${index} OR user_id = $${index}
        RETURNING *
    `;

    const res = await db.query(query, values);
    return res.rows.length > 0 ? res.rows[0] : null;
}

    async updateProfileData(id, score, feedbackStr, updates) {
        const { expected_salary_cop, location_city, work_preferences, parsed_cv_data } = updates;
        
        let query = `UPDATE candidate_profiles SET profile_score = $1, feedback_notes = $2`;
        let values = [score, feedbackStr];
        let paramIndex = 3;

        if (expected_salary_cop !== undefined) {
            query += `, expected_salary_cop = $${paramIndex++}`;
            values.push(expected_salary_cop);
        }
        if (location_city !== undefined) {
            query += `, location_city = $${paramIndex++}`;
            values.push(location_city);
        }
        if (work_preferences !== undefined) {
            query += `, work_preferences = $${paramIndex++}`;
            values.push(typeof work_preferences === 'string' ? JSON.stringify(work_preferences) : work_preferences);
        }
        if (parsed_cv_data !== undefined) {
            query += `, parsed_cv_data = $${paramIndex++}`;
            values.push(parsed_cv_data);
        }

        query += `, updated_at = NOW() WHERE id = $${paramIndex}`;
        values.push(id);

        await db.query(query, values);
    }

    async insertAuditLog(action, candidateId, details) {
        await db.query(
            `INSERT INTO audit_logs (action, candidate_id, details) VALUES ($1, $2, $3)`, 
            [action, candidateId, JSON.stringify(details)]
        );
    }
}

module.exports = new ProfileModel();
