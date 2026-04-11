const db = require('../../config/db');

class AuthModel {
    async findActiveUserByEmail(email) {
        const res = await db.query(
            'SELECT id, email, role, password_hash FROM users WHERE email = $1 AND is_active = true', 
            [email]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    async updateLastLogin(userId) {
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1', 
            [userId]
        );
    }

    async findCandidateProfileByUserId(userId) {
        const res = await db.query(
            'SELECT id, full_name, profile_score FROM candidate_profiles WHERE user_id = $1', 
            [userId]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    }
}

module.exports = new AuthModel();
