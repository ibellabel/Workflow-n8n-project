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

    async findActiveUserById(userId) {
        const res = await db.query(
            'SELECT id, email, role FROM users WHERE id = $1 AND is_active = true',
            [userId]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    async findCandidateProfileByUserId(userId) {
        const res = await db.query(
            'SELECT id, full_name, profile_score FROM candidate_profiles WHERE user_id = $1', 
            [userId]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    async createCandidateAccount({ userId, email, fullName }) {
        return db.transaction(async (client) => {
            const userRes = await client.query(
                `INSERT INTO users (id, email, password_hash, role, is_active)
                 VALUES ($1, $2, $3, $4, true)
                 ON CONFLICT (id) DO UPDATE
                 SET email = EXCLUDED.email,
                     role = EXCLUDED.role,
                     is_active = true
                 RETURNING id, email, role`,
                [userId, email, 'supabase_auth', 'CANDIDATE']
            );

            let profileRes = await client.query(
                `UPDATE candidate_profiles
                 SET full_name = $2,
                     email = $3
                 WHERE user_id = $1
                 RETURNING id, user_id, full_name, email`,
                [userId, fullName, email]
            );

            if (profileRes.rows.length === 0) {
                profileRes = await client.query(
                    `INSERT INTO candidate_profiles (user_id, full_name, email)
                     VALUES ($1, $2, $3)
                     RETURNING id, user_id, full_name, email`,
                    [userId, fullName, email]
                );
            }

            return {
                user: userRes.rows[0],
                profile: profileRes.rows[0]
            };
        });
    }

    async createCompanyAccount({ userId, email, companyName, nit, headquarters }) {
        return db.transaction(async (client) => {
            const userRes = await client.query(
                `INSERT INTO users (id, email, password_hash, role, is_active)
                 VALUES ($1, $2, $3, $4, true)
                 ON CONFLICT (id) DO UPDATE
                 SET email = EXCLUDED.email,
                     role = EXCLUDED.role,
                     is_active = true
                 RETURNING id, email, role`,
                [userId, email, 'supabase_auth', 'COMPANY']
            );

            let companyRes = await client.query(
                `UPDATE companies
                 SET company_name = $2,
                     nit = $3,
                     headquarters = $4
                 WHERE user_id = $1
                 RETURNING id, user_id, company_name, nit, headquarters`,
                [userId, companyName, nit, headquarters]
            );

            if (companyRes.rows.length === 0) {
                companyRes = await client.query(
                    `INSERT INTO companies (user_id, company_name, nit, headquarters)
                     VALUES ($1, $2, $3, $4)
                     RETURNING id, user_id, company_name, nit, headquarters`,
                    [userId, companyName, nit, headquarters]
                );
            }

            return {
                user: userRes.rows[0],
                company: companyRes.rows[0]
            };
        });
    }
}

module.exports = new AuthModel();
